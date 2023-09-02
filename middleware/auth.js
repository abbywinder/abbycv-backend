require('dotenv').config();
const jwt = require('jsonwebtoken');

const addRoleAdminOnly = (req, res, next) => {
  req.allowedRole = ['admin'];
  return next();
};

const addRoleVisitor = (req, res, next) => {
  req.allowedRole = ['visitor','admin'];
  return next();
};

const ensureAuthenticatedAndAuthorised = (req, res, next) => {
  try {
    // Authenticate token
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Authentication token not found.');

    const verificationCallback = (err, user) => {
      if (err) return res.status(403).send('Invalid token.');
      else {
        // Authorize role for access to endpoint
        if (!req.allowedRole.includes(user.role)) {
          return res.status(403).send('Unauthorized. Insufficient role.');
        };

        req.user = user;
        return next();
      }
    };
    
    return jwt.verify(token, process.env.SECRET_TOKEN, verificationCallback);
    
  } catch (err) {
    res.locals.endpoint = 'ensureAuthenticatedAndAuthorised';
    return next(err);
  };
};

module.exports = {
  ensureAuthenticatedAndAuthorised: ensureAuthenticatedAndAuthorised,
  addRoleAdminOnly: addRoleAdminOnly,
  addRoleVisitor: addRoleVisitor
};
