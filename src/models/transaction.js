const mongoose = require('mongoose');


const TransactionSchema = new mongoose.Schema({
  description: {
    type: String,
    text: true,
  },
  activityType: {
    type: String,
    required: true,
    enum: ['despesa', 'receita']
  },
  date: {
    type: Date,
    required: true
  },
  valor: {
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