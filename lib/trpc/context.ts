import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import db from '@/lib/db'
import DataLoader from 'dataloader'
import type { Category } from '@/lib/generated/prisma'

export async function createTRPCContext(
    opts: CreateNextContextOptions | FetchCreateContextFnOptions
) {
    // Create a new DataLoader for each request
    const categoryLoader = new DataLoader<number, Category>(async (keys) => {
        const categories = await db.category.findMany({
            where: { id: { in: [...keys] } },
        })
        const categoryMap = new Map(categories.map((cat) => [cat.id, cat]))
        return keys.map((key) => categoryMap.get(key) || new Error(`No category with id ${key}`))
    })

    const contextInner = {
        db,
        loaders: {
            category: categoryLoader,
        },
        req: opts.req,
    }

    if ('res' in opts) {
        return { ...contextInner, res: opts.res }
    }

    return contextInner
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>> 