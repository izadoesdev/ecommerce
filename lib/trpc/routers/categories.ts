import { z } from 'zod'
import { router, publicProcedure, adminProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

export const categoriesRouter = router({
    // Get all categories
    getAll: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.category.findMany({
            orderBy: { name: 'asc' },
        })
    }),

    // Get category by slug with products
    getBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            const category = await ctx.db.category.findUnique({
                where: { slug: input.slug },
                include: {
                    products: {
                        where: { status: 'PUBLISHED' },
                        include: {
                            variants: true,
                            category: true,
                        },
                    },
                },
            })

            if (!category) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Category not found',
                })
            }

            return category
        }),

    // Admin procedures
    admin: router({
        // Create category
        create: adminProcedure
            .input(z.object({
                name: z.string().min(1),
                description: z.string().optional(),
                image: z.string().url(),
            }))
            .mutation(async ({ ctx, input }) => {
                return await ctx.db.category.create({
                    data: {
                        ...input,
                        slug: input.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    },
                })
            }),

        // Update category
        update: adminProcedure
            .input(z.object({
                id: z.number(),
                name: z.string().min(1),
                description: z.string().optional(),
                image: z.string().url(),
            }))
            .mutation(async ({ ctx, input }) => {
                const { id, ...data } = input
                return await ctx.db.category.update({
                    where: { id },
                    data: {
                        ...data,
                        slug: input.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    },
                })
            }),

        // Delete category
        delete: adminProcedure
            .input(z.object({ id: z.number() }))
            .mutation(async ({ ctx, input }) => {
                return await ctx.db.category.delete({
                    where: { id: input.id },
                })
            }),
    }),
}) 