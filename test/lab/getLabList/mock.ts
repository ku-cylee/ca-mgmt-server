import { DataSource } from 'typeorm';
import { UserRole } from '../../../src/lib/enums';
import { Lab, User } from '../../../src/models';

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
        submissionFiles: [],
        authorUsername: 'GllTa1',
        deletedAt: 0,
    },
    {
        name: 'GllLab12',
        openAt: Date.now() - 1000 * 3600 * 2,
        dueDate: Date.now() - 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600,
        submissionFiles: ['gll_lab_121.v'],
        authorUsername: 'GllTa2',
        deletedAt: 0,
    },
    {
        name: 'GllLab13',
        openAt: Date.now() - 1000 * 3600 * 2,
        dueDate: Date.now() - 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600,
        submissionFiles: ['gll_lab_131.v', 'gll_lab_132.v'],
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
        submissionFiles: [],
        authorUsername: 'GllTa1',
        deletedAt: 0,
    },
    {
        name: 'GllLab22',
        openAt: Date.now() + 1000 * 3600,
        dueDate: Date.now() + 1000 * 3600 * 2,
        closeAt: Date.now() + 1000 * 3600 * 2,
        submissionFiles: ['gll_lab_221.v', 'gll_lab_222.v'],
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
        submissionFiles: [],
        authorUsername: 'GllTa1',
        deletedAt: Date.now(),
    },
    {
        name: 'GllLab32',
        openAt: Date.now() - 1000 * 3600 * 2,
        dueDate: Date.now() - 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600,
        submissionFiles: ['gll_lab_121.v'],
        authorUsername: 'GllTa1',
        deletedAt: Date.now(),
    },
    {
        name: 'GllLab33',
        openAt: Date.now() - 1000 * 3600 * 2,
        dueDate: Date.now() - 1000 * 3600,
        closeAt: Date.now() + 1000 * 3600,
        submissionFiles: ['gll_lab_131.v', 'gll_lab_132.v'],
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
        submissionFiles: [],
        authorUsername: 'GllTa1',
        deletedAt: Date.now(),
    },
    {
        name: 'GllLab42',
        openAt: Date.now() + 1000 * 3600,
        dueDate: Date.now() + 1000 * 3600 * 2,
        closeAt: Date.now() + 1000 * 3600 * 2,
        submissionFiles: ['gll_lab_221.v', 'gll_lab_222.v'],
        authorUsername: 'GllTa2',
        deletedAt: Date.now(),
    },
];

export const createMock = async (dataSource: DataSource) => {
    const userRepo = dataSource.getRepository(User);
    const users = userRepo.create([...taUsers, studentUser]);
    await userRepo.save(users);

    const labMocks = [
        ...undeletedOpenLabs,
        ...undeletedUnopenLabs,
        ...deletedOpenLabs,
        ...deletedUnopenLabs,
    ];

    const labRepo = dataSource.getRepository(Lab);
    const labs = labRepo.create(
        labMocks.map(lab => {
            const {
                name,
                openAt,
                dueDate,
                closeAt,
                submissionFiles,
                authorUsername,
                deletedAt,
            } = lab;

            const author = users.find(user => user.username === authorUsername);
            if (!author) throw new Error();

            return {
                name,
                openAt,
                dueDate,
                closeAt,
                submissionFiles,
                author,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                deletedAt,
            };
        }),
    );
    await labRepo.save(labs);
};
