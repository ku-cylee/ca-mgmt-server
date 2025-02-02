import { FindOptionsWhere } from 'typeorm';
import { dataSource } from '../lib/database';
import { Bomb, Lab, User } from '../models';

const getRepo = () => dataSource.getRepository(Bomb);

export const getById = async (
    id: string,
    includeDeleted = false,
): Promise<Bomb | null> => {
    const repo = getRepo();

    const where: FindOptionsWhere<Bomb> = { id };
    if (!includeDeleted) where.lab = { deletedAt: 0 };

    const bomb = await repo.findOne({ where });
    return bomb;
};

export const getListByLabAndAuthor = async (
    author: User | null,
    lab: Lab | null,
): Promise<Bomb[]> => {
    const repo = getRepo();

    const where: FindOptionsWhere<Bomb> = {};
    if (author) where.author = { id: author.id };
    if (lab) where.lab = { id: lab.id };

    const bombs = await repo.find({
        where,
        relations: {
            author: true,
            defuseTrials: true,
        },
    });

    return bombs;
};

export const create = async (
    longId: string,
    lab: Lab,
    author: User,
    answers: string[],
): Promise<Bomb> => {
    const repo = getRepo();
    const bomb = repo.create({
        id: longId.slice(0, 4),
        longId,
        lab,
        author,
        answerPhase1: answers[0],
        answerPhase2: answers[1],
        answerPhase3: answers[2],
        answerPhase4: answers[3],
        answerPhase5: answers[4],
        answerPhase6: answers[5],
        createdAt: Date.now(),
    });
    await repo.save(bomb);
    return bomb;
};
