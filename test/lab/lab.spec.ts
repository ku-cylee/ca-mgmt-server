import '../../src/env';
import { after, before, describe } from 'mocha';
import { DatabaseManager } from '../commons';
import { GetLabListTests } from './getLabList';

describe('Lab', () => {
    const dbManager = new DatabaseManager('test:lab');

    const getLabListTests = new GetLabListTests(dbManager);

    before(async () => {
        await dbManager.init();
        await dbManager.clean();
        await dbManager.createAdmin();
    });

    describe('GET /lab', () => {
        before(async () => {
            await getLabListTests.createMocks();
        });
        getLabListTests.executeTests();
    });

    after(async () => {
        await dbManager.clean();
    });
});
