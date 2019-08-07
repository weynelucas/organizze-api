const jwt = require('express-jwt');
const moogose = require('mongoose');

const User = moogose.model('User');
const settings = require('../config');
const { AuthenticationFailedError } = require('../errors/api');


function getUserFromPayload({ requestProperty='user', raiseException=true }) {
  return async (req, res, next) => {
    if (req.payload !== undefined) {
      User.findById(req.payload.id).then(user => {
        if (!user && raiseException) {
          return next(new AuthenticationFailedError('User not found.'));
        } 
  
        req[requestProperty] = user;
        return next();
      });
    }
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
  isAuthenticated({ 
    secret=settings.secret,
    requestProperty='payload',
    getToken=getTokenFromHeaderOrQuery,
    reloadUser=true,
    ...rest
  }) {
    const stack = [];

    stack.push(jwt({ secret, requestProperty, getToken, ...rest }));

    if (reloadUser) {
      stack.push(getUserFromPayload());
    }

    return stack;
  }
};