const BaseController = require('./index');


class TagController extends BaseController {
  constructor() {
    super('Tag');
  }

  performSave(req, object) {
    const { description } = req.body;
    if (description !== undefined) {
      object.set({ user: req.user, description });
    }
    return object.save();
  }

  getDocuments({ user: { _id: userId } }) {
    return this.model.find({ user: userId });
  }

  filterDocuments({ query: { search } }, documents) {
    const filters = {};

    if (search) {
      filters.description = new RegExp(`${search}`);
    }

    return documents.find(filters).select('-user');
  }
}


module.exports = TagController;