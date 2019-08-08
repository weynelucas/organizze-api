const mongoose = require('mongoose')
const { NotFoundError } = require('../errors/api');

class BaseController {

  /**
   * @param {Model} model The default model object for the controller.
   * @param {string} lookupField The field name for object lookup.
   * @param {string} lookupFieldParam The request param name used for object lookup . 
   */
  constructor(model, lookupField='_id', lookupFieldParam='id') {
    this.model = typeof model === 'string' ? mongoose.model(model) : model;
    this.lookupField = lookupField;
    this.lookupFieldParam = lookupFieldParam || lookupField;

    // Bind methods
    this.getObject = this.getObject.bind(this);
    this.getDocuments = this.getDocuments.bind(this);
    this.filterDocuments = this.filterDocuments.bind(this);

    // Bind routes
    this.list = this.list.bind(this);
    this.create = this.create.bind(this);
    this.retrieve = this.retrieve.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }


  /**
   * Return the list of items for a route.
   * 
   * You may want to override this if you need to provide different
   * documents depending on the incoming request.
   * @param {Object} req The incoming request object
   */
  getDocuments(req) {
    return this.model.find();
  }

  /** 
   * Returns the object the route is displaying.
   * 
   * You may want to override this if you need to provide a non-standart
   * object lookup depending on the incoming request.
   * @param {Object} req The incoming request object
   */
  async getObject(req) {
    // Perform the lookup filtering
    const object = await this.getDocuments(req)
      .findOne({
        [this.lookupField]: req.param[this.lookupFieldParam] 
      });

    // Raise not found error
    if (!object) {
      throw new NotFoundError();
    }

    return object;
  }

  /**
   * Given a document query, filter it with wichever filter 
   * is in use.
   * 
   * You may want to override this if you need to provide a different
   * filter depending on the incoming request.
   * @param {Object} req The incoming request object
   * @param {Object} documents The documents (query) to filter
   */
  filterDocuments(req, documents) {
    return documents;
  }

  async list(req, res, next) {
    const documents = this.getDocuments(req);
    const results = await this.filterDocuments(req, this.getDocuments(req));

    return res.json({
      count: results.length,
      results
    })
  }

  async retrieve(req, res, next) {
    try {
      const object = await this.getObject(req);
      return res.json(object.toJSON());
    } catch (err) {
      return next(err);
    }
  }

  async create(req, res, next) {
    try {
      const object = this.model(req.body);
  
      await object.save(req.body);
      return res.status(201).json(object.toJSON());
    } catch (err) {
      return next(err);
    }
  }

  async update(req, res, next) {
    try {
      const object = this.getObject(req);
      await object.save(req.body);
      return res.json(object.toJSON());
    } catch (err) {
      return next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const object = await this.getObject(req);
      await object.remove();
  
      return res.status(204).json();
    } catch(err) {
      return next(err);
    }
  }
}


module.exports = BaseController;