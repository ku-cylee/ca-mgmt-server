import { DataSource } from 'typeorm';
import { UserRole } from '../../../src/lib/enums';
import { Lab, User } from '../../../src/models';

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

export const createMock = async (dataSource: DataSource) => {
    const userRepo = dataSource.getRepository(User);
    const users = userRepo.create(
        [taUser, otherTaUser, studentUser].map(user => {
            return {
                ...user,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
        }),
    );
    await userRepo.save(users);

    const labRepo = dataSource.getRepository(Lab);
    const labs = labRepo.create(
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
    await labRepo.save(labs);
};
