import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "~/server/db";

/**
 * Расширение типов (Module Augmentation) для next-auth.
 * Позволяет TypeScript знать, что в объекте session.user гарантированно есть id.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
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
        const configuredLogin = process.env.AUTH_ADMIN_LOGIN;
        const configuredPassword = process.env.AUTH_ADMIN_PASSWORD;

        if (
          !configuredLogin ||
          !configuredPassword ||
          login !== configuredLogin ||
          password !== configuredPassword
        ) {
          return null;
        }

        return {
          id: configuredLogin,
          name: configuredLogin,
          email: configuredLogin,
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
    }),
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: String(token.userId ?? token.sub ?? ""),
      },
    }),
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
