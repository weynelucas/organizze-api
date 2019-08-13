const router = require('express').Router();

const AuthMiddleware = require('./Middleware/auth');

// Controllers
const TransactionController = require('./Controller/TransactionController');


router.use('/transactions', new TransactionController().Router({
  middleware: AuthMiddleware.isAuthenticated(),
  // validator: new Map([
  //   ['create', ],
  //   ['update', ],
  //   ['partialUpdate', ],
  // ])
}));


module.exports = router;