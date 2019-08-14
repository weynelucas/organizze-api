const Category = require('../Models/Category');
const Transaction = require('../Models/Transaction');


module.exports = {
  listCategories() {
    return Category.find({
      $or: [
        { parent: { $exists: false  }},
        { parent: { $eq: null }}
      ]
    });
  },

  async destroyCategory(category, target) {
    await category.delete();
    await Transaction.updateMany({ category }, {
      $set: { category: target }
    });
  }
  
};