// import { postRouter } from "~/server/api/routers/post";
import { marketingRouter } from "~/server/api/routers/marketing";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * Это главный роутер для вашего сервера.
 * Сюда мы вручную добавляем все новые под-роутеры из папки /routers.
 */
export const appRouter = createTRPCRouter({
  marketing: marketingRouter,
});


// Экспорт типа API для фронтенда (обеспечивает сквозную типизацию tRPC)
export type AppRouter = typeof appRouter;

/**
 * Создает серверный вызов (caller) для tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^ Post[]
 */
export const createCaller = createCallerFactory(appRouter);
