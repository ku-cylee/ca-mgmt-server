import { Router } from 'express';
import { handleUndefinedRoute } from './ctrl';

import lab from './lab';
import user from './user';

const router = Router();

router.use('/lab', lab);
router.use('/user', user);

router.use(handleUndefinedRoute);

export default router;
