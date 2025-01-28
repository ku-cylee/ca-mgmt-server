import { AuthData, baseRequest } from '../../commons';

export const request = async (config: {
    requester: AuthData;
    params: {
        userId: number;
    };
}) => {
    const response = await baseRequest({
        method: 'delete',
        url: `/user/${config.params.userId}`,
        requester: config.requester,
        query: {},
        body: {},
    });
    return response;
};
