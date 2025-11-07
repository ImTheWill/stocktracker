import { betterAuth } from "better-auth";
import { typeormAdapter } from "@hedystia/better-auth-typeorm";

import { getDataSource } from "@/database/typeorm";
import {nextCookies} from "better-auth/next-js"


let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async ()=>{
    if (authInstance) return authInstance;
    const postgres = await getDataSource();
    if(!postgres.isInitialized) throw new Error('TypeOrm Postgres Connection Error: Database not initialized')
    console.log("Database connected successfully")
    authInstance = betterAuth({
        database: typeormAdapter(postgres as any),
        secret: process.env.BETTER_AUTH_SECRET,
        baseUrl: process.env.BETTER_AUTH_URL,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,

        },
        plugins: [nextCookies()]

    })
    console.log("Passed Better auth instance")
    return authInstance;
}

export const auth = await getAuth()