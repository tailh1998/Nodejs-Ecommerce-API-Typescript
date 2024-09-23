import rateLimit from 'express-rate-limit';

const TIMES = 60 * 1000 
const MAX_REQUEST = 250

const rateLimiter = rateLimit({
  windowMs: TIMES, // 24 hrs in milliseconds
  max: MAX_REQUEST,
  message: 'You have exceeded the 1000 requests in 60s limit!', 
  standardHeaders: true,
  legacyHeaders: true,
});

export default rateLimiter