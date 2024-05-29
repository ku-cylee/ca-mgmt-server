import { Router } from 'express';
import 'express-async-errors';
import { handleUndefinedRoute } from './ctrl';

const router = Router();

router.use(handleUndefinedRoute);

export default router;
