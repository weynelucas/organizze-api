const router = require('express').Router();

const { isAuthenticated } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const validators = require('../validators/users');
const UserController = require('../controllers/user');

router.post('/login', validate(validators.login), UserController.login);
router.post('/signup', validate(validators.signup), UserController.signup);
router.get('/user', isAuthenticated(), UserController.user);

module.exports = router;