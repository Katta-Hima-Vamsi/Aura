// Import the logs model
import logs from '@src/model/logs';

// Create a createLog function
async function createLog(teacherEmail: string, studentName: string, pointsAdded: number, reason: string) {
  try {
    // Try to create a new log
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

// Export the createLog function
export default createLog;
