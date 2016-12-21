'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Customer = mongoose.model('Customer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  send = require(path.resolve('./modules/scheduledstuff/server/send')),
  s = require('underscore.string'),
  _ = require('lodash');

var teachersNames = function(kidsObj, separator) {
  var k = kidsObj;
  k = _.map(k, 'teacher.name');
  k = _.uniq(k);
  k = _.sortBy(k);
  var result = s.toSentenceSerial(k, ', ', separator);
  return result;
};

/**
 * Create a Customer
 */
exports.create = function(req, res) {
  var customer = new Customer(req.body);
  var k, subj, msg;
  customer.user = req.user;

  customer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      k = customer.kids;
      // console.log(req.body.kids);
      k = _.map(k, 'name');
      k = _.uniq(k);
      k = _.sortBy(k);

      msg = 'Every weekday, you\'ll receive great questions to ask ' + s.toSentenceSerial(k, ', ', ' and ') + '.\n\n';
      msg += 'If ' + teachersNames(req.body.kids, ' or ') + ' submits a specific question for students, you\'ll see that, too. Have fun!';
      switch(customer.delivery.method) {
        case 'slack':
          send.slack(msg, customer.delivery.address);
          break;
        case 'text':
          send.twilioText(msg, customer.delivery.address);
          break;
        case 'email':
          subj = 'Welcome!';
          send.dailyCustomerEmail(subj, msg, customer.delivery.address);
          break;
        default:
          console.log('delivery method not found for user ' + JSON.stringify(customer));
      }

      res.jsonp(customer);
    }
  });
};

/**
 * Show the current Customer
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var customer = req.customer ? req.customer.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  customer.isCurrentUserOwner = req.user && customer.user && customer.user._id.toString() === req.user._id.toString();

  res.jsonp(customer);
};

/**
 * Update a Customer
 */
exports.update = function(req, res) {
  var customer = req.customer;

  customer = _.extend(customer, req.body);

  customer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * Delete an Customer
 */
exports.delete = function(req, res) {
  var customer = req.customer;

  customer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * List of Customers
 */
exports.list = function(req, res) {
  Customer.find().sort('-createdAt').populate('user', 'displayName').exec(function(err, customers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customers);
    }
  });
};

/**
 * Customer middleware
 */
exports.customerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Customer is invalid'
    });
  }

  Customer.findById(id).populate('user', 'displayName').populate('kids.teacher').exec(function (err, customer) {
    if (err) {
      return next(err);
    } else if (!customer) {
      return res.status(404).send({
        message: 'No Customer with that identifier has been found'
      });
    }
    req.customer = customer;
    next();
  });
};
