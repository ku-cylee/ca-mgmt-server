import { Router } from 'express';
import { handleUndefinedRoute } from './ctrl';

import bomb from './bomb';
import defuse from './defuse';
import lab from './lab';
import skeleton from './skeleton';
import submissionFile from './submission_file';
import submission from './submission';
import user from './user';

const router = Router();

router.use('/bomb', bomb);
router.use('/defuse', defuse);
router.use('/lab', lab);
router.use('/skeleton', skeleton);
router.use('/submission_file', submissionFile);
router.use('/submission', submission);
router.use('/user', user);

router.use(handleUndefinedRoute);

export default router;
