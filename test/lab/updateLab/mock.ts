import { UserRole } from '../../../src/lib/enums';
import { Lab, User } from '../../../src/models';
import { dataSource } from '../database';

export const taUser = {
    username: 'ULabTa',
    secretKey: 'ULabTaSecretKey',
    role: UserRole.TA,
};

export const otherTaUser = {
    username: 'ULabOtherTa',
    secretKey: 'ULabOtherTaSecretKey',
    role: UserRole.TA,
};

export const studentUser = {
    username: 'ULabStudent',
    secretKey: 'ULabStudentSecretKey',
    role: UserRole.STUDENT,
};

const labMocks = [
    {
        name: 'ULabOrigAdmin',
        isDeleted: false,
    },
    {
        name: 'ULabOrigTa',
        isDeleted: false,
    },
    {
        name: 'ULabOrigStudent',
        isDeleted: false,
    },
    {
        name: 'ULabDeleted',
        isDeleted: true,
    },
    {
        name: 'ULabOther',
        isDeleted: false,
    },
    {
        name: 'ULabNameNotEx',
        isDeleted: false,
    },
    {
        name: 'ULabNameInv',
        isDeleted: false,
    },
    {
        name: 'ULabNameExceed',
        isDeleted: false,
    },
    {
        name: 'ULabOpenNotEx',
        isDeleted: false,
    },
    {
        name: 'ULabOpenInv',
        isDeleted: false,
    },
    {
        name: 'ULabDueNotEx',
        isDeleted: false,
    },
    {
        name: 'ULabDueInv',
        isDeleted: false,
    },
    {
        name: 'ULabCloseNotEx',
        isDeleted: false,
    },
    {
        name: 'ULabCloseInv',
        isDeleted: false,
    },
    {
        name: 'ULabOcd',
        isDeleted: false,
    },
    {
        name: 'ULabDoc',
        isDeleted: false,
    },
    {
        name: 'ULabDco',
        isDeleted: false,
    },
    {
        name: 'ULabCod',
        isDeleted: false,
    },
    {
        name: 'ULabCdo',
        isDeleted: false,
    },
    {
        name: 'ULabODc',
        isDeleted: false,
    },
    {
        name: 'ULabDupOrig',
        isDeleted: false,
    },
    {
        name: 'ULabDupNew',
        isDeleted: false,
    },
];

const createUserMocks = async (): Promise<User[]> => {
    const repo = dataSource.getRepository(User);
    const users = repo.create(
        [taUser, otherTaUser, studentUser].map(user => {
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

export const createMocks = async (): Promise<void> => {
    const users = await createUserMocks();
    await createLabMocks(users);
};
