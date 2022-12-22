import express from 'express';

import auth from '@src/middleware/verifyToken';
import addPoints from '@src/controllers/points/pointsManagement';
import mainLeaderboard from '@src/controllers/points/leaderboards/mainLeaderboard';
import podium from '@src/controllers/points/leaderboards/podium';

/**
 * router is an instance of the Express router.
 */
const router = express.Router();

/**
 * addPoints is a route that handles requests to add points to a user's account. It requires the request to be
 * authenticated.
 */
router.post('/add', auth, addPoints);

/**
 * mainLeaderboard is a route that handles requests to retrieve the main leaderboard.
 */
router.get('/leaderboard/main', mainLeaderboard);

/**
 * podium is a route that handles requests to retrieve the podium of a given house. It expects the house to be
 * passed as a URL parameter.
 */
router.get('/leaderboard/podium/:house', podium);

export default router;
