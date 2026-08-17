import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log('=== AUTHORIZE CALLED ===');

        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        console.log('Credentials:', {
          email: email,
          passwordLength: password?.length || 0
        });

        if (typeof email !== "string" || typeof password !== "string") {
          console.log('Invalid types');
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminHash = process.env.ADMIN_PASSWORD_HASH;

        console.log('Env check:', {
          adminEmail: adminEmail,
          adminHashExists: !!adminHash,
          adminHashLength: adminHash?.length || 0
        });

        if (!adminEmail || !adminHash) {
          console.log('Missing env vars');
          return null;
        }

        if (email !== adminEmail) {
          console.log('Email mismatch:', {
            provided: email,
            expected: adminEmail
          });
          return null;
        }

        console.log('Comparing passwords...');
        const valid = await bcrypt.compare(password, adminHash);
        console.log('Password valid:', valid);

        if (!valid) {
          console.log('Invalid password');
          return null;
        }

        console.log('✅ Auth successful!');
        return {
          id: "admin",
          email: adminEmail,
          role: "ADMIN"
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      console.log('=== JWT CALLBACK ===');
      console.log('User:', user);
      if (user) {
        token.role = (user as { role: string }).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      console.log('=== SESSION CALLBACK ===');
      console.log('Token:', token);
      if (session.user) {
        session.user.role = token.role as string | undefined;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
