const { Schema, model } = require('mongoose');

const TagSchema = new Schema({
  description: {
    type: String,
    text: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true
});

TagSchema.methods.toJSON = function () {
  return {
    id: this.id,
    descritption: this.description, 
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

model('Tag', TagSchema);