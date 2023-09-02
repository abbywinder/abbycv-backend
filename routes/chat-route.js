const express = require('express');
const { postToChatGPTGetResponse } = require('../controllers/chat-controller');
const { addRoleVisitor, ensureAuthenticatedAndAuthorised } = require('../middleware/auth');
const { chatGPTlimiter } = require('../middleware/rate-limiter');

const router = express.Router();

router.route('/')
.post(addRoleVisitor, ensureAuthenticatedAndAuthorised, chatGPTlimiter, postToChatGPTGetResponse);

module.exports = router;