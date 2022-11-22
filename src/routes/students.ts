// Import the express package
import express from 'express';

// Import the student routes
import student from '@src/controllers/students/retrieveStudents';

// Create a new router
const router = express.Router();

// Create a route for the student endpoint
router.get('/:student', student);

// Export the router
export default router;
