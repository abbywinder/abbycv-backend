require('dotenv').config();
const NodeRSA = require('node-rsa');
const crypto = require('crypto');

const generateKeyPair = () => {
  const key = new NodeRSA({ b: 2048 });

  const publicKey = key.exportKey('public','pkcs8-public');
  const privateKey = key.exportKey('private','pkcs8-private');

  return { publicKey, privateKey };
};

const decryptPassword = (req, res, next) => {
    try {
        const rsaPrivateKey = {
            key: process.env.PRIVATE_KEY,
            passphrase: '',
            padding: crypto.constants.RSA_PKCS1_PADDING,
        };
        
        const decryptedPassword = crypto.privateDecrypt(
            rsaPrivateKey,
            Buffer.from(req.body.password, 'base64'),
        );
        
        req.body.password = decryptedPassword.toString('utf8');
        next();
    } catch (err) {
        res.status(401).send('Unauthorized. Incorrect username or password.');
        res.locals.endpoint = 'decryptPassword';
        return next(err);
    };
};

module.exports = {
    generateKeyPair: generateKeyPair,
    decryptPassword: decryptPassword
};