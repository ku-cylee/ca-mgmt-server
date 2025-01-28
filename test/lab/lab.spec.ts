import '../../src/env';
import { after, before, describe } from 'mocha';
import { executeTests, initAxios } from '../commons/tests';
import { dataSource } from './database';
import { cleanDatabase, createAdmin } from '../commons/database';
import * as GetLabListTests from './getLabList';
import * as GetLabTests from './getLab';
import * as CreateLabTests from './createLab';
import * as UpdateLabTests from './updateLab';
import * as DeleteLabTests from './deleteLab';

describe('Lab', () => {
    initAxios();

    before(async () => {
        await dataSource.initialize();
        await cleanDatabase(dataSource);
        await createAdmin(dataSource);
    });

    describe('GET /lab', () => {
        before(async () => {
            await GetLabListTests.createMocks();
        });
        executeTests(GetLabListTests.tests);
    });

    describe('GET /lab/:labName', () => {
        before(async () => {
            await GetLabTests.createMocks();
        });
        executeTests(GetLabTests.tests);
    });

    describe('POST /lab', () => {
        before(async () => {
            await CreateLabTests.createMocks();
        });
        executeTests(CreateLabTests.tests);
    });

    describe('PUT /lab/:labId', () => {
        before(async () => {
            await UpdateLabTests.createMocks();
        });
        executeTests(UpdateLabTests.tests);
    });

    describe('DELETE /lab/:labId', () => {
        before(async () => {
            await DeleteLabTests.createMocks();
        });
        executeTests(DeleteLabTests.tests);
    });

    after(async () => {
        await cleanDatabase(dataSource);
    });
});
