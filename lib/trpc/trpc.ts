import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import type { Context } from './context'

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape }) {
        return shape
    },
})

export const router = t.router
export const publicProcedure = t.procedure

// Admin middleware - you can integrate with your auth system
export const adminProcedure = t.procedure.use(
    t.middleware(async ({ ctx, next }) => {
        // For now, we'll skip auth check - you can add this later
        // if (!ctx.user || ctx.user.role !== 'ADMIN') {
        //   throw new TRPCError({ code: 'UNAUTHORIZED' })
        // }
        return next({
            ctx: {
                ...ctx,
                // user: ctx.user,
            },
        })
    })
) 