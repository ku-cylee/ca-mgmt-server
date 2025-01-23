import '../../src/env';
import { after, before, describe } from 'mocha';
import { DatabaseManager } from '../commons';
import { GetLabListTests } from './getLabList';
import { GetLabTests } from './getLab';
import { admin } from './admin';

describe('Lab', () => {
    const dbManager = new DatabaseManager('test:lab', admin);

    const getLabListTests = new GetLabListTests(dbManager);
    const getLabTests = new GetLabTests(dbManager);

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

    describe('GET /lab/:labName', () => {
        before(async () => {
            await getLabTests.createMocks();
        });
        getLabTests.executeTests();
    });

    after(async () => {
        await dbManager.clean();
    });
});
