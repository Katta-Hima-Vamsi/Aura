import express from 'express';

import healthCheck from '@src/controllers/util/healthCheck';

/**
 * router is an instance of the Express router.
 */
const router = express.Router();

/**
 * healthCheck is a route that handles health check requests. It returns a 200 status code if the service is
 * healthy, or a 500 status code if the service is not healthy.
 */
router.get('/status', healthCheck);

export default router;
