import '../../src/env';
import { after, before, describe } from 'mocha';
import { dataSource } from './database';
import { executeTests, clearDatabase, createAdmin } from '../commons';
import * as CreateSubmissionFileListTests from './createSubmissionFileList';

describe('Submission File', () => {
    before(async () => {
        await dataSource.initialize();
        await clearDatabase(dataSource);
        await createAdmin(dataSource);
    });

    describe('POST /submission_file', () => {
        before(async () => {
            await CreateSubmissionFileListTests.createMocks();
        });
        executeTests(CreateSubmissionFileListTests.tests);
    });

    after(async () => {
        await clearDatabase(dataSource);
    });
});
