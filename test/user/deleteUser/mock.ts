import { DataSource } from 'typeorm';
import { UserRole } from '../../../src/lib/enums';
import { User } from '../../../src/models';

export const taUser = {
    username: 'DeleteUserTA',
    secretKey: 'DeleteUserTASecretKey',
    role: UserRole.TA,
    createdAt: Date.now(),
    updatedAt: Date.now(),
};

export const studentUser = {
    username: 'DeleteUserStdnt',
    secretKey: 'DeleteUserStdntSecretKey',
    role: UserRole.STUDENT,
    createdAt: Date.now(),
    updatedAt: Date.now(),
};

export const createMock = async (dataSource: DataSource) => {
    const repo = dataSource.getRepository(User);
    const users = repo.create([taUser, studentUser]);
    await repo.save(users);
};
