const bcrypt = require('bcrypt');
const mongose = require('mongoose');
const unique = require('mongoose-unique-validator');


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

  bcrypt.genSalt(process.env.SALT_ROUNDS || 10, (err, salt) => {
    if (err) next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) next(err);

      this.password = hash;
      next();
    })
  })
});



mongose.model('User', UserSchema);