import { FindOptionsWhere, LessThanOrEqual } from 'typeorm';
import { dataSource } from '../lib/database';
import { Lab, User } from '../models';

const getRepo = () => dataSource.getRepository(Lab);

export const getById = async (id: number): Promise<Lab | null> => {
    const repo = getRepo();

    const lab = await repo.findOne({
        where: { id, deletedAt: 0 },
        relations: { author: true },
    });

    return lab;
};

export const getByName = async (
    name: string,
    includeUnopen = false,
    includeDeleted = false,
): Promise<Lab | null> => {
    const currentTimestamp = Date.now();
    const repo = getRepo();

    const where: FindOptionsWhere<Lab> = { name };
    if (!includeUnopen) where.openAt = LessThanOrEqual(currentTimestamp);
    if (!includeDeleted) where.deletedAt = 0;

    const lab = await repo.findOne({
        where,
        relations: { author: true, skeletonFiles: true },
    });

    return lab;
};

export const getList = async (
    includeUnopen = false,
    includeDeleted = false,
): Promise<Lab[]> => {
    const currentTimestamp = Date.now();
    const repo = getRepo();

    const options: FindOptionsWhere<Lab> = {};
    if (!includeUnopen) options.openAt = LessThanOrEqual(currentTimestamp);
    if (!includeDeleted) options.deletedAt = 0;

    const labs = await repo.find({
        where: options,
        relations: { author: true },
    });

    return labs;
};

export const create = async (
    name: string,
    openAt: number,
    dueDate: number,
    closeAt: number,
    author: User,
): Promise<Lab> => {
    const currentTimestamp = Date.now();
    const repo = getRepo();

    const lab = repo.create({
        name,
        openAt,
        dueDate,
        closeAt,
        submissionFiles: [],
        author,
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp,
    });
    await repo.save(lab);

    return lab;
};

export const updateById = async (
    id: number,
    name: string,
    openAt: number,
    dueDate: number,
    closeAt: number,
): Promise<number> => {
    const currentTimestamp = Date.now();
    const repo = getRepo();

    const result = await repo.update(
        { id },
        { name, openAt, dueDate, closeAt, updatedAt: currentTimestamp },
    );

    return result.affected ?? 0;
};

export const updateSubmissionFilesById = async (
    id: number,
    submissionFiles: string[],
): Promise<number> => {
    const currentTimestamp = Date.now();
    const repo = getRepo();

    const result = await repo.update(
        { id },
        { submissionFiles, updatedAt: currentTimestamp },
    );

    return result.affected ?? 0;
};

export const deleteById = async (id: number): Promise<number> => {
    const currentTimestamp = Date.now();
    const repo = getRepo();

    const result = await repo.update({ id }, { deletedAt: currentTimestamp });

    return result.affected ?? 0;
};
