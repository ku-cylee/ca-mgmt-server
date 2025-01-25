import { DataSource } from 'typeorm';
import { UserRole } from '../../../src/lib/enums';
import { Lab, User } from '../../../src/models';

export const taUser = {
    username: 'CLabTa',
    secretKey: 'CLabTaSecretKey',
    role: UserRole.TA,
    createdAt: Date.now(),
    updatedAt: Date.now(),
};

export const studentUser = {
    username: 'CLabStdnt',
    secretKey: 'CLabStdntSecretKey',
    role: UserRole.STUDENT,
    createdAt: Date.now(),
    updatedAt: Date.now(),
};

export const duplicateLab = {
    name: 'CLabDuplicate',
    openAt: Date.now() - 1000 * 3600,
    dueDate: Date.now(),
    closeAt: Date.now() + 1000 * 3600,
    createdAt: Date.now(),
    updatedAt: Date.now(),
};

export const createMock = async (dataSource: DataSource) => {
    const userRepo = dataSource.getRepository(User);
    const users = userRepo.create([taUser, studentUser]);
    await userRepo.save(users);

    const labRepo = dataSource.getRepository(Lab);
    await labRepo.save(labRepo.create({ ...duplicateLab, author: users[0] }));
};
