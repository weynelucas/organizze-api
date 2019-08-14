const BaseController = require('./BaseController');
const CategoryService = require('../Services/Category');

class CategoryController extends BaseController {
  constructor() {
    super('Category');
  }

  performSave(req, object) {
    const { description } = req.body;
    if (description !== undefined) {
      object.set({ user: req.user, description });
    }
    return object.save();
  }

  getDocuments({ user: { is: userId } }) {
    return CategoryService
      .listCategories()
      .find({ user: userId });
  }
}

module.exports = CategoryController;