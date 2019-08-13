const { model } = require('mongoose');
const { checkSchema } = require('express-validator');

const Tag = model('Tag');
const { isUnique } = require('./helpers');
const  validate = require('../Middlewares/validate');

const schema = checkSchema({
  description: {
    exists: { errorMessage: 'This field is required.' },
    isEmpty: {
      negated: true,
      errorMessage: 'This cannot be blank.'
    },
    custom: {
      options: isUnique(Tag, 'description', (value, { req }) => {
        let query = { user: req.user._id };

        if (req.object !== undefined) {
          query._id = { $ne: req.object._id };
        }

        return query;
      })
    }
  }
});

module.exports = {
  StoreTag: validate(schema),
  UpdateTag: validate(schema, true)
}