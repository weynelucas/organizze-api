const bcrypt = require('bcrypt');
const { Schema, model }= require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const settings = require('../config');

const UserSchema = new Schema({
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
}, {
  timestamps: true
});

UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();

  bcrypt.genSalt(settings.rounds, (err, salt) => {
    if (err) next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) next(err);

      this.password = hash;
      next();
    });
  });
});

UserSchema.methods.toRepresentation = function () {
  return {
    name: this.name,
    email: this.email,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
  };
};

model('User', UserSchema);