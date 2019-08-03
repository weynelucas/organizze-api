const router = require('express').Router();
const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction');


function filters(req, res, next) {
  const { search, done, startDate, endDate } = req.query

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

  if (startDate || endDate) {
    filters.data = {}

    if (startDate) {
      filters.data['$gte'] = new Date(startDate);
    }

    if (endDate) {
      filters.data['$lte'] = new Date(endDate);
    }
  }

  req.filters = filters;
  return next();
}

router.param('id', async (req, res, next) => {
  const object = await Transaction.findById(req.params.id);

  if (!object) res.sendStatus(404);

  req.object = object;
  return next();
});

// List
router.get('/', filters, async (req, res) => {
  const transactions = await Transaction.find(req.filters);

  return res.json({
   transactions
  });
});

// Create
router.post('/', async (req, res) => {
  const transaction = await Transaction.create(req.body);

  res.status(201);
  return res.json(transaction);
});

// Retrieve
router.get('/:id', async (req, res) => {
  return res.json(req.object);
})

// Update
router.put('/:id', async (req, res) => {
  const object = await Transaction.findByIdAndUpdate(req.params.id, req.body)
  return res.json(req.object);
})

// Delete
router.delete('/:id', async (req, res) => {
  await Transaction.findByIdAndRemove(req.params.id);

  res.status(204);
  return res.json();
})


module.exports = router