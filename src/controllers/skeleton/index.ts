import { Router } from 'express';
import { createSkeleton, deleteSkeleton, getSkeletonList } from './ctrl';

const router = Router();

router.get('/', getSkeletonList);

router.post('/', createSkeleton);

router.delete('/', deleteSkeleton);

export default router;
