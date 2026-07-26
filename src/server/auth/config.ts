import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";

// 1. Легальное расширение типов сессии в системном конфиге
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    password?: string | null;
  }
}

// 2. Экспорт чистой конфигурации для NextAuth без единого any
export const authConfig: NextAuthConfig = {
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: typeof token.sub === "string" ? token.sub : "",
          role: typeof token.role === "string" ? token.role : "USER",
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Шаг 1. Явно проверяем, что переданные учетные данные являются строками
        if (
          !credentials ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        // Шаг 2. Теперь TypeScript точно знает, что это строка. Вызов чист и безопасен
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (user?.password && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          };
        }
        return null;
      }

    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};
