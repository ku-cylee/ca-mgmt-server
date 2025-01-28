const { ADMIN_USERNAME = 'test-admin', ADMIN_SECRETKEY = 'db09d473d4b6461b' } =
    process.env;

export interface AuthData {
    username: string;
    secretKey: string;
}

export const admin: AuthData = {
    username: ADMIN_USERNAME,
    secretKey: ADMIN_SECRETKEY,
};

export const getCookie = (authData: AuthData) => {
    const { username, secretKey } = authData;
    return `username=${username};secretKey=${secretKey}`;
};
