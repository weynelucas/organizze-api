const router = require('express').Router();

const auth = require('./auth');
const { APIError, NotAuthenticatedError } = require('../errors/api');


router.use('/', require('./users'));
router.use('/transactions', auth.required);
router.use('/transactions', require('./transactions'));


// Handle express-jwt error
router.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: err.message })
  }

  return next(err);
});

// Handle moongose validation error
router.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    res.status(400);
    return res.json(Object.keys(err.errors).reduce((errors, key) => {
      errors[key] = err.errors[key].message;
      return errors;
    }, {}));
  }

  return next(err);
});

// Handle http errors
router.use((err, req, res, next) => {
  if (err instanceof APIError) {
    return res
      .status(err.statusCode)
      .json({ message: err.message });
  }

  return next(err);
});


module.exports = router;