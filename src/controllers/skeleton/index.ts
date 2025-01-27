import { Router } from 'express';
import { createSkeleton, deleteSkeletonList, getSkeletonList } from './ctrl';

const router = Router();

router.get('/', getSkeletonList);

router.post('/', createSkeleton);

router.delete('/', deleteSkeletonList);

export default router;
