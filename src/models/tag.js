const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

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

TagSchema.plugin(uniqueValidator);

model('Tag', TagSchema);