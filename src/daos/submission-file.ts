import { In, FindOptionsWhere } from 'typeorm';
import { dataSource } from '../lib/database';
import { Lab, SubmissionFile } from '../models';

const getRepo = () => dataSource.getRepository(SubmissionFile);

export const getListByLab = async (
    labId: number,
    includeDeleted = false,
): Promise<SubmissionFile[]> => {
    const repo = getRepo();

    const where: FindOptionsWhere<SubmissionFile> = {
        lab: {
            id: labId,
        },
    };
    if (!includeDeleted) where.deletedAt = 0;

    const submissionFiles = await repo.find({
        where,
        order: {
            createdAt: 'ASC',
            id: 'ASC',
        },
    });
    return submissionFiles;
};

export const createList = async (
    lab: Lab,
    names: string[],
): Promise<SubmissionFile[]> => {
    const repo = getRepo();
    const submissionFiles = repo.create(
        names.map(name => {
            return {
                name,
                lab,
                createdAt: Date.now(),
            };
        }),
    );
    await repo.save(submissionFiles);
    return submissionFiles;
};

export const deleteListByIds = async (ids: number[]): Promise<number> => {
    const repo = getRepo();
    const result = await repo.update(
        {
            id: In(ids),
        },
        { deletedAt: Date.now() },
    );
    return result.affected ?? 0;
};

export const undeleteListByIds = async (ids: number[]): Promise<number> => {
    const repo = getRepo();
    const result = await repo.update(
        {
            id: In(ids),
        },
        { createdAt: Date.now(), deletedAt: 0 },
    );
    return result.affected ?? 0;
};
