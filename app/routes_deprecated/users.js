const router = require('express').Router();

const { isAuthenticated } = require('../Middlewares/auth');
const validate = require('../Middlewares/validate');
const validators = require('../Validators/User');
const UserController = require('../Controllers/UserController');

router.post('/login', validate(validators.login), UserController.login);
router.post('/signup', validate(validators.signup), UserController.signup);
router.get('/user', isAuthenticated(), UserController.user);

module.exports = router;