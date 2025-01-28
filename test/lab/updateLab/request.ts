import { AuthData, baseRequest } from '../../commons';

export const request = async (config: {
    requester: AuthData;
    params: {
        labName: string;
    };
    body: any;
}) => {
    const response = await baseRequest({
        method: 'put',
        url: `/lab/${config.params.labName}`,
        requester: config.requester,
        query: {},
        body: config.body,
    });
    return response;
};
