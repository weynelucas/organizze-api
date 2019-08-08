const { model } = require('mongoose');
const { checkSchema } = require('express-validator');

const Tag = model('Tag');

const store = checkSchema({
  description: {
    exists: { errorMessage: 'This field is required.' },
    isEmpty: {
      negated: true,
      errorMessage: 'This cannot be blank.'
    },
    custom: {
      options: (value, { req, path, local }) => {
        let criteria = {
          description: value,
          user: req.user._id,
        };

        if (req.tag !== undefined) {
          criteria._id = { $ne: req.tag._id };
        } 

        return Tag.countDocuments(criteria).then(count => {
          if (count) {
            return Promise.reject('This field must be unique.');
          }
        });
      }
    }
  }
});


module.exports = { store };