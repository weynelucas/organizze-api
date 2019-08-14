const router = require('express').Router();

const AuthMiddleware = require('./Middlewares/Auth');

// Controllers
const UserController = require('./Controllers/UserController');
const TagController = require('./Controllers/TagController');
const CategoryController = require('./Controllers/CategoryController');
const TransactionController = require('./Controllers/TransactionController');

// Validators
const { StoreUser, StoreLogin } = require('./Validators/User');
const { StoreTransaction, UpdateTransaction } = require('./Validators/Transaction');
const { StoreTag, UpdateTag } = require('./Validators/Tag');

// Exception Handlers
const HttpExceptionHandler = require('./Exceptions/Http');
const JsonWebTokenExceptionHandler = require('./Exceptions/JsonWebToken');

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

// Category
router.use('/categories', new CategoryController().Router({
  middleware: loginRequired,
}));

// Tag
router.use('/tags', new TagController().Router({
  middleware: loginRequired,
  validator: new Map([
    ['create', StoreTag],
    ['update', StoreTag],
    ['partialUpdate', UpdateTag],
  ])
}));

// Exception Handlers
router.use(HttpExceptionHandler);
router.use(JsonWebTokenExceptionHandler);


module.exports = router;