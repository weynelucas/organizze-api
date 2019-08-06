const { Schema, model } = require('mongoose');

const ActivtyTypes = {
  EARNING: 'earning',
  EXPENSE: 'expense',
};

const TransactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
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
  observation: String,
  tags: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Tag' 
  }]
}, {
  timestamps: true
});

module.exports = model('Transaction', TransactionSchema);