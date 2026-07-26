import NextAuth from "next-auth";
import { authConfig } from "./config";

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Экспортируем серверную функцию под привычным нам именем
export const getServerAuthSession = () => auth();
