const mongoose = require('mongoose');


const TagSchema = new mongoose.Schema({
  description: {
    type: String,
    text: true,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

TagSchema.index({ description: 1, user: 1 }, { unique: true })


mongoose.model('Tag', TagSchema)