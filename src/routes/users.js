const router = require('express').Router();
const { required } = require('./auth');
const authService = require('../services/auth');
const User = require('mongoose').model('User');
const { AuthenticationFailedError } = require('../errors/api');


router.post('/login', async (req, res, next) => {
  const errors = {};
  
  if (!req.body.email) {
    errors['email'] = 'Path `email` is required.';
  }

  if (!req.body.password) {
    errors['passwod'] = 'Path `password` is required.';
  }

  if (Object.entries(errors).length !== 0) {
    return res.status(400).json(errors);
  }

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