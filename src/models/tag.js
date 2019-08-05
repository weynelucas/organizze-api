const mongoose = require('mongoose');


const TagSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

TagSchema.index({ description: 1, user: 1 }, { unique: true })


mongoose.model('Tag', TagSchema)