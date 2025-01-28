import '../../src/env';
import { after, before, describe } from 'mocha';
import * as GetSkeletonListTests from './getSkeletonList';
import * as CreateSkeletonTests from './createSkeleton';
import * as DeleteSkeletonListTests from './deleteSkeletonList';
import { executeTests, initAxios } from '../commons/tests';
import { dataSource } from './database';
import { cleanDatabase, createAdmin } from '../commons/database';

describe('Skeleton', () => {
    initAxios();

    before(async () => {
        await dataSource.initialize();
        await cleanDatabase(dataSource);
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
        await cleanDatabase(dataSource);
    });
});
