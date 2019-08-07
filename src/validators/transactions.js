const { model } = require('mongoose');
const { checkSchema } = require('express-validator');

const Tag = model('Tag');

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
      options: (value, { req, path, local }) => {
        return Tag.find({ _id: { $in: value } }).select('_id').then(docs => {
          let found = docs.map(({ _id }) => _id.toString());
          let notfound = value.filter(id => !found.includes(id));
          
          if (notfound.length > 0) {
            return Promise.reject(
              `The following tags could not be found: ${notfound.join(', ')}`
            );
          }
        });
      }
    }
  }
});


module.exports = { create };