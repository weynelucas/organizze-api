const { model } = require('mongoose');
const { checkSchema } = require('express-validator');

const Category = model('Category');
const { isUnique, isRelated } = require('./helpers');
const  validate = require('../Middlewares/Validate');

const store = checkSchema({
  description: {
    exists: { errorMessage: 'This field is required.' },
    isEmpty: {
      negated: true,
      errorMessage: 'This cannot be blank.'
    },
    custom: {
      options: isUnique(Category, 'description', (value, { req }) => {
        let query = { user: req.user._id };

        if (req.object !== undefined) {
          query._id = { $ne: req.object._id };
        }

        return query;
      })
    }
  }
});

const destroy = checkSchema({
  substitute: {
    in: ['query'],
    exists: { errorMessage: 'This field is required.' },
    isUUID: {
      errorMessage: 'This field must be an UUID.'
    },
    custom: {
      options: isRelated(Category, '_id', (value, { req }) => {
        return { user: req.user._id };
      })
    }
  }
});

module.exports = {
  StoreCategory: validate(store),
  UpdateCategory: validate(store, true),
  DestroyCategory: validate(destroy)
};