import { Router } from 'express';
import { handleUndefinedRoute } from './ctrl';

import lab from './lab';
import skeleton from './skeleton';
import user from './user';

const router = Router();

router.use('/lab', lab);
router.use('/skeleton', skeleton);
router.use('/user', user);

router.use(handleUndefinedRoute);

export default router;
