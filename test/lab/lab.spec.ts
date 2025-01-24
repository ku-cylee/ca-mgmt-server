import '../../src/env';
import { after, before, describe } from 'mocha';
import { DatabaseManager } from '../commons';
import { GetLabListTests } from './getLabList';
import { GetLabTests } from './getLab';
import { admin } from './admin';
import { CreateLabTests } from './createLab';
import { UpdateLabTests } from './updateLab';
import { UpdateSubmissionFilesTests } from './updateSubmissionFiles';
import { DeleteLabTests } from './deleteLab';

describe('Lab', () => {
    const dbManager = new DatabaseManager('test:lab', admin);

    const getLabListTests = new GetLabListTests(dbManager);
    const getLabTests = new GetLabTests(dbManager);
    const createLabTests = new CreateLabTests(dbManager);
    const updateLabTests = new UpdateLabTests(dbManager);
    const updateSubmissionFilesTests = new UpdateSubmissionFilesTests(
        dbManager,
    );
    const deleteLabTests = new DeleteLabTests(dbManager);

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

    describe('POST /lab', () => {
        before(async () => {
            await createLabTests.createMocks();
        });
        createLabTests.executeTests();
    });

    describe('PUT /lab/:labId', () => {
        before(async () => {
            await updateLabTests.createMocks();
        });
        updateLabTests.executeTests();
    });

    describe('PATCH /lab/:labId', () => {
        before(async () => {
            await updateSubmissionFilesTests.createMocks();
        });
        updateSubmissionFilesTests.executeTests();
    });

    describe('DELETE /lab/:labId', () => {
        before(async () => {
            await deleteLabTests.createMocks();
        });
        deleteLabTests.executeTests();
    });

    after(async () => {
        await dbManager.clean();
    });
});
