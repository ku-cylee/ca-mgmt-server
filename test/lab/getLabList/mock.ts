import { UserRole } from '../../../src/lib/enums';
import { Lab, SubmissionFile, User } from '../../../src/models';
import { dataSource } from '../database';

export const taUsers = [
    {
        username: 'GllTa1',
        secretKey: 'GllTa1SecretKey',
        role: UserRole.TA,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        username: 'GllTa2',
        secretKey: 'GllTa2SecretKey',
        role: UserRole.TA,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
];

export const studentUser = {
    username: 'GllStdnt',
    secretKey: 'GllStdntSecretKey',
    role: UserRole.STUDENT,
    createdAt: Date.now(),
    updatedAt: Date.now(),
};

export const undeletedOpenLabs = [
    {
        name: 'GllLab11',
        openAt: Date.now() - 1000 * 3600,
        dueDate: Date.now() + 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600 * 2,
        submissionFilenames: [],
        authorUsername: 'GllTa1',
        deletedAt: 0,
    },
    {
        name: 'GllLab12',
        openAt: Date.now() - 1000 * 3600 * 2,
        dueDate: Date.now() - 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600,
        submissionFilenames: ['gll_lab_121.v'],
        authorUsername: 'GllTa2',
        deletedAt: 0,
    },
    {
        name: 'GllLab13',
        openAt: Date.now() - 1000 * 3600 * 2,
        dueDate: Date.now() - 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600,
        submissionFilenames: ['gll_lab_131.v', 'gll_lab_132.v'],
        authorUsername: 'GllTa2',
        deletedAt: 0,
    },
];

export const undeletedUnopenLabs = [
    {
        name: 'GllLab21',
        openAt: Date.now() + 1000 * 3600,
        dueDate: Date.now() + 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600 * 2,
        submissionFilenames: [],
        authorUsername: 'GllTa1',
        deletedAt: 0,
    },
    {
        name: 'GllLab22',
        openAt: Date.now() + 1000 * 3600,
        dueDate: Date.now() + 1000 * 3600 * 2,
        closeAt: Date.now() + 1000 * 3600 * 2,
        submissionFilenames: ['gll_lab_221.v', 'gll_lab_222.v'],
        authorUsername: 'GllTa2',
        deletedAt: 0,
    },
];

export const deletedOpenLabs = [
    {
        name: 'GllLab31',
        openAt: Date.now() - 1000 * 3600,
        dueDate: Date.now() + 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600 * 2,
        submissionFilenames: [],
        authorUsername: 'GllTa1',
        deletedAt: Date.now(),
    },
    {
        name: 'GllLab32',
        openAt: Date.now() - 1000 * 3600 * 2,
        dueDate: Date.now() - 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600,
        submissionFilenames: ['gll_lab_321.v'],
        authorUsername: 'GllTa1',
        deletedAt: Date.now(),
    },
    {
        name: 'GllLab33',
        openAt: Date.now() - 1000 * 3600 * 2,
        dueDate: Date.now() - 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600,
        submissionFilenames: ['gll_lab_331.v', 'gll_lab_332.v'],
        authorUsername: 'GllTa2',
        deletedAt: Date.now(),
    },
];

export const deletedUnopenLabs = [
    {
        name: 'GllLab41',
        openAt: Date.now() + 1000 * 3600,
        dueDate: Date.now() + 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600 * 2,
        submissionFilenames: [],
        authorUsername: 'GllTa1',
        deletedAt: Date.now(),
    },
    {
        name: 'GllLab42',
        openAt: Date.now() + 1000 * 3600,
        dueDate: Date.now() + 1000 * 3600 * 2,
        closeAt: Date.now() + 1000 * 3600 * 2,
        submissionFilenames: ['gll_lab_421.v', 'gll_lab_422.v'],
        authorUsername: 'GllTa2',
        deletedAt: Date.now(),
    },
];

const labMocks = [
    ...undeletedOpenLabs,
    ...undeletedUnopenLabs,
    ...deletedOpenLabs,
    ...deletedUnopenLabs,
];

const createUserMocks = async (): Promise<User[]> => {
    const repo = dataSource.getRepository(User);
    const users = repo.create([...taUsers, studentUser]);
    await repo.save(users);

    return users;
};

const createLabMocks = async (users: User[]): Promise<Lab[]> => {
    const repo = dataSource.getRepository(Lab);
    const labs = repo.create(
        labMocks.map(lab => {
            const author = users.find(
                user => user.username === lab.authorUsername,
            );
            if (!author) throw new Error();

            return {
                ...lab,
                author,
                createdAt: Date.now(),
                updatedAt: Date.now(),
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
