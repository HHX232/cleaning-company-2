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
      // Single hardcoded admin — no accounts/DB. Credentials live in env
      // (ADMIN_PASSWORD_HASH is a bcrypt hash, never the plaintext).
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string")
          return null;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminHash = process.env.ADMIN_PASSWORD_HASH;
        if (!adminEmail || !adminHash) return null;
        if (email !== adminEmail) return null;

        const valid = await bcrypt.compare(password, adminHash);
        if (!valid) return null;

        return { id: "admin", email: adminEmail, role: "ADMIN" };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as string | undefined;
      session.user.id = token.id as string;
      return session;
    },
  },
});
