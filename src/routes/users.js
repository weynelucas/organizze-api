const router = require('express').Router();
const moongose = require('mongoose');

const User = moongose.model('User');


router.post('/signup', (req, res, next) => {
  const user = new User(req.body);

  user.save().then((err, doc) => {
    return res.status(201).json(user);
  }).catch(next);
});


module.exports = router;