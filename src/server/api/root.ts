// Заменили '@/server/api/trpc' на '~/server/api/trpc'
import { createTRPCRouter } from "~/server/api/trpc";
import { servicesRouter } from "./routers/services";
import { mediaRouter } from "./routers/media";
import { adminRouter } from "./routers/admin";

export const appRouter = createTRPCRouter({
  services: servicesRouter,
  media: mediaRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
