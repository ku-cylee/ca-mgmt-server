import { Router } from 'express';
import 'express-async-errors';
import { handleUndefinedRoute } from './ctrl';

import user from './user';

const router = Router();

router.use('/user', user);

router.use(handleUndefinedRoute);

export default router;
