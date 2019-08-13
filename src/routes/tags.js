const router = require('express').Router();

const validate = require('../Middleware/validate');
const validateTag = require('../validators/tags');
const TagController = require('../Controller/TagController');

const controller = new TagController();
const validator = validate(validateTag);
const partialValidator = validate(validateTag, true);

router.param('id', controller.loadObject);
router.get('/', controller.list);
router.post('/', validator, controller.create);
router.get('/:id', controller.retrieve);
router.put('/:id', validator, controller.update);
router.patch('/:id', partialValidator, controller.update);
router.delete('/:id', controller.update);

module.exports = router;