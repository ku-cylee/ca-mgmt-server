import { Router } from 'express';
import 'express-async-errors';
import { handleUndefinedRoute } from './ctrl';

const router = Router();

router.get('/', async (req, res, _next) => {
    const { requester } = res.locals;

    return res.json({
        isAdmin: requester.isAdmin(),
        isTA: requester.isTA(),
        isStudent: requester.isStudent(),
    });
});

router.use(handleUndefinedRoute);

export default router;
