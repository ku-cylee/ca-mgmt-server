import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import './env';

import controller from './controllers';
import errorHandler from './lib/error-handler';
import { initDatabase } from './lib/database';
import { loggerStream } from './lib/logger';

const { NODE_ENV } = process.env;

const app = express();

app.use(
    morgan(NODE_ENV !== 'prod' ? 'dev' : 'combined', {
        stream: loggerStream,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(controller);
app.use(errorHandler);

initDatabase();

export default app;
    