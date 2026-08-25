import { marketingRouter } from "~/server/api/routers/marketing";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * Главный роутер сервера. Сюда подключен маркетинг.
 */
export const appRouter = createTRPCRouter({
  marketing: marketingRouter,

  // Добавляем алиас 'post', чтобы админка получила доступ к процедурам без изменения фронтенда!
  post: marketingRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
