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

const labNames = [
    'ULabOrigAdmin',
    'ULabOrigTa',
    'ULabOrigStudent',
    'ULabDeleted',
    'ULabOther',
    'ULabNameNotEx',
    'ULabNameInv',
    'ULabNameExceed',
    'ULabOpenNotEx',
    'ULabOpenInv',
    'ULabDueNotEx',
    'ULabDueInv',
    'ULabCloseNotEx',
    'ULabCloseInv',
    'ULabOcd',
    'ULabDoc',
    'ULabDco',
    'ULabCod',
    'ULabCdo',
    'ULabODc',
    'ULabDupOrig',
    'ULabDupNew',
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
        labNames.map(name => {
            return {
                name,
                openAt: Date.now() - 3000,
                dueDate: Date.now() - 2000,
                closeAt: Date.now() - 1000,
                author: users[0],
                createdAt: Date.now(),
                updatedAt: Date.now(),
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
