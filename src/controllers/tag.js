const BaseController = require('./index');


class TagController extends BaseController {
  constructor() {
    super('Tag');
  }

  performSave(req, object) {
    const { description } = req.body;
    object.set({ user: req.user, description });
    return object.save();
  }

  getDocuments({ user: { _id: userId } }) {
    return this.model.find({ user: userId});
  }

  filterDocuments({ query: { search } }, documents) {
    const filters = {}

    if (search) {
      filters.$text = {
        $search: search,
        $caseSensitive: false,
      }
    }

    return documents.find(filters);
  }
}


module.exports = TagController;