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

  async destroyCategory(category, substitute) {
    const conditions = {
      $or: [
        { _id: category._id },
        { parent: category._id }
      ]
    };
    
    await Category.deleteMany(conditions);
    await Transaction.updateMany(conditions, {
      $set: { category: substitute }
    });
  }
  
};