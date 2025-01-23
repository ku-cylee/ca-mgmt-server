import { AuthData } from './database';

export const getCookie = (authData: AuthData) => {
    const { username, secretKey } = authData;
    return `username=${username};secretKey=${secretKey}`;
};
