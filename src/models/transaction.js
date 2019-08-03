const mongoose = require('mongoose');


const ActivtyTypes = {
  EARNING: 'earning',
  EXPENSE: 'expense',
}


const TransactionSchema = new mongoose.Schema({
  description: {
    type: String,
    text: true,
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
  observation: String,
  tags: [String]
});


mongoose.model('Transaction', TransactionSchema);

module.exports = { ActivtyTypes };