import { Router } from 'express';
import { createSubmission, getSubmissionList } from './ctrl';

const router = Router();

router.get('/', getSubmissionList);

router.post('/', createSubmission);

export default router;
