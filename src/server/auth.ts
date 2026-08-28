import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "~/server/db";

/**
 * Расширение типов (Module Augmentation) для next-auth.
 * Позволяет TypeScript знать, что в объекте session.user гарантированно есть id.
 */
declare module "next-auth" {
  interface User {
    role: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}
/**
 * Основная конфигурация NextAuth.js.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      credentials: {
        login: { label: "Логин", type: "text" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        const login = String(credentials?.login ?? "").trim();
        const password = String(credentials?.password ?? "");
        if (!login || !password) {
          return null;
        }

        const user = await db.user.findUnique({ where: { login } });
        if (
          !user?.passwordHash ||
          !(await bcrypt.compare(password, user.passwordHash))
        ) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    jwt: ({ token, user }) => ({
      ...token,
      ...(user?.id ? { userId: user.id } : {}),
      ...(user?.role ? { role: user.role } : {}),
    }),
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: String(token.userId ?? token.sub ?? ""),
        role: String(token.role ?? "user"),
      },
    }),
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
