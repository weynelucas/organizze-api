const { model, Schema } = require('mongoose');


const CategorySchema = new Schema({
  description: {
    required: true,
    type: String,
  },
  user: { 
    ref: 'User',
    required: true,
    type: Schema.Types.ObjectId,
  },
  subcategories: [{
    ref: 'Category',
    type: Schema.Types.ObjectId,
  }]
}, { timestamps: true });

CategorySchema.methods.toJSON = function () {
  return {
    id: this.id,
    description: this.description,
    subcategories: this.subcategories,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = model('Category', CategorySchema);