const moment = require('moment');
const mongoose = require('mongoose');

function validateReference(model, value, slug='_id') {
  return model.findOne({ [slug]: value }).then(doc => {
    if (!doc) {
      return Promise.reject(
        `${model.modelName.toLowerCase()} with ${slug}=${value} not found.`
      );
    }
  });
}

function isReference(ref, slug='_id') {
  return (value, { req, path, local }) => {
    let model = typeof ref === 'string' ? mongoose.model(ref) : ref;
    let promises = Array.isArray(value) ?
      value.map(v => validateReference(model, v, slug)) :
      [validateReference(model, value, slug)]; 

    return Promise.all(promises);
  };
}

function isUnique(ref, slug) {
  return (value, { req, path, local }) => {
    let model = typeof ref === 'string' ? mongoose.model(ref) : ref;

    return model.findOne({ [slug]: value}).then(doc => {
      if (doc) {
        return Promise.reject('This field must be unique.');
      }
    });
  };
}

function isDate(formats=['YYYY-MM-DD']) {
  return (value, { req, path, local }) => {
    if (!moment(value, formats, true).isValid()) {
      throw new Error(`Date has wrong format. Use one of these formats instead: ${formats.join(', ')}`);
    }

    return true;
  };
}

module.exports = { isReference, isUnique, isDate };