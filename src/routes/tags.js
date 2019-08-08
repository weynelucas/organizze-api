const router = require('express').Router();

const validate = require('../middlewares/validate');
const validators = require('../validators/tags');
const TagController = require('../controllers/tag');

const controller = new TagController();

router.get('/', controller.list);
router.post('/', validate(validators.store), controller.create);
router.get('/:id', controller.retrieve);
router.put('/:id', validate(validators.store), controller.update);
router.patch('/:id', validate(validators.store, true), controller.update);
router.delete('/:id', controller.delete);

module.exports = router;