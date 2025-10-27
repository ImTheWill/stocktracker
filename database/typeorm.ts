// lib/typeorm.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { WatchList } from './models/WatchList';


export const PostgresDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5433"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [WatchList],
    
    // DEVELOPMENT: true - auto-creates/updates tables (convenient but dangerous)
    // PRODUCTION: false - use migrations instead (safe, controlled)
    synchronize: process.env.NODE_ENV !== 'production',
    
    // DEVELOPMENT: true - see all SQL queries in console
    // PRODUCTION: false or ["error"] - only log errors
    logging: process.env.NODE_ENV === 'development',
    
    // Connection pooling (BOTH environments)
    extra: {
        max: 10,
        min: 2,
        idleTimeoutMillis: 30000,
    },
});

// Singleton pattern to prevent duplicate connections
declare global {
    var __dataSource: DataSource | undefined;
}

export const getDataSource = async (): Promise<DataSource> => {
    // PRODUCTION: Use the main DataSource instance
    if (process.env.NODE_ENV === 'production') {
        if (!PostgresDataSource.isInitialized) {
            await PostgresDataSource.initialize();
        }
        return PostgresDataSource;
    }

    // DEVELOPMENT: Use global variable to survive hot reloads
    if (!global.__dataSource) {
        global.__dataSource = PostgresDataSource;
    }

    if (!global.__dataSource.isInitialized) {
        await global.__dataSource.initialize();
    }

    return global.__dataSource;
};