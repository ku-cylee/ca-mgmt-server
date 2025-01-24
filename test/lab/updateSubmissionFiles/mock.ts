import { DataSource } from 'typeorm';
import { UserRole } from '../../../src/lib/enums';
import { Lab, User } from '../../../src/models';

export const taUser = {
    username: 'UsfLabTa',
    secretKey: 'UsfLabTaSecretKey',
    role: UserRole.TA,
};

export const otherTaUser = {
    username: 'UsfLabOtherTa',
    secretKey: 'UsfLabOtherTaSecretKey',
    role: UserRole.TA,
};

export const studentUser = {
    username: 'UsfLabStudent',
    secretKey: 'UsfLabStudentSecretKey',
    role: UserRole.STUDENT,
};

const labNames = [
    'UsfLabOrigAdmin',
    'UsfLabOrigTa',
    'UsfLabOrigStudent',
    'UsfLabDeleted',
    'UsfLabOther',
    'UsfLabInvalid',
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
                submissionFiles: [`${name}_1.v`, `${name}_2.v`],
                author: users[0],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
        }),
    );
    await labRepo.save(labs);
};
