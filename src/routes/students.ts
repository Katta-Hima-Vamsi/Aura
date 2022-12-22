import express from 'express';

import student from '@src/controllers/students/retrieveStudents';

/**
 * router is an instance of the Express router.
 */
const router = express.Router();

/**
 * student is a route that handles requests to retrieve student information. It expects the student's name or ID
 * to be passed as a URL parameter.
 */
router.get('/:student', student);

export default router;
