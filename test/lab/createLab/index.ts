import { BaseTests, DatabaseManager } from '../../commons';
import { createMock } from './mock';
import { tests } from './tests';

export class CreateLabTests extends BaseTests {
    constructor(dbManager: DatabaseManager) {
        super(dbManager);

        this.createMock = createMock;
        this.tests = tests;
    }
}
