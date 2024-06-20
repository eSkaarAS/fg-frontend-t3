import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const todoRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.create({
        data: {
          description: input.description,
        },
      });
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.string(), completed: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.update({
        where: { id: input.id },
        data: {
          isCompleted: input.completed,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.delete({
        where: { id: input.id },
      });
    }),

  findAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
});
