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

    // Full-text search for products with dynamic sorting and pagination
    search: publicProcedure
        .input(z.object({
            query: z.string().default(''),
            sortBy: z.enum(['relevance', 'newest', 'oldest', 'price-low', 'price-high', 'name']).default('newest'),
            categories: z.array(z.string()).default([]),
            filters: z.array(z.string()).default([]),
            page: z.number().min(1).default(1),
            limit: z.number().min(1).max(50).default(12),
        }))
        .query(async ({ ctx, input }) => {
            const { query, sortBy, categories, filters, page, limit } = input;
            const skip = (page - 1) * limit;

            // Build where clause
            const whereClause: any = {
                status: 'PUBLISHED',
            };

            // Add search query
            if (query) {
                whereClause.OR = [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { tags: { has: query.toLowerCase() } },
                ];
            }

            // Add category filters
            if (categories.length > 0) {
                whereClause.category = {
                    slug: { in: categories }
                };
            }

            // Add special filters
            if (filters.includes('featured')) {
                whereClause.featured = true;
            }
            if (filters.includes('new')) {
                whereClause.newArrival = true;
            }
            if (filters.includes('sale')) {
                whereClause.sale = true;
            }

            // Build order by clause
            let orderBy: any = { createdAt: 'desc' };
            switch (sortBy) {
                case 'newest':
                    orderBy = { createdAt: 'desc' };
                    break;
                case 'oldest':
                    orderBy = { createdAt: 'asc' };
                    break;
                case 'name':
                    orderBy = { name: 'asc' };
                    break;
                case 'price-low':
                case 'price-high':
                    // For price sorting, we'll need to handle this differently since price is in variants
                    // For now, we'll use createdAt and handle price sorting in the application
                    orderBy = { createdAt: 'desc' };
                    break;
                default:
                    orderBy = { createdAt: 'desc' };
            }

            // Get products and total count
            const [products, total] = await Promise.all([
                ctx.db.product.findMany({
                    where: whereClause,
                    include: {
                        category: true,
                        variants: true,
                    },
                    orderBy,
                    skip,
                    take: limit,
                }),
                ctx.db.product.count({
                    where: whereClause,
                })
            ]);

            // Handle price sorting in application since it's in variants
            if (sortBy === 'price-low' || sortBy === 'price-high') {
                products.sort((a, b) => {
                    const priceA = a.variants[0]?.salePrice || a.variants[0]?.price || 0;
                    const priceB = b.variants[0]?.salePrice || b.variants[0]?.price || 0;
                    return sortBy === 'price-low' ? priceA - priceB : priceB - priceA;
                });
            }

            return {
                products,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        }),

    // Infinite scroll version of search
    searchInfinite: publicProcedure
        .input(z.object({
            query: z.string().default(''),
            sortBy: z.enum(['relevance', 'newest', 'oldest', 'price-low', 'price-high', 'name']).default('newest'),
            categories: z.array(z.string()).default([]),
            filters: z.array(z.string()).default([]),
            limit: z.number().min(1).max(50).default(12),
            cursor: z.number().nullish(),
        }))
        .query(async ({ ctx, input }) => {
            const { query, sortBy, categories, filters, limit, cursor } = input;
            const page = cursor || 1;
            const skip = (page - 1) * limit;

            // Build where clause
            const whereClause: any = {
                status: 'PUBLISHED',
            };

            // Add search query
            if (query) {
                whereClause.OR = [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { tags: { has: query.toLowerCase() } },
                ];
            }

            // Add category filters
            if (categories.length > 0) {
                whereClause.category = {
                    slug: { in: categories }
                };
            }

            // Add special filters
            if (filters.includes('featured')) {
                whereClause.featured = true;
            }
            if (filters.includes('new')) {
                whereClause.newArrival = true;
            }
            if (filters.includes('sale')) {
                whereClause.sale = true;
            }

            // Build order by clause
            let orderBy: any = { createdAt: 'desc' };
            switch (sortBy) {
                case 'newest':
                    orderBy = { createdAt: 'desc' };
                    break;
                case 'oldest':
                    orderBy = { createdAt: 'asc' };
                    break;
                case 'name':
                    orderBy = { name: 'asc' };
                    break;
                case 'price-low':
                case 'price-high':
                    orderBy = { createdAt: 'desc' };
                    break;
                default:
                    orderBy = { createdAt: 'desc' };
            }

            // Get products and total count
            const [products, total] = await Promise.all([
                ctx.db.product.findMany({
                    where: whereClause,
                    include: {
                        category: true,
                        variants: true,
                    },
                    orderBy,
                    skip,
                    take: limit,
                }),
                ctx.db.product.count({
                    where: whereClause,
                })
            ]);

            // Handle price sorting in application since it's in variants
            if (sortBy === 'price-low' || sortBy === 'price-high') {
                products.sort((a, b) => {
                    const priceA = a.variants[0]?.salePrice || a.variants[0]?.price || 0;
                    const priceB = b.variants[0]?.salePrice || b.variants[0]?.price || 0;
                    return sortBy === 'price-low' ? priceA - priceB : priceB - priceA;
                });
            }

            const totalPages = Math.ceil(total / limit);
            const nextCursor = page < totalPages ? page + 1 : undefined;

            return {
                products,
                total,
                page,
                limit,
                totalPages,
                nextCursor,
            };
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