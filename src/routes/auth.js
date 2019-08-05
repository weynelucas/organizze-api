const jwt = require('express-jwt');
const moogose = require('mongoose');

const User = moogose.model('User');
const settings = require('../config');
const { AuthenticationFailedError } = require('../errors/api');


// Middleware to preload user from database
function getuser() {
  return async (req, res, next) => {
    if (req.payload) {
      const user = await User.findById(req.payload.id);

      if (!user) {
        return next(new AuthenticationFailedError('User not found.'));
      }

      req.user = user;
    }

    return next();
  };
}


function getTokenFromHeaderOrQuery(req) {
  if (
    req.headers.authorization 
    && ['Bearer', 'Token'].includes(req.headers.authorization.split(' ')[0])
  ) {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}


module.exports = {
  required: [
    jwt({
      secret: settings.secret,
      requestProperty: 'payload',
      getToken: getTokenFromHeaderOrQuery,
    }), getuser()
  ],
  optional: [
    jwt({
      secret: settings.secret,
      requestProperty: 'payload',
      credentialsRequired: false,
      getToken: getTokenFromHeaderOrQuery,
    }), getuser()
  ]
};