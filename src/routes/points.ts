// Import the express package
import express from 'express';

// Import the routes related to points management
import auth from '@src/middleware/verifyToken';
import addPoints from '@src/controllers/points/pointsManagement';
import mainLeaderboard from '@src/controllers/points/leaderboards/mainLeaderboard';
import podium from '@src/controllers/points/leaderboards/podium';

// Create a new router
const router = express.Router();

// Add the routes to the router
router.post('/add', auth, addPoints);
router.get('/leaderboard/main', mainLeaderboard);
router.get('/leaderboard/podium/:house', podium);

// Export the router
export default router;
