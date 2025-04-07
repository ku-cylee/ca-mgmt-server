import axios from 'axios';
import { User } from '../models';

const {
    BOMB_SERVER_HOST = 'localhost',
    BOMB_SERVER_PORT = '5000',
    BOMB_SERVER_SECRET,
} = process.env;

const BASE_URL = `http://${BOMB_SERVER_HOST}:${BOMB_SERVER_PORT}`;

export const downloadBombFile = async (
    bombId: string,
): Promise<Buffer<any>> => {
    const res = await axios({
        method: 'get',
        url: `/bomb/${bombId}`,
        baseURL: BASE_URL,
        responseType: 'arraybuffer',
        data: {
            secret: BOMB_SERVER_SECRET,
        },
    });

    return Buffer.from(res.data);
};

export const createBombAndGetSolution = async (
    bombId: string,
    requester: User,
): Promise<string[]> => {
    const res = await axios({
        method: 'post',
        url: '/bomb',
        baseURL: BASE_URL,
        data: {
            requester,
            bombId,
            secret: BOMB_SERVER_SECRET,
        },
    });

    const { solutions } = res.data;

    // TODO: Check solutions validity

    return solutions;
};
