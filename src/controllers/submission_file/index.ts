import { Router } from 'express';
import { createSubmissionFileList } from './ctrl';

const router = Router();

router.post('/', createSubmissionFileList);

export default router;
