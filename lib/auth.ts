import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Fallback in case ADMIN_EMAIL/ADMIN_PASSWORD_HASH are missing or
// misconfigured in the deploy environment (this happened once already —
// Next.js's $-expansion in .env files silently corrupted the hash). The
// fallback is the same bcrypt hash as .env, never the plaintext password,
// so it stays safe to commit.
const FALLBACK_ADMIN_EMAIL = "speckliningbel@yandex.by";
const FALLBACK_ADMIN_PASSWORD_HASH = "$2b$10$MOPQRYsXtmrWwnxirpYWd.HLT4HqW42ephY7l3mWr7K/pGAZfVR3m";

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
      // Single hardcoded admin — no accounts/DB. Credentials live in env
      // (ADMIN_PASSWORD_HASH is a bcrypt hash, never the plaintext), with a
      // baked-in fallback if env is missing/broken (see FALLBACK_* above).
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

        const adminEmail = process.env.ADMIN_EMAIL || FALLBACK_ADMIN_EMAIL;
        const adminHash = process.env.ADMIN_PASSWORD_HASH || FALLBACK_ADMIN_PASSWORD_HASH;

        console.log('Env check:', {
          adminEmail: adminEmail,
          usingEnvHash: !!process.env.ADMIN_PASSWORD_HASH,
          adminHashLength: adminHash.length
        });

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
