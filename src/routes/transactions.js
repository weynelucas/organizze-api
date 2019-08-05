const router = require('express').Router();
const mongoose = require('mongoose');

const { NotFoundError } = require('../errors/api');
const Transaction = mongoose.model('Transaction');

const payload = ({ __v, _id, user, createdAt, ...rest }) => rest;

function filters(req, res, next) {
  const { search, done, activityType, startDate, endDate } = req.query

  const filters = { user: req.user.id }

  if (search) {
    filters['$text'] = { 
      $search: search,
      $caseSensitive: false,
    }
  }

  if (['true', 'false'].includes(done)) {
    filters.done = done === 'true';
  }

  if (activityType) {
    filters.activityType = activityType;
  }

  if (startDate || endDate) {
    filters.date = {}

    if (startDate) {
      filters.date['$gte'] = new Date(startDate);
    }

    if (endDate) {
      filters.date['$lte'] = new Date(endDate);
    }
  }

  req.filters = filters;
  return next();
}

// Preload transaction on routes with :id
router.param('id', async (req, res, next) => {
  const transaction = await Transaction.findOne({ 
    _id:  req.params.id, 
    user: req.user.id
  }).select('-user');

  if (!transaction) return next(new NotFoundError());

  req.transaction = transaction;
  return next()
});

// List transactions
router.get('/', filters, async (req, res) => {
  const transactions = await Transaction
    .find(req.filters)
    .select([
      '-user', 
      '-observation', 
      '-tags', '-__v',
    ]);

  return res.json({ transactions });
});

// Create transaction
router.post('/', (req, res, next) => {
  const transaction = new Transaction(payload(req.body));
  transaction.user = req.user

  transaction.save().then((doc) => {
    return res.status(201).json(doc)
  }).catch(next);
});

// Retrieve transaction
router.get('/:id', (req, res) => {
  return res.json(req.transaction);
})

// Update transaction
router.put('/:id', (req, res, next) => {
  const transaction = req.transaction.set(payload(req.body));

  transaction.save().then((doc) => {
    return res.status(200).json(doc);
  }).catch(next);
})

// Delete transaction
router.delete('/:id', async (req, res) => {
  await req.transaction.remove();

  res.status(204);
  return res.json();
})


module.exports = router