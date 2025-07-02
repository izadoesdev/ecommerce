import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import db from '@/lib/db'

export async function createTRPCContext(
    opts: CreateNextContextOptions | FetchCreateContextFnOptions
) {
    // For fetch adapter, we don't have req/res
    if ('req' in opts && 'res' in opts) {
        // Next.js API route context
        return {
            db,
            req: opts.req,
            res: opts.res,
        }
    } else {
        // Fetch adapter context
        return {
            db,
            req: opts.req,
        }
    }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>> 