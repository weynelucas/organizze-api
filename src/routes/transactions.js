const router = require('express').Router();
const mongoose = require('mongoose');
const { NotFoundError } = require('../errors/api');

const Transaction = mongoose.model('Transaction');


function filters(req, res, next) {
  const { search, done, activityType, startDate, endDate } = req.query

  const filters = {}

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
router.param('id', (req, res, next) => {
  Transaction.findById(req.params.id, (err, doc) => {
    if (err) {
      return next(new NotFoundError());
    }

    req.transaction = doc;
    return next();
  });
});

router.get('/', filters, async (req, res) => {
  const transactions = await Transaction
    .find(req.filters)
    .select('-observation -tags -__v');

  return res.json({transactions});
});

router.post('/', async (req, res, next) => {
  const transaction = new Transaction(req.body);

  transaction.save().then((doc) => {
    return res.status(201).json(doc)
  }).catch(next);
});

router.get('/:id', async (req, res) => {
  return res.json(req.transaction);
})

router.put('/:id', async (req, res, next) => {
  req.transaction.update(req.body).then((doc) => {
    return res.status(200).json(doc);
  }).catch(next);
})

router.delete('/:id', async (req, res) => {
  await Transaction.findByIdAndRemove(req.params.id);

  res.status(204);
  return res.json();
})


module.exports = router