const mongoose = require('mongoose');


const ActivtyTypes = {
  EARNING: 'earning',
  EXPENSE: 'expense',
}


const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    text: true,
    required: true,
  },
  activityType: {
    type: String,
    required: true,
    enum: Object.values(ActivtyTypes),
  },
  date: {
    type: Date,
    required: true
  },
  ammount: {
    type: Number,
    required: true
  },
  done: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  observation: String,
  tags: [String]
});


mongoose.model('Transaction', TransactionSchema);