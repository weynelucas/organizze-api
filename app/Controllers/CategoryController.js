const BaseController = require('./BaseController');
const CategoryService = require('../Services/Category');

class CategoryController extends BaseController {
  constructor() {
    super('Category');
  }

  async createSubcategory(req, res, next) {
    try {
      const category = await this.getObject(req);
      const subcategory = await this.performSave(
        req, this.model({ parent: category })
      );
      
      return res.status(201).json(subcategory.toJSON());
    } catch (err) {
      next(err);
    }
  }

  async destroy(req, res, next) {
    try {
      const category = this.getObject(req);
      const { substitute } = req.query;

      await CategoryService.destroyCategory(category, substitute);

      return res.status(204).json();
    } catch (err) {
      return next(err);
    }
  }

  performSave(req, object) {
    const { description } = req.body;
    if (description !== undefined) {
      object.set({ user: req.user, description });
    }
    return object.save();
  }

  getDocuments({ user: { id: userId } }) {
    return CategoryService
      .listCategories()
      .find({ user: userId })
      .populate('subcategories');
  }

  filterDocuments({ query: { search } }, documents) {
    const filters = {};

    if (search) {
      filters.description = new RegExp(`${search}`);
    }

    return documents.find(filters);
  }

  getActionSchema() {
    return {
      ...super.getActionSchema(),
      createSubcategory: {
        detail: true,
        method: 'post',
        urlPath: 'subcategories',
      }
    };
  }
}

module.exports = CategoryController;