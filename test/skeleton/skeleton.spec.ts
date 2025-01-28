import '../../src/env';
import { after, before, describe } from 'mocha';
import { dataSource } from './database';
import { executeTests, clearDatabase, createAdmin } from '../commons';
import * as GetSkeletonListTests from './getSkeletonList';
import * as CreateSkeletonTests from './createSkeleton';
import * as DeleteSkeletonListTests from './deleteSkeletonList';

describe('Skeleton', () => {
    before(async () => {
        await dataSource.initialize();
        await clearDatabase(dataSource);
        await createAdmin(dataSource);
    });

    describe('GET /skeleton', () => {
        before(async () => {
            await GetSkeletonListTests.createMocks();
        });
        executeTests(GetSkeletonListTests.tests);
    });

    describe('POST /skeleton', () => {
        before(async () => {
            await CreateSkeletonTests.createMocks();
        });
        executeTests(CreateSkeletonTests.tests);
    });

    describe('DELETE /skeleton', () => {
        before(async () => {
            await DeleteSkeletonListTests.createMocks();
        });
        executeTests(DeleteSkeletonListTests.tests);
    });

    after(async () => {
        await clearDatabase(dataSource);
    });
});
