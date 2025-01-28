import { AuthData, baseRequest } from '../../commons';

export const request = async (config: { requester: AuthData }) => {
    const response = await baseRequest({
        method: 'get',
        url: '/lab',
        requester: config.requester,
        query: {},
        body: {},
    });
    return response;
};
