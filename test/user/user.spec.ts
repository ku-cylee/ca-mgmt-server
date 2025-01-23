import '../../src/env';
import { after, before, describe } from 'mocha';
import { DatabaseManager } from '../commons';
import { GetUserListTests } from './getUserList';
import { CreateUserListTests } from './createUserList';
import { DeleteUserTests } from './deleteUser';

describe('User', () => {
    const dbManager = new DatabaseManager('test:user');
    const getUserListTests = new GetUserListTests(dbManager);
    const createUserListTests = new CreateUserListTests(dbManager);
    const deleteUserTests = new DeleteUserTests(dbManager);

    before(async () => {
        await dbManager.init();
        await dbManager.clean();
        await dbManager.createAdmin();
    });

    describe('GET /user', () => {
        before(async () => {
            await getUserListTests.createMocks();
        });
        getUserListTests.executeTests();
    });

    describe('POST /user', () => {
        before(async () => {
            await createUserListTests.createMocks();
        });
        createUserListTests.executeTests();
    });

    describe('DELETE /user/:userId', () => {
        before(async () => {
            await deleteUserTests.createMocks();
        });
        deleteUserTests.executeTests();
    });

    after(async () => {
        await dbManager.clean();
    });
});
