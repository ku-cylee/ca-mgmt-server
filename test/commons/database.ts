import { DataSource, IsNull, Not } from 'typeorm';
import { UserRole } from '../../src/lib/enums';
import {
    Bomb,
    Defuse,
    Lab,
    SkeletonFile,
    Submission,
    SubmissionFile,
    User,
} from '../../src/models';

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

export interface AuthData {
    username: string;
    secretKey: string;
}

export const generateDataSource = (name: string) =>
    new DataSource({
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

export const createAdmin = async (dataSource: DataSource, admin: AuthData) => {
    const repo = dataSource.getRepository(User);
    const user = repo.create({
        ...admin,
        role: UserRole.ADMIN,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });
    await repo.save(user);
};

export const cleanDatabase = async (
    dataSource: DataSource,
    admin: AuthData,
) => {
    [Defuse, Bomb, SkeletonFile, Submission, SubmissionFile, Lab].forEach(
        async Entity => {
            const repo = dataSource.getRepository(Entity);
            await repo.delete({ id: Not(IsNull()) });
        },
    );
    const userRepo = dataSource.getRepository(User);
    await userRepo.delete({ role: Not(UserRole.ADMIN) });
    await userRepo.delete({ username: admin.username });
};
