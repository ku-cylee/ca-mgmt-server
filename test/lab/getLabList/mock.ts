import { UserRole } from '../../../src/lib/enums';
import { Lab, SubmissionFile, User } from '../../../src/models';
import { dataSource } from '../database';

export const taUser = {
    username: 'GlLabTa1',
    secretKey: 'GlLabTa1SecretKey',
    role: UserRole.TA,
};

export const otherTaUser = {
    username: 'GlLabTa2',
    secretKey: 'GlLabTa2SecretKey',
    role: UserRole.TA,
};

export const studentUser = {
    username: 'GlLabStdnt',
    secretKey: 'GlLabStdntSecretKey',
    role: UserRole.STUDENT,
};

export const undeletedOpenLabs = [
    {
        name: 'GlLabUnO1',
        openAt: Date.now() - 1000 * 3600,
        dueDate: Date.now() + 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600 * 2,
        submissionFilenames: [],
        authorUsername: 'GlLabTa1',
        isDeleted: false,
    },
    {
        name: 'GlLabUnO2',
        openAt: Date.now() - 1000 * 3600 * 2,
        dueDate: Date.now() - 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600,
        submissionFilenames: ['gllab_uno2_1.v'],
        authorUsername: 'GlLabTa2',
        isDeleted: false,
    },
    {
        name: 'GlLabUnO3',
        openAt: Date.now() - 1000 * 3600 * 2,
        dueDate: Date.now() - 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600,
        submissionFilenames: ['gllab_uno3_1.v', 'gllab_uno3_2.v'],
        authorUsername: 'GlLabTa2',
        isDeleted: false,
    },
];

export const undeletedUnopenLabs = [
    {
        name: 'GlLabUnUo1',
        openAt: Date.now() + 1000 * 3600,
        dueDate: Date.now() + 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600 * 2,
        submissionFilenames: [],
        authorUsername: 'GlLabTa1',
        isDeleted: false,
    },
    {
        name: 'GlLabUnUo2',
        openAt: Date.now() + 1000 * 3600,
        dueDate: Date.now() + 1000 * 3600 * 2,
        closeAt: Date.now() + 1000 * 3600 * 2,
        submissionFilenames: ['gllab_unuo2_1.v', 'gllab_unuo2_2.v'],
        authorUsername: 'GlLabTa2',
        isDeleted: false,
    },
];

export const deletedOpenLabs = [
    {
        name: 'GlLabDO1',
        openAt: Date.now() - 1000 * 3600,
        dueDate: Date.now() + 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600 * 2,
        submissionFilenames: [],
        authorUsername: 'GlLabTa1',
        isDeleted: true,
    },
    {
        name: 'GlLabDO2',
        openAt: Date.now() - 1000 * 3600 * 2,
        dueDate: Date.now() - 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600,
        submissionFilenames: ['gllab_do2_1.v'],
        authorUsername: 'GlLabTa1',
        isDeleted: true,
    },
    {
        name: 'GlLabDO3',
        openAt: Date.now() - 1000 * 3600 * 2,
        dueDate: Date.now() - 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600,
        submissionFilenames: ['gllab_do3_1.v', 'gllab_do3_2.v'],
        authorUsername: 'GlLabTa2',
        isDeleted: true,
    },
];

export const deletedUnopenLabs = [
    {
        name: 'GlLabDUo1',
        openAt: Date.now() + 1000 * 3600,
        dueDate: Date.now() + 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600 * 2,
        submissionFilenames: [],
        authorUsername: 'GlLabTa1',
        isDeleted: true,
    },
    {
        name: 'GlLabDUo2',
        openAt: Date.now() + 1000 * 3600,
        dueDate: Date.now() + 1000 * 3600 * 2,
        closeAt: Date.now() + 1000 * 3600 * 2,
        submissionFilenames: ['gllab_duo4_1.v', 'gllab_duo4_2.v'],
        authorUsername: 'GlLabTa2',
        isDeleted: true,
    },
];

const labMocks = [
    ...undeletedOpenLabs,
    ...undeletedUnopenLabs,
    ...deletedOpenLabs,
    ...deletedUnopenLabs,
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
            const { authorUsername, isDeleted } = lab;
            const author = users.find(user => user.username === authorUsername);

            return {
                ...lab,
                author,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                deletedAt: isDeleted ? Date.now() : 0,
            };
        }),
    );
    await repo.save(labs);
    return labs;
};

const createSubmissionFileMocks = async (
    labs: Lab[],
): Promise<SubmissionFile[]> => {
    const repo = dataSource.getRepository(SubmissionFile);
    const submissionFiles = repo.create(
        labMocks
            .map((labMock, labIdx) =>
                labMock.submissionFilenames.map((name: string) => {
                    return {
                        name,
                        lab: labs[labIdx],
                        createdAt: Date.now(),
                    };
                }),
            )
            .reduce((prev, next) => prev.concat(next), []),
    );
    await repo.save(submissionFiles);
    return submissionFiles;
};

export const createMocks = async (): Promise<void> => {
    const users = await createUserMocks();
    const labs = await createLabMocks(users);
    await createSubmissionFileMocks(labs);
};
