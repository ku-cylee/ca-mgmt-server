import { FindOptionsWhere, In, Not } from 'typeorm';

import { dataSource } from '../lib/database';
import User from '../models/user';
import { UserRole } from '../lib/enums';

const getRepo = () => dataSource.getRepository(User);

export const getById = async (id: number): Promise<User | null> => {
    const repo = getRepo();
    const user = await repo.findOne({
        where: { id },
    });
    return user;
};

export const getByUsername = async (username: string): Promise<User | null> => {
    const repo = getRepo();
    const user = await repo.findOne({
        where: { username, deletedAt: 0 },
    });
    return user;
};

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

export const getList = async (
    includeTA: boolean,
    includeStudent: boolean,
    includeDeleted: boolean,
): Promise<User[]> => {
    const repo = getRepo();

    const options: FindOptionsWhere<User> = {};

    const excludeRoles = [UserRole.ADMIN];
    if (!includeTA) excludeRoles.push(UserRole.TA);
    if (!includeStudent) excludeRoles.push(UserRole.STUDENT);
    options.role = Not(In(excludeRoles));

    if (!includeDeleted) options.deletedAt = 0;

    const users = await repo.find({ where: options });
    return users;
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

export const createList = async (
    role: UserRole,
    usersData: {
        username: string;
        secretKey: string;
    }[],
): Promise<User[]> => {
    const currentTimestamp = Date.now();

    const repo = getRepo();
    const users = repo.create(
        usersData.map(user => {
            const { username, secretKey } = user;
            return {
                username,
                secretKey,
                role,
                createdAt: currentTimestamp,
                updatedAt: currentTimestamp,
            };
        }),
    );
    await repo.save(users);
    return users;
};

export const updateAdmin = async (
    username: string,
    secretKey: string,
): Promise<void> => {
    const currentTimestamp = Date.now();

    const repo = getRepo();
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

export const deleteById = async (id: number): Promise<number> => {
    const currentTimestamp = Date.now();

    const repo = getRepo();
    const result = await repo.update(
        { id, deletedAt: 0 },
        { deletedAt: currentTimestamp },
    );
    return result.affected ?? 0;
};
