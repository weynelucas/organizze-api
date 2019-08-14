const Category = require('../Models/Category');


module.exports = {
  listCategories() {
    return Category.find({
      $or: [
        { parent: { $exists: false  }},
        { parent: { $eq: null }}
      ]
    });
  },
  
};