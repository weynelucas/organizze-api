const express = require('express');
const autobind = require('auto-bind');
const mongoose = require('mongoose');

const { NotFoundError } = require('../errors/api');

class BaseController {

  /**
   * @param {mongoose.Model|string} model The default model object for the controller.
   * @param {string} lookupField The field name for object lookup.
   * @param {string} lookupFieldParam The request param name used for object lookup . 
   * @param {string} requestProperty The request property name where object will be stored. 
   */
  constructor(
    model, 
    lookupField='_id',
    lookupFieldParam='id',
    requestProperty='object',
  ) {
    this.model = typeof model === 'string' ? mongoose.model(model) : model;
    this.lookupField = lookupField;
    this.lookupFieldParam = lookupFieldParam || lookupField;
    this.requestProperty = requestProperty;

    // Automatically bind methods to their class instance
    autobind(this);
  }


  /**
   * Return the list of items for a route.
   * 
   * You may want to override this if you need to provide different
   * documents depending on the incoming request.
   * @param {express.Request} req The incoming request object
   * @return {mongoose.DocumentQuery} The list of documents
   */
  getDocuments(req) {
    return this.model.find();
  }

  /** 
   * Returns the object the route is displaying.
   * 
   * You may want to override this if you need to provide a non-standart
   * object lookup depending on the incoming request.
   * @param {express.Request} req The incoming request object
   */
  async getObject(req) {
    // Get object from request
    if (req[this.requestProperty] !== undefined) {
      return req[this.requestProperty];
    }

    // Perform the lookup filtering
    const object = await this.getDocuments(req)
      .findOne({
        [this.lookupField]: req.params[this.lookupFieldParam] 
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
   * @param {express.Request} req The incoming request object
   * @param {mongoose.DocumentQuery} documents The documents (query) to filter
   */
  filterDocuments(req, documents) {
    return documents;
  }

  /**
   * Saves a model instance.
   * @param {express.Request} req The incoming request object
   * @param {mongoose.Document} object The instance of the model to save
   */
  performSave(req, object) {
    object.set(req.body);
    return object.save();
  }

  /**
   * Handler to load object and store it into the
   * incoming request object
   * @param {express.Request} req The incoming request object
   * @param {express.Response} res The response object
   * @param {express.NextFunction} next The next middleware on stack
   */
  async loadObject(req, res, next) {
    try {
      // eslint-disable-next-line require-atomic-updates
      req[this.requestProperty] = await this.getObject(req);
      return next();
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    const results = await this.filterDocuments(req, this.getDocuments(req));

    return res.json({
      count: results.length,
      results
    });
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
      var object = this.model();
  
      object = await this.performSave(req, object);
      return res.status(201).json(object.toJSON());
    } catch (err) {
      return next(err);
    }
  }

  async update(req, res, next) {
    try {
      var object = await this.getObject(req);

      object = await this.performSave(req, object);
      return res.json(object.toJSON());
    } catch (err) {
      return next(err);
    }
  }

  async destroy(req, res, next) {
    try {
      const object = await this.getObject(req);
      await object.remove();
  
      return res.status(204).json();
    } catch(err) {
      return next(err);
    }
  }

  /**
   * Return the list of controller methods that can be used
   * to handle requests on routes
   */
  getActions() {
    return ['list', 'create', 'retrieve', 'update', 'destroy'];
  }

  /**
   * Return the list of controller methods that can be used
   * to handle requests for a specific resource
   */
  getDetailActions() {
    return ['retrieve', 'update', 'destroy'];
  }

  getActionMap() {
    return {
      'get': 'list',
      'post': 'create',
    };
  }

  getDetailActionMap() {
    return {
      'get': 'retrieve',
      'put': 'update',
      'patch': 'update',
      'delete': 'destroy',
    };
  }
  
  /**
   * Get the complete middleware and routing system for the
   * controller based on their actions
   * @return {express.Router} The router instance with all routes registered
   */
  getRouter() {
    const router = express.Router();
    const detailActions = this.getDetailActions();
    const listActions = this.getActions()
      .filter(action => !detailActions.includes(action));

    // Register list actions
    Object.entries(this.getActionMap()).map(([method, action]) => {
      router[method]('/', this[action]);
    });
    
    return router;
  }
}


module.exports = BaseController;