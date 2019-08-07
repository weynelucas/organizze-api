const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const settings = require('../config');
const User = require('mongoose').model('User');


module.exports = {
  async authenticate({ email, password }) {
    const user = await User.findOne({ email });

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      
      if (match) {
        user.lastLogin = Date.now();
        return await user.save();
      }
    }
  },

  generateToken({ _id: id, email }) {
    return jwt.sign(
      { id, email }, 
      settings.secret, 
      { expiresIn: settings.tokenLifetime }
    );
  }
}