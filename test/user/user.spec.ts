import '../../src/env';
import { after, before, describe } from 'mocha';
import { dataSource } from './database';
import { executeTests, clearDatabase, createAdmin } from '../commons';
import * as GetUserListTests from './getUserList';
import * as CreateUserListTests from './createUserList';
import * as DeleteUserTests from './deleteUser';

describe('User', () => {
    before(async () => {
        await dataSource.initialize();
        await clearDatabase(dataSource);
        await createAdmin(dataSource);
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
        await clearDatabase(dataSource);
    });
});
