const router = require('express').Router();
const { model } = require('mongoose');
const { checkSchema } = require('express-validator');

const User = model('User');
const { required } = require('./auth');
const validate = require('../middlewares/validate');
const authService = require('../services/auth');
const { AuthenticationFailedError } = require('../errors/api');

const validator = checkSchema({
  email: {
    in: ['body'],
    isEmpty: { 
      negated: true,
      errorMessage: 'Email is required.'
    },
    isEmail: {
      errorMessage: 'Enter a valid email address.'
    },
  },
  password: {
    in: ['body'],
    isEmpty: { 
      negated: true,
      errorMessage: 'Password is required.'
    },
    isLength: { 
      options: { min: 7 },
      errorMessage: 'Password should be at least 7 chars long',
    },
  }
});


router.post('/login', validate(validator), async (req, res, next) => {
  const user = await authService.authenticate(req.body);
  
  if (!user) {
    return next(new AuthenticationFailedError());
  }

  return res.status(200).json(user.toRepresentation());
});


router.post('/signup', (req, res, next) => {
  const user = new User(req.body);

  user.save().then((doc) => {
    res.status(201);
    return res.json(doc.toRepresentation());
  }).catch(next);
});


router.get('/user', required, (req, res, next) => {
  return res.json(req.user.toRepresentation());
});


module.exports = router;