const { model } = require('mongoose');
const { checkSchema } = require('express-validator');

const User = model('User');


const login = checkSchema({
  email: {
    in: ['body'],
    isEmpty: { 
      negated: true,
      errorMessage: 'E-mail is required.'
    }
  },
  password: {
    in: ['body'],
    isEmpty: {
      negated: true,
      errorMessage: 'Password is required.'
    }
  }
});

const signup = checkSchema({
  email: {
    in: ['body'],
    isEmpty: { 
      negated: true,
      errorMessage: 'E-mail is required.'
    },
    isEmail: {
      errorMessage: 'Enter a valid e-mail address.'
    },
    custom: {
      options: (email, { req, location, path }) => {
        return User.findOne({ email }).then(user => {
          if (user) {
            return Promise.reject('E-mail already in use');
          }
        });
      }
    }
  },
  password: {
    in: ['body'],
    isEmpty: { 
      negated: true,
      errorMessage: 'Password is required.'
    },
    isLength: { 
      options: { min: 7 },
      errorMessage: 'Password should be at least 7 chars long',
    },
  },
  passwordConfirm: {
    in: ['body'],
    isEmpty: { 
      negated: true,
      errorMessage: 'Password is required.'
    },
    custom: {
      options: (password, { req, location, path }) => {
        if (password !== req.body.password) {
          throw new Error('Password confirmation does not match password.');
        }

        return password;
      }
    }
  }
});


module.exports = { login, signup };