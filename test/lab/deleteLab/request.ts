import { AuthData, baseRequest } from '../../commons';

export const request = async (config: {
    requester: AuthData;
    params: {
        labName: string;
    };
}) => {
    const response = await baseRequest({
        method: 'delete',
        url: `/lab/${config.params.labName}`,
        requester: config.requester,
        query: {},
        body: {},
    });
    return response;
};
