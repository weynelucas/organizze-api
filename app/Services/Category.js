const Category = require('../Models/Category');


module.exports = {
  listCategories() {
    return Category.find({
      parent: {
        $exists: true,
        $ne: null,
      }
    });
  },
  
};