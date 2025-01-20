import { DataSource, IsNull, Not } from 'typeorm';
import User from '../../src/models/user';
import { UserRole } from '../../src/lib/enums';
import Defuse from '../../src/models/defuse';
import Bomb from '../../src/models/bomb';
import SkeletonFile from '../../src/models/skeleton-file';
import Submission from '../../src/models/submission';
import Lab from '../../src/models/lab';

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

export class DatabaseManager {
    dataSource!: DataSource;

    constructor(name: string) {
        this.dataSource = new DataSource({
            name,
            type: 'mariadb',
            host: DB_HOST ?? '127.0.0.1',
            port: parseInt(DB_PORT ?? '3306', 10),
            username: DB_USER,
            password: DB_PASS,
            database: DB_NAME,
            synchronize: DB_SYNC === 'true',
            logging: DB_LOGGING === 'true',
            entities: DB_ENTITIES?.split(',') ?? [],
        });
    }

    async init() {
        await this.dataSource.initialize();
    }

    async createAdmin() {
        const repo = this.dataSource.getRepository(User);
        await repo.upsert(
            {
                username: ADMIN_USERNAME,
                secretKey: ADMIN_SECRETKEY,
                role: UserRole.ADMIN,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            ['role'],
        );
    }

    async clean() {
        [Defuse, Bomb, SkeletonFile, Submission, Lab, User].forEach(
            async Entity => {
                const repo = this.dataSource.getRepository(Entity);
                await repo.delete({ id: Not(IsNull()) });
            },
        );
    }
}
