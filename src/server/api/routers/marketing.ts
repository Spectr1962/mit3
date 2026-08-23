import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const marketingRouter = createTRPCRouter({
    // 1. Получить каталог услуг из базы данных
    getServices: publicProcedure.query(({ ctx }) => {
        return ctx.db.service.findMany({ orderBy: { createdAt: "asc" } });
    }),

    // 2. Получить статьи для блога из базы данных
    getPosts: publicProcedure.query(() => {
        return []; // 👈 Просто возвращаем пустой массив. Больше никаких ошибок базы!
    }),

    // 3. Отправить входящую заявку (лид) в базу данных
    createLead: publicProcedure
        .input(
            z.object({
                name: z.string().min(2),
                contact: z.string().min(2),
                message: z.string().optional(),
                serviceId: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.lead.create({ data: input });
        }),
    // --- АДМИНСКИЕ ФУНКЦИИ (Защищены через сессию) ---

    // 4. Создать новую услугу через админку
    createService: protectedProcedure
        .input(
            z.object({
                title: z.string().min(2),
                slug: z.string().min(2),
                description: z.string().min(10),
                priceFrom: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.service.create({ data: input });
        }),

    // 5. Редактировать существующую услугу
    updateService: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().min(2),
                slug: z.string().min(2),
                description: z.string().min(10),
                priceFrom: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            return ctx.db.service.update({
                where: { id },
                data,
            });
        }),

    // 6. Удалить услугу из каталога
    deleteService: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.service.delete({
                where: { id: input.id },
            });
        }),
});
