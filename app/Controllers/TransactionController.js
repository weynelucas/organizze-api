const BaseController = require('./BaseController');


class TransactionController extends BaseController {
  constructor() {
    super('Transaction');
  }

  performSave(req, object) {
    const { __v, _id, user, createdAt, updatedAt, ...rest } = req.body;
    object.set({ ...rest, user: req.user });

    return object.save();
  }

  getDocuments({ user: { id: userId } }) {
    return this.model.find({ user: userId });
  }

  filterDocuments(req, documents) {
    const { search, done, activityType, startDate, endDate } = req.query;

    const filters = {};
  
    if (search) {
      filters.$text = { 
        $search: search,
        $caseSensitive: false,
      };
    }
  
    if (['true', 'false'].includes(done)) {
      filters.done = done === 'true';
    }
  
    if (activityType) {
      filters.activityType = activityType;
    }
  
    if (startDate || endDate) {
      filters.date = {};
  
      if (startDate) {
        filters.date.$gte = new Date(startDate);
      }
  
      if (endDate) {
        filters.date.$lte = new Date(endDate);
      }
    }

    return documents
      .find(filters)
      .select('-user -observation -tags');
  }
}


module.exports = TransactionController;