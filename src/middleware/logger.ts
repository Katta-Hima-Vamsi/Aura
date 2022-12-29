import logs from '@src/model/logs';

/**
 * createLog is an async function that creates a log in the MongoDB database. It first checks that the
 * required input parameters (teacher email, student name, points added, and reason) are present, and
 * then calls the MongoDB `create` method to create a new log document with these values. If an error
 * occurs, it returns the error.
 *
 * @param {string} teacherEmail - The email address of the teacher adding the points
 * @param {string} studentName - The name of the student whose points are being added
 * @param {number} pointsAdded - The number of points being added
 * @param {string} reason - The reason for adding the points
 *
 * @returns {(Error|void)} - Returns an error if one occurs, otherwise returns nothing
 */
// eslint-disable-next-line consistent-return
async function createLog(teacherEmail: string, studentName: string, pointsAdded: number, reason: string) {
  try {
    await logs.create({
      teacherEmail,
      studentName,
      pointsAdded,
      reason,
    });
  } catch (err) {
    return err;
  }
}

export default createLog;
