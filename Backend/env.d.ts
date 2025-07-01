declare namespace NodeJS {
    interface ProcessEnv {
        MONGO_URL: string;
        PORT: string;
        JWT_SECRET: string;
        NODE_ENV: string;
    }
}
