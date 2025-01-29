import { Router } from 'express';
import { handleUndefinedRoute } from './ctrl';

import lab from './lab';
import skeleton from './skeleton';
import submissionFile from './submission_file';
import submission from './submission';
import user from './user';

const router = Router();

router.use('/lab', lab);
router.use('/skeleton', skeleton);
router.use('/submission_file', submissionFile);
router.use('/submission', submission);
router.use('/user', user);

router.use(handleUndefinedRoute);

export default router;
