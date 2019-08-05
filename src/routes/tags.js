const router = require('express').Router();
const mongoose = require('mongoose');

const Tag = mongoose.model('Tag');
const { NotFoundError } = require('../errors/api');

const payload = ({ description }) => description ? { description } : {};
const filters = ({ query: { search }, user: { id: userId } }) => {
  const filters = { user: userId };

  if (search) {
    filters['$text'] = { 
      $search: search,
      $caseSensitive: false,
    };
  }

  return filters;
};

// Preload tag on routes with :id
router.param('id', async (req, res, next) => {
  const tag = await Tag.findOne({
    _id: req.params.id,
    user: req.user.id
  }).select('-user');

  if (!tag) return next(new NotFoundError());

  req.tag = tag;
  return next();
});


// List tags
router.get('/', async (req, res) => {
  const tags = await Tag
    .find(filters(req))
    .select('-user -__v');

  return res.json({ results: tags });
});


// Create tag
router.post('/', (req, res, next) => {
  const tag = new Tag(payload(req.body));
  tag.user = req.user;

  tag.save().then((doc) => {
    return res.status(201).json(tag);
  }).catch(next);
});


// Retrieve tag
router.get('/:id', (req, res) => {
  return res.json(req.tag);
});


// Update tag
router.put('/:id', (req, res, next) => {
  const tag = req.tag.set(payload(req.body));

  tag.save().then((doc) => {
    return res.json(doc);
  }).catch(next);
});


// Delete tag
router.delete('/:id', async (req, res) => {
  await req.tag.remove();

  return res.status(204).json();
});


module.exports = router;