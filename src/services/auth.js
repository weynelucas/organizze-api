const bcrypt = require('bcrypt');
const User = require('mongoose').model('User');


module.exports = {
  async authenticate({ email, password }) {
    const user = await User.findOne({ email });

    if (!user) return;

    const match = await bcrypt.compare(password, user.password);
    
    if (match) {
      user.lastLogin = Date.now();
      return await user.save();
    }
  }
}