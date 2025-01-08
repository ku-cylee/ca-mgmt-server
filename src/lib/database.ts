import { DataSource } from 'typeorm';
import logger from './logger';
import { UserDAO } from '../daos';

const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASS,
    DB_NAME,
    DB_SYNC,
    DB_LOGGING,
    DB_ENTITIES,
    ADMIN_USERNAME,
    ADMIN_SECRETKEY,
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

export const initAdmin = async (): Promise<void> => {
    if (!ADMIN_USERNAME || !ADMIN_SECRETKEY) {
        logger.error('[ERR] Admin account is not provided.');
    } else {
        const adminUser = await UserDAO.getAdmin();

        if (!adminUser) {
            await UserDAO.createAdmin(ADMIN_USERNAME, ADMIN_SECRETKEY);
            return;
        }

        if (
            adminUser.username !== ADMIN_USERNAME ||
            adminUser.secretKey !== ADMIN_SECRETKEY
        ) {
            await UserDAO.updateAdmin(ADMIN_USERNAME, ADMIN_SECRETKEY);
        }
    }
};
