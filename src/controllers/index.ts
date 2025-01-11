import { Router } from 'express';
import { handleUndefinedRoute } from './ctrl';

import user from './user';

const router = Router();

router.use('/user', user);

router.use(handleUndefinedRoute);

export default router;
