const express = require('express');
const autobind = require('auto-bind');
const mongoose = require('mongoose');
const urlJoin = require('proper-url-join');

const { filterKeys } = require('../Utils/Object');
const { Status, NotFoundError } = require('../Utils/Http');

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
      return res
        .status(Status.HTTP_201_CREATED)
        .json(object.toJSON());
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

  async partialUpdate(req, res, next) {
    return await this.update(req, res, next);
  }

  async destroy(req, res, next) {
    try {
      const object = await this.getObject(req);
      await object.remove();
  
      return res.status(Status.HTTP_204_NO_CONTENT).json();
    } catch(err) {
      return next(err);
    }
  }

  getActionSchema() {
    return {
      list: {
        detail: false,
        method: 'get'
      },
      create: {
        detail: false, 
        method: 'post'
      },
      retrieve: { 
        detail: true, 
        method: 'get' 
      },
      update: { 
        detail: true, 
        method: 'put' 
      },
      partialUpdate: { 
        detail: true, 
        method: 'patch' 
      },
      destroy: { 
        detail: true, 
        method: 'delete' 
      },
    };
  }
  
  /**
   * Get the complete middleware and routing system for the
   * controller based on their actions
   * @return {express.Router} The router instance with all routes registered
   */
  Router({ only=[], except=[], middleware, validator }={}) {
    const router = express.Router();
    const schema = filterKeys(this.getActionSchema(), only, except);
    
    // Param intercept for load object
    router.param(this.lookupFieldParam, this.loadObject);

    // Registering middleware for all actions
    if (!(middleware === undefined || middleware instanceof Map)) {
      router.use('/', middleware);
    }

    // Registering validator for all actions
    if (!(validator === undefined || validator instanceof Map)) {
      router.use('/', validator);
    }

    // Registering actions based on schema
    Object.entries(schema).map(([action, { detail, method, urlPath }]) => {
      let path = urlJoin(...[
        !detail && urlPath,
        detail && `:${this.lookupFieldParam}`,
        detail && urlPath
      ]);
      let stack = [];

      if (middleware instanceof Map && middleware.has(action)) {
        stack.push(middleware.get(action));
      }

      if (validator instanceof Map && validator.has(action)) {
        stack.push(validator.get(action));
      }

      stack.push(this[action]);
      router[method](path, stack);
    });
    
    return router;
  }
}


module.exports = BaseController;