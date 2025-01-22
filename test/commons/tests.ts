import axios from 'axios';
import { it } from 'mocha';
import path from 'path';
import { DataSource } from 'typeorm';
import { DatabaseManager } from './database';

const { PORT } = process.env;

export interface Test {
    name: string;
    func: (dataSource: DataSource) => Promise<void>;
}

export class BaseTests {
    protected dataSource!: DataSource;

    protected createMock!: (dataSource: DataSource) => Promise<void>;

    protected tests!: Test[];

    constructor(dbManager: DatabaseManager) {
        axios.defaults.baseURL = path.join(`http://localhost:${PORT}`);
        axios.defaults.validateStatus = _status => true;

        this.dataSource = dbManager.dataSource;
    }

    async createMocks() {
        await this.createMock(this.dataSource);
    }

    executeTests() {
        this.tests.forEach(test => {
            const { name, func } = test;
            it(name, async () => {
                await func(this.dataSource);
            });
        });
    }
}
