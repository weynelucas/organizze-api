const router = require('express').Router();

const AuthMiddleware = require('./Middleware/auth');

// Controllers
const UserController = require('./Controller/UserController');
const TagController = require('./Controller/TagController');
const TransactionController = require('./Controller/TransactionController');

// Validators
const { StoreUser, StoreLogin } = require('./Validator/User');
const { StoreTransaction, UpdateTransaction } = require('./Validator/Transaction');
const { StoreTag, UpdateTag } = require('./Validator/Tag');

const loginRequired = AuthMiddleware.isAuthenticated();


// User
router.post('/login', StoreLogin, UserController.login);
router.post('/signup', StoreUser, UserController.signup);
router.get('/user', loginRequired, UserController.user);

// Transaction
router.use('/transactions', new TransactionController().Router({
  middleware: loginRequired,
  validator: new Map([
    ['create', StoreTransaction],
    ['update', StoreTransaction],
    ['partialUpdate', UpdateTransaction],
  ])
}));

// Tag
router.use('/transactions', new TagController().Router({
  middleware: loginRequired,
  validator: new Map([
    ['create', StoreTag],
    ['update', StoreTag],
    ['partialUpdate', UpdateTag],
  ])
}));


module.exports = router;