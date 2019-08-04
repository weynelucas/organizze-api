const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongose = require('mongoose');
const unique = require('mongoose-unique-validator');

const settings = require('../config');


const UserSchema = new mongose.Schema({
  name: String,
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
    match: [/\S+@\S+\.\S+/, 'Enter a valid email address.']
  },
  password: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: Date,
});

UserSchema.plugin(unique);

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();

  bcrypt.genSalt(settings.rounds || 10, (err, salt) => {
    if (err) next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) next(err);

      this.password = hash;
      next();
    })
  })
});

UserSchema.methods.jwt = function() {
  return jwt.sign({
    id: this._id,
    email: this.email,
    exp: Math.floor((Date.now()/1000) + (60*60))
  }, settings.secret)
}

UserSchema.methods.toRepresentation = function () {
  return {
    name: this.name,
    email: this.email,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    token: this.jwt()
  }
}


mongose.model('User', UserSchema);