import { AuthData, baseRequest } from '../../commons';

export const request = async (config: {
    requester: AuthData;
    params: {
        username: string;
    };
}) => {
    const response = await baseRequest({
        method: 'delete',
        url: `/user/${config.params.username}`,
        requester: config.requester,
        query: {},
        body: {},
    });
    return response;
};
