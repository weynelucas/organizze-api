const { validationResult, check } = require('express-validator');


function isInRequest(req, locations, path) {
  return locations.some(local => {
    return req[local] !== undefined 
      ? Object.keys(req[local]).includes(path) 
      : false;
  });
}


module.exports = (validations, partial=false) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => {
      const { locations, fields: [field] } = validation.builder;

      if(!partial || (partial && isInRequest(req, locations, field))) {
        return validation.run(req);
      }

    }));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.mapped() });
  };
};