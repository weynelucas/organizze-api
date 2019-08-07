const mongoose = require('mongoose');

function validateReference(model, value, slug='_id') {
  return model.findOne({ [slug]: value }).then(doc => {
    if (!doc) {
      return Promise.reject(
        `${model.modelName.toLowerCase()} with ${slug}=${value} not found.`
      )
    }
  });
}

function referenceValidator(ref, slug='_id') {
  return (value, { req, path, local }) => {
    let model = typeof ref === 'string' ? mongoose.model(ref) : ref;
    let promises = Array.isArray(value) ?
      value.map(v => validateReference(model, v, slug)) :
      [validateReference(model, value, slug)]; 

    return Promise.all(promises);
  };
}

module.exports = {
  referenceValidator,
}