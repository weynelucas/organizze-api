const moment = require('moment');
const mongoose = require('mongoose');

const getModel = (ref) => typeof ref === 'string' ? mongoose.model(ref) : ref;

function validateRelated(model, value, slug='_id', query={}) {
  return model.findOne({ [slug]: value, ...query }).then(doc => {
    if (!doc) {
      return Promise.reject(
        `${model.modelName.toLowerCase()} with ${slug}=${value} not found.`
      );
    }
  });
}

function isRelated(ref, slug='_id', options) {
  return (value, session) => {
    let model = getModel(ref);
    
    // Nested query
    let query = options !== undefined && options(value, session);

    // Create promises
    let promises = Array.isArray(value) 
      ? value.map(v => validateRelated(model, v, slug, query))
      : [validateRelated(model, value, slug, query)]; 

    // Execute
    return Promise.all(promises);
  };
}

function isUnique(ref, slug, options) {
  return (value, { req, local, path }) => {
    let model = getModel(ref);
    let query = options !== undefined 
      ? options(value, { req, local, path }) 
      : {};

    return model.findOne({ [slug]: value, ...query }).then(doc => {
      if (doc) {
        return Promise.reject('This field must be unique.');
      }
    });
  };
}

function isDate(formats=['YYYY-MM-DD']) {
  return (value) => {
    if (!moment(value, formats, true).isValid()) {
      throw new Error(
        `Date has wrong format. Use one of these formats instead: ${formats.join(', ')}`
      );
    }

    return true;
  };
}

module.exports = { isRelated, isUnique, isDate };