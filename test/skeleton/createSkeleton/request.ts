import { AuthData, baseRequest } from '../../commons';

export const request = async (config: {
    requester: AuthData;
    query: any;
    body: any;
}) => {
    const response = await baseRequest({
        method: 'post',
        url: '/skeleton',
        requester: config.requester,
        query: config.query,
        body: config.body,
    });
    return response;
};
