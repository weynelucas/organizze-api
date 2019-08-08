const { model } = require('mongoose');

const User = model('User');
const auth = require('../services/auth');

module.exports = {
  async login(req, res, next) {
    const user = await auth.authenticate(req.body);
  
    if (!user) {
      return next(new AuthenticationFailedError());
    }
  
    return res.json({ 
      token: auth.generateToken(user), 
      user: user.toJSON(), 
    });
  },

  async signup(req, res, next) {
    const { name, email, password } = req.body;

    var user = new User({ user, email, password });
    user = await user.save();

    return res.status(201).json({
      token: auth.generateToken(user),
      user: user.toJSON(),
    });
  },

  async user(req, res, next) {
    return res.json(user.toJSON());
  }
}