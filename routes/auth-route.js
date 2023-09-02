const express = require('express');
const { login, sendPublicKey } = require('../controllers/auth-controller');
const { decryptPassword } = require('../middleware/encryption');

const router = express.Router();

router.route('/login')
.post(decryptPassword, login);

router.route('/fetch-key')
.get(sendPublicKey);

module.exports = router;