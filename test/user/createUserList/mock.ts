import { DataSource } from 'typeorm';
import { UserRole } from '../../../src/lib/enums';
import { User } from '../../../src/models';

export const taUser = {
    username: 'CreateUserTA',
    secretKey: 'CreateUserTASecretKey',
    role: UserRole.TA,
    createdAt: Date.now(),
    updatedAt: Date.now(),
};

export const studentUser = {
    username: 'CreateUserStdnt',
    secretKey: 'CreateUserStdntSecretKey',
    role: UserRole.STUDENT,
    createdAt: Date.now(),
    updatedAt: Date.now(),
};

export const duplicateUser = {
    username: 'CreateUserDup',
    secretKey: 'CreateUserDupSecretKey',
    role: UserRole.TA,
    createdAt: Date.now(),
    updatedAt: Date.now(),
};

export const createMock = async (dataSource: DataSource) => {
    const repo = dataSource.getRepository(User);
    const users = repo.create([taUser, studentUser, duplicateUser]);
    await repo.save(users);
};
