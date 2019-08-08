const router = require('express').Router();

const { isAuthenticated } = require('../middlewares/auth');
const { APIError } = require('../errors/api');


router.use('/', require('./users'));
router.use('/transactions', isAuthenticated());
router.use('/transactions', require('./transactions'));
router.use('/tags', isAuthenticated());
router.use('/tags', require('./tags'));


// Handle express-jwt error
router.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: err.message });
  }

  return next(err);
});


router.use((err, req, res, next) => {
  if (err instanceof APIError) {
    const { code, message } = err;
    return res
      .status(err.statusCode)
      .json({ code, message });
  }

  return next(err);
});


module.exports = router;