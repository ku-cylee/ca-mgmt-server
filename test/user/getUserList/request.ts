import { AuthData, baseRequest } from '../../commons';

export const request = async (config: { requester: AuthData; query: any }) => {
    const response = await baseRequest({
        method: 'get',
        url: `/user`,
        requester: config.requester,
        query: config.query,
        body: {},
    });
    return response;
};
