import { UserRole } from '../../../src/lib/enums';
import { Lab, User } from '../../../src/models';
import { dataSource } from '../database';

export const taUser = {
    username: 'DLabTa',
    secretKey: 'DLabTaSecretKey',
    role: UserRole.TA,
};

export const otherTaUser = {
    username: 'DLabOtherTa',
    secretKey: 'DLabOtherTaSecretKey',
    role: UserRole.TA,
};

export const studentUser = {
    username: 'DLabStudent',
    secretKey: 'DLabStudentSecretKey',
    role: UserRole.STUDENT,
};

const labMocks = [
    {
        name: 'DLabOrigAdmin',
        isDeleted: false,
    },
    {
        name: 'DLabOrigTa',
        isDeleted: false,
    },
    {
        name: 'DLabOrigStudent',
        isDeleted: false,
    },
    {
        name: 'DLabDeleted',
        isDeleted: true,
    },
    {
        name: 'DLabOther',
        isDeleted: false,
    },
];

const createUserMocks = async (): Promise<User[]> => {
    const mocks = [taUser, otherTaUser, studentUser];
    const repo = dataSource.getRepository(User);
    const users = repo.create(
        mocks.map(user => {
            return {
                ...user,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
        }),
    );
    await repo.save(users);
    return users;
};

const createLabMocks = async (users: User[]): Promise<Lab[]> => {
    const repo = dataSource.getRepository(Lab);
    const labs = repo.create(
        labMocks.map(lab => {
            const { name, isDeleted } = lab;
            return {
                name,
                openAt: Date.now() - 3000,
                dueDate: Date.now() - 2000,
                closeAt: Date.now() - 1000,
                author: users[0],
                createdAt: Date.now(),
                updatedAt: Date.now(),
                deletedAt: isDeleted ? Date.now() : 0,
            };
        }),
    );
    await repo.save(labs);
    return labs;
};

export const createMocks = async () => {
    const users = await createUserMocks();
    await createLabMocks(users);
};
