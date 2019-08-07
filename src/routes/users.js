const router = require('express').Router();
const { model } = require('mongoose');

const User = model('User');
const validate = require('../middlewares/validate');
const { isAuthenticated } = require('../middlewares/auth');
const auth = require('../services/auth');
const validators = require('../validators/users');
const { AuthenticationFailedError } = require('../errors/api');


router.post('/login', validate(validators.login), async (req, res, next) => {
  const user = await auth.authenticate(req.body);
  
  if (!user) {
    return next(new AuthenticationFailedError());
  }

  return res.status(200).json({ 
    token: auth.generateToken(user), 
    user 
  });
});


router.post('/signup', validate(validators.signup), (req, res, next) => {
  const user = new User(req.body);

  user.save().then((doc) => {
    res.status(201);
    return res.json(doc.toRepresentation());
  }).catch(next);
});


router.get('/user', isAuthenticated(), (req, res, next) => {
  return res.json(req.user.toRepresentation());
});


module.exports = router;