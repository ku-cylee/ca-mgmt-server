import { BaseTests, DatabaseManager } from '../../commons';
import { createMock } from './mock';
import { tests } from './tests';

export class DeleteUserTests extends BaseTests {
    constructor(dbManager: DatabaseManager) {
        super('/user', dbManager);

        this.createMock = createMock;
        this.tests = tests;
    }
}
