// Import the express package
import express from 'express';

// Import the healthCheck
import healthCheck from '@src/controllers/util/healthCheck';

// Create a new router
const router = express.Router();

// Create a route for the student endpoint
router.get('/status', healthCheck);

// Export the router
export default router;
