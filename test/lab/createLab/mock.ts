import { UserRole } from '../../../src/lib/enums';
import { Lab, User } from '../../../src/models';
import { dataSource } from '../database';

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

const createUserMocks = async (): Promise<User[]> => {
    const repo = dataSource.getRepository(User);
    const users = repo.create([taUser, studentUser]);
    await repo.save(users);

    return users;
};

const createLabMocks = async (users: User[]): Promise<Lab[]> => {
    const repo = dataSource.getRepository(Lab);
    const labs = repo.create([{ ...duplicateLab, author: users[0] }]);
    await repo.save(labs);

    return labs;
};

export const createMocks = async () => {
    const users = await createUserMocks();
    await createLabMocks(users);
};
