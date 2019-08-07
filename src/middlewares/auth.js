const jwt = require('express-jwt');
const moogose = require('mongoose');

const User = moogose.model('User');
const settings = require('../config');
const { AuthenticationFailedError } = require('../errors/api');


function getUserFromPayload({ requestProperty='user', raiseException=true }) {
  return async (req, res, next) => {
    if (req.payload) {
      const user = await User.findById(req.payload.id);
      
      if (!user && raiseException) {
        return next(new AuthenticationFailedError('User not found.'));
      } 

      // eslint-disable-next-line require-atomic-updates
      req[requestProperty] = user;
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
  isAuthenticated(reloadUser=true) {
    const stack = [];

    stack.push(jwt({
      secret: settings.secret,
      requestProperty: 'payload',
      getToken: getTokenFromHeaderOrQuery
    }));

    if (reloadUser) {
      stack.push(getUserFromPayload());
    }

    return stack;
  }
};