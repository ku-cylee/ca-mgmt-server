import { FindOptionsWhere, LessThan } from 'typeorm';
import { dataSource } from '../lib/database';
import { Lab, Submission, SubmissionFile, User } from '../models';

const getRepo = () => dataSource.getRepository(Submission);

export const getListByLabAndAuthor = async (
    author: User | null,
    lab: Lab | null,
    _includeContent: boolean,
    includeDeleted = false,
): Promise<Submission[]> => {
    const repo = getRepo();

    // includeContent?

    const fileWhere: FindOptionsWhere<SubmissionFile> = {};
    if (lab) fileWhere.lab = { id: lab.id };
    if (!includeDeleted) fileWhere.deletedAt = 0;

    const where: FindOptionsWhere<Submission> = { file: fileWhere };
    if (author) where.author = { id: author.id };
    if (!includeDeleted) where.deletedAt = 0;

    const submissions = await repo.find({
        where,
        relations: {
            author: true,
            file: {
                lab: true,
            },
        },
    });

    return submissions;
};

export const create = async (
    author: User,
    file: SubmissionFile,
    content: string,
    checksum: string,
): Promise<Submission> => {
    const currentTimestamp = Date.now();
    const repo = getRepo();

    const submission = repo.create({
        author,
        file,
        content,
        checksum,
        createdAt: currentTimestamp,
    });
    await repo.save(submission);

    return submission;
};

export const deleteListByAuthorAndFile = async (
    author: User,
    file: SubmissionFile,
): Promise<number> => {
    const currentTimestamp = Date.now();
    const repo = getRepo();

    const result = await repo.update(
        {
            author,
            file,
            createdAt: LessThan(currentTimestamp),
        },
        { deletedAt: Date.now() },
    );

    return result.affected ?? 0;
};
