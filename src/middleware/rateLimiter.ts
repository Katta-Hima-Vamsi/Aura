import { rateLimit } from 'express-rate-limit';

/**
 * rateLimiter is a rate-limiting middleware function that limits the number of requests that a client can
 * make to the API within a specified time window. It allows a maximum of 100 requests in a 1-minute window
 * and sends a message to the client if the limit is exceeded.
 *
 * @returns {(RequestHandler|Error)} - Returns the rate-limiting middleware function or an error if one occurs
 */
const rateLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 100, // Maximum number of requests allowed within the time window
  message: 'You have exceeded the 100 requests in 1 minute limit!',
  standardHeaders: true,
  legacyHeaders: false,
});

export default rateLimiter;
