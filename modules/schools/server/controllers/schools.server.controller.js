'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  School = mongoose.model('School'),
  Teacher = mongoose.model('Teacher'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a School
 */
exports.create = function(req, res) {
  var school = new School(req.body);
  school.user = req.user;

  school.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(school);
    }
  });
};

/**
 * Show the current School
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var school = req.school ? req.school.toJSON() : {};

  Teacher.find({ schoolid: school._id }).sort('name').exec(function(err, teachers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      school.teachers = teachers;

      // Add a custom field to the Article, for determining if the current User is the "owner".
      // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
      school.isCurrentUserOwner = req.user && school.user && school.user._id.toString() === req.user._id.toString();

      res.jsonp(school);
    }
  });
};

/**
 * Update a School
 */
exports.update = function(req, res) {
  var school = req.school;

  school = _.extend(school, req.body);

  school.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(school);
    }
  });
};

/**
 * Delete an School
 */
exports.delete = function(req, res) {
  var school = req.school;

  school.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(school);
    }
  });
};

/**
 * List of Schools
 */
exports.list = function(req, res) {
  School.find().sort('-createdAt').populate('user', 'displayName').exec(function(err, schools) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(schools);
    }
  });
};

/**
 * School middleware
 */
exports.schoolByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'School is invalid'
    });
  }

  School.findById(id).populate('user', 'displayName').exec(function (err, school) {
    if (err) {
      return next(err);
    } else if (!school) {
      return res.status(404).send({
        message: 'No School with that identifier has been found'
      });
    }
    req.school = school;
    next();
  });
};
