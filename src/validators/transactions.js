const { model } = require('mongoose');
const { checkSchema } = require('express-validator');

const Tag = model('Tag');
const { referenceValidator } = require('./custom');

const create = checkSchema({
  description: {
    isEmpty: { negated: true, errorMessage: 'This field is required.' }
  },
  activityType: {
    isEmpty: { negated: true, errorMessage: 'This field is required.' },
    isIn: {
      options: ['earning', 'expense'],
      errorMessage: 'Is not a valid choice.'
    }
  },
  date: {
    isEmpty: { negated: true, errorMessage: 'This field is required.' },
  },
  ammount: {
    isEmpty: { negated: true, errorMessage: 'This field is required.' },
    isFloat: {
      options: { gt: 0 },
      errorMessage: 'This field should be float and greater than 0',
    }
  },
  done: {
    optional: true,
    isBoolean: { errorMessage: 'This field should be a boolean.' },
  },
  tags: {
    optional: true,
    isArray: {
      errorMessage: 'This field should be an array.',
    },
    custom: {
      options: referenceValidator(Tag)
    }
  }
});


module.exports = { create };