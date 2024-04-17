import { DataSource } from 'typeorm';
import logger from './logger';

const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASS,
    DB_NAME,
    DB_SYNC,
    DB_LOGGING,
    DB_ENTITIES,
} = process.env;

export const dataSource = new DataSource({
    type: 'mariadb',
    host: DB_HOST ?? '127.0.0.1',
    port: parseInt(DB_PORT ?? '3306', 10),
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    synchronize: DB_SYNC === 'true',
    logging: DB_LOGGING !== 'true',
    entities: DB_ENTITIES?.split(',') ?? [],
});

export const initDatabase = async (): Promise<void> => {
    try {
        await dataSource.initialize();
        logger.info('DB connection established');
    } catch (err) {
        logger.error(`[ERR] DB Connection: ${err}`);
    }
};
