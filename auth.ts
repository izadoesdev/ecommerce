import { admin, anonymous } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "@/lib/db";

export const auth = betterAuth({
    debug: true,
    database: prismaAdapter(db, {
        provider: "postgresql",
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    appName: "Shopper",
    emailAndPassword: {
        enabled: true,
    },
    plugins: [admin(), anonymous(), nextCookies()],
});
