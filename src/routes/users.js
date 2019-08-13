const router = require('express').Router();

const { isAuthenticated } = require('../Middleware/auth');
const validate = require('../Middleware/validate');
const validators = require('../validators/users');
const UserController = require('../Controller/user');

router.post('/login', validate(validators.login), UserController.login);
router.post('/signup', validate(validators.signup), UserController.signup);
router.get('/user', isAuthenticated(), UserController.user);

module.exports = router;