import { UserRole } from '../../../src/lib/enums';
import { Lab, SubmissionFile, User } from '../../../src/models';
import { dataSource } from '../database';

export const taUser = {
    username: 'CSbfTa',
    secretKey: 'CSbfTaSecretKey',
    role: UserRole.TA,
};

export const studentUser = {
    username: 'CSbfStudent',
    secretKey: 'CSbfStudentSecretKey',
    role: UserRole.STUDENT,
};

export const otherTaUser = {
    username: 'CSbfOtherTa',
    secretKey: 'CSbfOtherTaSecretKey',
    role: UserRole.TA,
};

export const labMocks = [
    {
        name: 'CSbfAdmin',
        isDeleted: false,
    },
    {
        name: 'CSbfStudent',
        isDeleted: false,
    },
    {
        name: 'CSbfDeleted',
        isDeleted: true,
    },
    {
        name: 'CSbfOther',
        isDeleted: false,
    },
    {
        name: 'CSbfNamesNotEx',
        isDeleted: false,
    },
    {
        name: 'CSbfNamesInvalid',
        isDeleted: false,
    },
    {
        name: 'CSbfNamesExceed',
        isDeleted: false,
    },
    {
        name: 'CSbfTa',
        isDeleted: false,
    },
];

export const undUndSbfMocks = [
    {
        name: 'und_und_1.v',
        labName: 'CSbfTa',
        isDeleted: false,
    },
    {
        name: 'und_und_2.v',
        labName: 'CSbfTa',
        isDeleted: false,
    },
];

export const delUndSbfMocks = [
    {
        name: 'del_und_1.v',
        labName: 'CSbfTa',
        isDeleted: true,
    },
    {
        name: 'del_und_2.v',
        labName: 'CSbfTa',
        isDeleted: true,
    },
];

export const undDelSbfMocks = [
    {
        name: 'und_del_1.v',
        labName: 'CSbfTa',
        isDeleted: false,
    },
    {
        name: 'und_del_2.v',
        labName: 'CSbfTa',
        isDeleted: false,
    },
];

export const delDelSbfMocks = [
    {
        name: 'del_del_1.v',
        labName: 'CSbfTa',
        isDeleted: true,
    },
    {
        name: 'del_del_2.v',
        labName: 'CSbfTa',
        isDeleted: true,
    },
];

const createUserMocks = async (): Promise<User[]> => {
    const mocks = [taUser, studentUser, otherTaUser];
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
    const author = users.find(user => user.username === 'CSbfTa');
    const labs = repo.create(
        labMocks.map(lab => {
            return {
                ...lab,
                openAt: Date.now() + 1000 * 3600,
                dueDate: Date.now() + 2000 * 3600,
                closeAt: Date.now() + 3000 * 3600,
                author,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                deletedAt: lab.isDeleted ? Date.now() : 0,
            };
        }),
    );
    await repo.save(labs);
    return labs;
};

const createSubmissionFileMocks = async (
    labs: Lab[],
): Promise<SubmissionFile[]> => {
    const mocks = [
        ...undUndSbfMocks,
        ...delUndSbfMocks,
        ...undDelSbfMocks,
        ...delDelSbfMocks,
    ];
    const repo = dataSource.getRepository(SubmissionFile);
    const submissionFiles = repo.create(
        mocks.map(sbf => {
            const { name, labName, isDeleted } = sbf;
            const lab = labs.find(l => l.name === labName);
            return {
                name,
                lab,
                createdAt: Date.now(),
                deletedAt: isDeleted ? Date.now() : 0,
            };
        }),
    );
    await repo.save(submissionFiles);
    return submissionFiles;
};

export const createMocks = async (): Promise<void> => {
    const users = await createUserMocks();
    const labs = await createLabMocks(users);
    await createSubmissionFileMocks(labs);
};
