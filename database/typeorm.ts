// lib/typeorm.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { WatchList } from './models/WatchList';


export const PostgresDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5433"),
    username: process.env.DB_USERNAME || "Moxie",
    password: process.env.DB_PASSWORD || "Mox1234",
    database: process.env.DB_NAME || "postgres",
    entities: [WatchList],
    

    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',

    extra: {
        max: 10,
        min: 2,
        idleTimeoutMillis: 30000,
    },
});

declare global {
    var __dataSource: DataSource | undefined;
}

export const getDataSource = async (): Promise<DataSource> => {
    // PRODUCTION: Use the main DataSource instance
    if (process.env.NODE_ENV === 'production') {
        if (!PostgresDataSource.isInitialized) {
            await PostgresDataSource.initialize();
            console.log(PostgresDataSource.isInitialized)
        }
        return PostgresDataSource;
    }

    // DEVELOPMENT: Use global variable to survive hot reloads
    if (!global.__dataSource) {
        global.__dataSource = PostgresDataSource;
    }

    if (!global.__dataSource.isInitialized) {
        await global.__dataSource.initialize();
        console.log(__dataSource?.isInitialized)
    }

    return global.__dataSource;
};