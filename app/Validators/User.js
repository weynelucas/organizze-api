const { model } = require('mongoose');
const { checkSchema } = require('express-validator');

const User = model('User');
const { isUnique } = require('./helpers');
const validate = require('../Middlewares/validate');


const loginSchema = checkSchema({
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

const storeSchema = checkSchema({
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
      options: isUnique(User, 'email')
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


module.exports = { 
  StoreLogin: validate(loginSchema) ,
  StoreUser: validate(storeSchema)
};