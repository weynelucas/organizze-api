const { model } = require('mongoose');
const { checkSchema } = require('express-validator');
const { isUnique } = require('./custom');

const Tag = model('Tag');

module.exports = checkSchema({
  description: {
    exists: { errorMessage: 'This field is required.' },
    isEmpty: {
      negated: true,
      errorMessage: 'This cannot be blank.'
    },
    custom: isUnique(Tag, 'description', (value, { req }) => {
      let query = { user: req.user._id };
      
      if (req.object !== undefined) {
        query._id = { $ne: req.tag._id };
      }

      return query;
    })
  }
});
