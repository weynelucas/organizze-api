const router = require('express').Router();
const moongose = require('mongoose');
const bcrypt = require('bcrypt');

const User = moongose.model('User');
const { AuthenticationFailedError } = require('../errors/api');


router.post('/login', (req, res, next) => {
  errors = {}
  
  if (!req.body.email) {
    errors['email'] = 'Path `email` is required.'
  }

  if (!req.body.password) {
    errors['passwod'] = 'Path `password` is required.'
  }

  if (Object.entries(errors).length !== 0) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    bcrypt.compare(req.body.password, user.password, (err, same) => {
      if (err) return next(err);

      if (!same) return next(new AuthenticationFailedError());

      return res.json(user.toRepresentation());
    })
  }).catch(next);
});

router.post('/signup', (req, res, next) => {
  const user = new User(req.body);

  user.save().then((doc) => {
    res.status(201)
    return res.json(doc.toRepresentation());
  }).catch(next);
});


module.exports = router;