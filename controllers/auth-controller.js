require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getUser } = require("./user-controller");


const login = async (req, res, next) => {
    try {
        // Authenticate user
        const user = await getUser(req.body.username);

        if (!user) {
            // User not found
            return res.status(401).send('Unauthorized. Incorrect username or password.');
        }

        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                res.locals.endpoint = 'login';
                return next(err);
            };
      
            if (!result) {
                // Passwords do not match
                return res.status(401).send('Unauthorized. Incorrect username or password.');
            } else {
                // Generate a JWT token
                const token = jwt.sign({ username: user.username, role: user.role }, process.env.SECRET_TOKEN, { expiresIn: '1h' });
                return res.status(200).send({ token });
            }
        });

        return;
    } catch (err) {
      res.locals.endpoint = 'login';
      return next(err);
    };
};

const sendPublicKey = (req, res, next) => {
    try {
        return res.status(200).send({key: process.env.PUBLIC_KEY});
    } catch (err) {
        res.locals.endpoint = 'sendPublicKey';
        return next(err);
    };
};

module.exports = {
    login: login,
    sendPublicKey: sendPublicKey
};