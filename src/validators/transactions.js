const { model } = require('mongoose');
const { checkSchema } = require('express-validator');

const Tag = model('Tag');
const { isReference, isDate } = require('./custom');

const store = checkSchema({
  description: {
    in: ['body'],
    isEmpty: { negated: true, errorMessage: 'This field is required.' }
  },
  activityType: {
    in: ['body'],
    isEmpty: { negated: true, errorMessage: 'This field is required.' },
    isIn: {
      options: ['earning', 'expense'],
      errorMessage: 'Is not a valid choice.'
    }
  },
  date: {
    in: ['body'],
    isEmpty: { negated: true, errorMessage: 'This field is required.' },
    custom: {
      options: isDate(),
    }
  },
  ammount: {
    in: ['body'],
    isEmpty: { negated: true, errorMessage: 'This field is required.' },
    isNumeric: {
      errorMessage: 'This field should be numeric.',
    }
  },
  done: {
    in: ['body'],
    optional: true,
    isBoolean: { errorMessage: 'This field should be a boolean.' },
  },
  tags: {
    in: ['body'],
    optional: true,
    isArray: {
      errorMessage: 'This field should be an array.',
    },
    custom: {
      options: isReference(Tag)
    }
  }
});


module.exports = { store };