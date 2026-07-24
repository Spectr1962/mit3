import { createTRPCRouter, createCallerFactory } from "~/server/api/trpc"; // Добавили импорт фабрики
import { servicesRouter } from "./routers/services";
import { mediaRouter } from "./routers/media";
import { adminRouter } from "./routers/admin";

export const appRouter = createTRPCRouter({
  services: servicesRouter,
  media: mediaRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;

// ВАЖНО: Добавили фабрику экспорта, которую требует файл src/trpc/server.ts
export const createCaller = createCallerFactory(appRouter);
