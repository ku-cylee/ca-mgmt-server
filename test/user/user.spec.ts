import '../../src/env';
import { after, before, describe } from 'mocha';
import { admin } from './admin';
import { dataSource } from './database';
import { executeTests, initAxios } from '../commons/tests';
import { cleanDatabase, createAdmin } from '../commons/database';
import * as GetUserListTests from './getUserList';
import * as CreateUserListTests from './createUserList';
import * as DeleteUserTests from './deleteUser';

describe('User', () => {
    initAxios();

    before(async () => {
        await dataSource.initialize();
        await cleanDatabase(dataSource, admin);
        await createAdmin(dataSource, admin);
    });

    describe('GET /user', () => {
        before(async () => {
            await GetUserListTests.createMocks();
        });
        executeTests(GetUserListTests.tests);
    });

    describe('POST /user', () => {
        before(async () => {
            await CreateUserListTests.createMocks();
        });
        executeTests(CreateUserListTests.tests);
    });

    describe('DELETE /user/:userId', () => {
        before(async () => {
            await DeleteUserTests.createMocks();
        });
        executeTests(DeleteUserTests.tests);
    });

    after(async () => {
        await cleanDatabase(dataSource, admin);
    });
});
