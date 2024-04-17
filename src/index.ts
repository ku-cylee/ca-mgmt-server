import './env';
import server from './app';

import 'reflect-metadata';
import logger from './lib/logger';

const port = process.env.PORT || 3000;

server.listen(port, () => {
    logger.info(`Server listening on ${port}`);
});
