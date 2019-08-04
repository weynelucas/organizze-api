const jwt = require('express-jwt');

const settings = require('../config');


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
  required: jwt({
    secret: settings.secret,
    getToken: getTokenFromHeaderOrQuery,
  }),
  optional: jwt({
    secret: settings.secret,
    credentialsRequired: false,
    getToken: getTokenFromHeaderOrQuery,
  })
}