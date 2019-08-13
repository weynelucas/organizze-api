const { model } = require('mongoose');
const { checkSchema } = require('express-validator');

const Tag = model('Tag');
const { isUnique } = require('./custom');

module.exports = checkSchema({
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