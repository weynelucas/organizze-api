const router = require('express').Router();
const { model } = require('mongoose');

const User = model('User');
const { required } = require('./auth');
const validate = require('../middlewares/validate');
const auth = require('../services/auth');
const { AuthenticationFailedError } = require('../errors/api');
const validators = require('../validators/users');


router.post('/login', validate(validators.login), async (req, res, next) => {
  const { user, token } = await auth.authenticate(req.body);
  
  if (!user) {
    return next(new AuthenticationFailedError());
  }

  return res.status(200).json({ token, user });
});


router.post('/signup', validate(validators.signup), (req, res, next) => {
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