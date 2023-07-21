const rateLimit = require('express-rate-limit');

//rate limiter
const chatGPTlimiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000,
	max: 5,
	message: 'You have reached your request limit for today',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const rateLimiter = rateLimit({
	windowMs: 1000,
	max: 10,
	message: 'Access Denied',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = {
	chatGPTlimiter: chatGPTlimiter,
	rateLimiter: rateLimiter
};
