import { AuthData, baseRequest } from '../../commons';

export const request = async (config: { requester: AuthData; body: any }) => {
    const response = await baseRequest({
        method: 'post',
        url: '/user',
        requester: config.requester,
        query: {},
        body: config.body,
    });
    return response;
};
