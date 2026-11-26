import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const leadRouter = createTRPCRouter({
    create: publicProcedure
        .input(
            z.object({
                name: z.string().min(2, "Укажите ваше имя (минимум 2 символа)"),
                contact: z.string().min(5, "Укажите телефон, Telegram или Email"),
                serviceSlug: z.string().optional(),
                message: z.string().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.lead.create({
                data: {
                    name: input.name,
                    contact: input.contact,
                    serviceSlug: input.serviceSlug ?? null,
                    message: input.message ?? null,
                },
            });
        }),
});
