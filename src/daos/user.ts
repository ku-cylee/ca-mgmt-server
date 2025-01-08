import { dataSource } from '../lib/database';
import User from '../models/user';
import { UserRole } from '../lib/enums';

const getRepo = () => dataSource.getRepository(User);

export const getByUsernameAndSecretKey = async (
    username: string,
    secretKey: string,
): Promise<User | null> => {
    const repo = getRepo();
    const user = await repo.findOne({
        where: {
            username,
            secretKey,
            deletedAt: 0,
        },
    });
    return user;
};

export const getAdmin = async (): Promise<User | null> => {
    const repo = getRepo();
    const user = await repo.findOne({
        where: {
            role: UserRole.ADMIN,
            deletedAt: 0,
        },
    });
    return user;
};

export const createAdmin = async (
    username: string,
    secretKey: string,
): Promise<User | null> => {
    const repo = getRepo();
    const currentTimestamp = Date.now();
    const user = repo.create({
        username,
        secretKey,
        role: UserRole.ADMIN,
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp,
    });
    await repo.save(user);
    return user;
};

export const updateAdmin = async (
    username: string,
    secretKey: string,
): Promise<void> => {
    const repo = getRepo();
    const currentTimestamp = Date.now();
    await repo.update(
        {
            role: UserRole.ADMIN,
        },
        {
            username,
            secretKey,
            updatedAt: currentTimestamp,
        },
    );
};
