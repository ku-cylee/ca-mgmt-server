import { BaseTests, DatabaseManager } from '../../commons';
import { createLabMocks, createSkeletonMocks, createUserMocks } from './mock';
import { tests } from './tests';

export class GetSkeletonListTests extends BaseTests {
    constructor(dbManager: DatabaseManager) {
        super(dbManager);

        this.tests = tests;
    }

    async createMocks(): Promise<void> {
        const users = await createUserMocks(this.dataSource);
        const labs = await createLabMocks(this.dataSource, users);
        await createSkeletonMocks(this.dataSource, labs);
    }
}
