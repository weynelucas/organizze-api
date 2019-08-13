const router = require('express').Router();

const validate = require('../Middlewares/validate');
const validateTransaction = require('../Validators/Transaction');
const TransactionController = require('../Controllers/TransactionController');

const controller = new TransactionController();
const validator = validate(validateTransaction);
const partialValidator = validate(validateTransaction, true);

router.param('id', controller.loadObject);
router.get('/', controller.list);
router.post('/', validator, controller.create);
router.get('/:id', controller.retrieve);
router.put('/:id', validator, controller.update);
router.patch('/:id', partialValidator, controller.update);
router.delete('/:id', controller.update);

module.exports = router;