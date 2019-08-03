const router = require('express').Router();


router.use('/transactions', require('./transactions'));


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


module.exports = router;