import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";

export const authOptions: NextAuthOptions = {
    callbacks: {
        session: ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
                role: token.role ?? "USER", // Передаем роль в сессию
            },
        }),
        jwt: ({ token, user }) => {
            if (user) {
                token.role = (user as any).role;
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
                if (!credentials?.email || !credentials?.password) return null;

                // Поиск пользователя в PostgreSQL через Prisma
                const user = await db.user.findUnique({
                    where: { email: credentials.email },
                });

                // В будущем здесь будет проверка хэша пароля (например, через bcrypt)
                if (user && user.password === credentials.password) {
                    return { id: user.id, name: user.name, email: user.email, role: user.role };
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

export const getServerAuthSession = () => getServerSession(authOptions);
