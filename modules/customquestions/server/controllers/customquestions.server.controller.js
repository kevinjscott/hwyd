'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Customquestion = mongoose.model('Customquestion'),
  Teacher = mongoose.model('Teacher'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Customquestion
 */
exports.create = function(req, res) {
  var customquestion = new Customquestion(req.body);
  customquestion.user = req.user;

  customquestion.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customquestion);
    }
  });
};

/**
 * Show the current Customquestion
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var customquestion = req.customquestion ? req.customquestion.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  customquestion.isCurrentUserOwner = req.user && customquestion.user && customquestion.user._id.toString() === req.user._id.toString();

  res.jsonp(customquestion);
};

/**
 * Update a Customquestion
 */
exports.update = function(req, res) {
  var customquestion = req.customquestion;

  customquestion = _.extend(customquestion, req.body);

  customquestion.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customquestion);
    }
  });
};

/**
 * Delete an Customquestion
 */
exports.delete = function(req, res) {
  var customquestion = req.customquestion;

  customquestion.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customquestion);
    }
  });
};

/**
 * List of Customquestions
 */
exports.list = function(req, res) {
  Customquestion.find().sort('-createdAt').populate('user', 'displayName').populate('teacher').exec(function(err, customquestions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customquestions);
    }
  });
};

/**
 * Customquestion middleware
 */
exports.customquestionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Customquestion is invalid'
    });
  }

  Customquestion.findById(id).populate('user', 'displayName').populate('teacher').exec(function (err, customquestion) {
    if (err) {
      return next(err);
    } else if (!customquestion) {
      return res.status(404).send({
        message: 'No Customquestion with that identifier has been found'
      });
    }
    req.customquestion = customquestion;
    next();
  });
};
