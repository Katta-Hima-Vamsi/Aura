// Import rateLimiter from express-rate-limit
import { rateLimit } from 'express-rate-limit';

// Create a rateLimiter function
const rateLimiter = rateLimit({
  windowMs: 60000, // 1 min window for rate limiting
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'You have exceeded the 100 requests in 1 minute limit!', // Message to send when the limit is exceeded
  standardHeaders: true, // Send standard rate limit headers
  legacyHeaders: false, // Do not send headers compatible with older versions of rate-limit
});

// Export the rateLimiter function
export default rateLimiter;
