import axios, { AxiosResponse } from 'axios';
import { AuthData, getCookie } from './auth';

const { PORT = 3000 } = process.env;

export const baseRequest = async (config: {
    method: string;
    url: string;
    requester: AuthData;
    query: any | never;
    body: any | never;
}): Promise<AxiosResponse<any, any>> => {
    const { method, url, requester, query, body } = config;
    const response = await axios({
        method,
        url,
        headers: {
            Cookie: getCookie(requester),
        },
        params: query,
        data: body,
        baseURL: `http://localhost:${PORT}`,
        validateStatus: _status => true,
    });
    return response;
};
