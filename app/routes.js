const router = require('express').Router();

const AuthMiddleware = require('./Middlewares/auth');

// Controllers
const UserController = require('./Controllers/UserController');
const TagController = require('./Controllers/TagController');
const TransactionController = require('./Controllers/TransactionController');

// Validators
const { StoreUser, StoreLogin } = require('./Validators/User');
const { StoreTransaction, UpdateTransaction } = require('./Validators/Transaction');
const { StoreTag, UpdateTag } = require('./Validators/Tag');

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