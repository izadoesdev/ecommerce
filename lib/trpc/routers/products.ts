import { z } from 'zod'
import { router, publicProcedure, adminProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { Prisma } from '@/lib/generated/prisma/client'

export const productsRouter = router({
    // Get all published products
    getAll: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.product.findMany({
            where: { status: 'PUBLISHED' },
            include: {
                category: true,
                variants: true,
            },
            orderBy: { createdAt: 'desc' },
        })
    }),

    // Get featured products
    getFeatured: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.product.findMany({
            where: {
                status: 'PUBLISHED',
                featured: true
            },
            include: {
                category: true,
                variants: true,
            },
            take: 8,
        })
    }),

    // Get new arrival products
    getNewArrivals: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.product.findMany({
            where: {
                status: 'PUBLISHED',
                newArrival: true
            },
            include: {
                category: true,
                variants: true,
            },
            take: 8,
        })
    }),

    // Get sale products
    getSale: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.product.findMany({
            where: {
                status: 'PUBLISHED',
                sale: true
            },
            include: {
                category: true,
                variants: true,
            },
            take: 8,
        })
    }),

    // Get product by slug
    getBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            const product = await ctx.db.product.findUnique({
                where: {
                    slug: input.slug,
                    status: 'PUBLISHED'
                },
                include: {
                    category: true,
                    variants: true,
                },
            })

            if (!product) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Product not found',
                })
            }

            return product
        }),

    // Full-text search for products with dynamic sorting
    search: publicProcedure
        .input(z.object({
            query: z.string(),
            sortBy: z.enum(['relevance', 'newest', 'price-asc', 'price-desc']).default('relevance'),
        }))
        .query(async ({ ctx, input }) => {
            const { query } = input;

            return await ctx.db.product.findMany({
                where: {
                    status: 'PUBLISHED',
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                        { tags: { has: query.toLowerCase() } },
                    ],
                },
                include: {
                    category: true,
                    variants: true,
                },
                orderBy: { createdAt: 'desc' },
            });
        }),

    // Get related products (from the same category)
    getRelated: publicProcedure
        .input(z.object({
            categoryId: z.number(),
            currentProductId: z.number(),
        }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.product.findMany({
                where: {
                    categoryId: input.categoryId,
                    id: { not: input.currentProductId }, // Exclude the current product
                    status: 'PUBLISHED',
                },
                include: {
                    category: true,
                    variants: true,
                },
                take: 4, // Limit to 4 related products
            })
        }),

    // Get products by category
    getByCategory: publicProcedure
        .input(z.object({ categorySlug: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.product.findMany({
                where: {
                    status: 'PUBLISHED',
                    category: {
                        slug: input.categorySlug,
                    },
                },
                include: {
                    category: true,
                    variants: true,
                },
                orderBy: { createdAt: 'desc' },
            })
        }),

    // Admin procedures
    admin: router({
        // Get all products (including drafts) for admin
        getAll: adminProcedure.query(async ({ ctx }) => {
            return await ctx.db.product.findMany({
                include: {
                    category: true,
                    variants: true,
                },
                orderBy: { createdAt: 'desc' },
            })
        }),

        // Create product
        create: adminProcedure
            .input(z.object({
                name: z.string().min(1),
                description: z.string(),
                categoryId: z.number(),
                price: z.number().min(0),
                stock: z.number().min(0),
                images: z.array(z.string()),
                status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
                featured: z.boolean().optional(),
                newArrival: z.boolean().optional(),
                sale: z.boolean().optional(),
            }))
            .mutation(async ({ ctx, input }) => {
                const { price, stock, images, ...productData } = input

                return await ctx.db.product.create({
                    data: {
                        ...productData,
                        slug: input.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                        featured: input.featured ?? false,
                        newArrival: input.newArrival ?? false,
                        sale: input.sale ?? false,
                        variants: {
                            create: [
                                {
                                    price,
                                    stock,
                                    images,
                                    options: {},
                                },
                            ],
                        },
                    },
                    include: {
                        category: true,
                        variants: true,
                    },
                })
            }),

        // Update product
        update: adminProcedure
            .input(z.object({
                id: z.number(),
                name: z.string().min(1),
                description: z.string(),
                categoryId: z.number(),
                price: z.number().min(0),
                stock: z.number().min(0),
                images: z.array(z.string()),
                status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
                featured: z.boolean().optional(),
                newArrival: z.boolean().optional(),
                sale: z.boolean().optional(),
            }))
            .mutation(async ({ ctx, input }) => {
                const { id, price, stock, images, ...productData } = input

                return await ctx.db.product.update({
                    where: { id },
                    data: {
                        ...productData,
                        slug: input.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                        featured: input.featured ?? false,
                        newArrival: input.newArrival ?? false,
                        sale: input.sale ?? false,
                        variants: {
                            updateMany: {
                                where: { productId: id },
                                data: {
                                    price,
                                    stock,
                                    images,
                                },
                            },
                        },
                    },
                    include: {
                        category: true,
                        variants: true,
                    },
                })
            }),

        // Delete product
        delete: adminProcedure
            .input(z.object({ id: z.number() }))
            .mutation(async ({ ctx, input }) => {
                return await ctx.db.product.delete({
                    where: { id: input.id },
                })
            }),

        // Delete multiple products
        deleteMany: adminProcedure
            .input(z.object({ ids: z.array(z.number()) }))
            .mutation(async ({ ctx, input }) => {
                return await ctx.db.product.deleteMany({
                    where: {
                        id: {
                            in: input.ids,
                        },
                    },
                })
            }),
    }),
}) 