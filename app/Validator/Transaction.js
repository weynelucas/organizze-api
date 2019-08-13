const { model } = require('mongoose');
const { checkSchema } = require('express-validator');

const Tag = model('Tag');
const { isRelated, isDate } = require('./helpers');
const validate = require('../Middleware/validate');

const schema = checkSchema({
  description: {
    in: ['body'],
    exists: { errorMessage: 'This field is required.' },
    isEmpty: { negated: true, errorMessage: 'This field cannot be blank.' } 
  },
  activityType: {
    in: ['body'],
    exists: { errorMessage: 'This field is required.' },
    isIn: {
      options: [['earning', 'expense']],
      errorMessage: 'Is not a valid choice.'
    }
  },
  date: {
    in: ['body'],
    exists: { errorMessage: 'This field is required.' },
    custom: {
      options: isDate(),
    }
  },
  ammount: {
    in: ['body'],
    exists: { errorMessage: 'This field is required.' },
    isNumeric: {
      errorMessage: 'This field should be numeric.',
    }
  },
  done: {
    in: ['body'],
    optional: true,
    isBoolean: { errorMessage: 'This field should be a boolean.' },
  },
  observation: {
    in: ['body'],
    optional: true,
    isEmpty: { negated: true, errorMessage: 'This field cannot be blank.' }
  },
  tags: {
    in: ['body'],
    optional: true,
    isArray: {
      errorMessage: 'This field should be an array.',
    },
    custom: {
      options: isRelated(Tag, '_id', (value, { req }) => { 
        return { user: req.user._id };
      })
    }
  }
});

module.exports = {
  StoreTransaction: validate(schema),
  UpdateTransaction: validate(schema, true)
}