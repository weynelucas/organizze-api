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
  parent: {
    ref: 'Category',
    type: Schema.Types.ObjectId,
  }
}, { timestamps: true });

CategorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

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