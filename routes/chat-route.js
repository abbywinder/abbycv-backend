const express = require('express');
const { postToChatGPTGetResponse } = require('../controllers/chat-controller');
const chatGPTlimiter = require('../middleware/rate-limiter');

const router = express.Router();

router.route('/')
.post(chatGPTlimiter, postToChatGPTGetResponse);

module.exports = router;