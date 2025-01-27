import '../../src/env';
import { after, before, describe } from 'mocha';
import { DatabaseManager } from '../commons';
import { admin } from './admin';
import { GetSkeletonListTests } from './getSkeletonList';
import { CreateSkeletonTests } from './createSkeleton';
import { DeleteSkeletonListTests } from './deleteSkeletonList';

describe('Skeleton', () => {
    const dbManager = new DatabaseManager('test:skeleton', admin);

    const getSkeletonListTests = new GetSkeletonListTests(dbManager);
    const createSkeletonTests = new CreateSkeletonTests(dbManager);
    const deleteSkeletonListTests = new DeleteSkeletonListTests(dbManager);

    before(async () => {
        await dbManager.init();
        await dbManager.clean();
        await dbManager.createAdmin();
    });

    describe('GET /skeleton', () => {
        before(async () => {
            await getSkeletonListTests.createMocks();
        });
        getSkeletonListTests.executeTests();
    });

    describe('POST /skeleton', () => {
        before(async () => {
            await createSkeletonTests.createMocks();
        });
        createSkeletonTests.executeTests();
    });

    describe('DELETE /skeleton', () => {
        before(async () => {
            await deleteSkeletonListTests.createMocks();
        });
        deleteSkeletonListTests.executeTests();
    });

    after(async () => {
        await dbManager.clean();
    });
});
