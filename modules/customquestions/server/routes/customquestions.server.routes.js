'use strict';

/**
 * Module dependencies
 */
var customquestionsPolicy = require('../policies/customquestions.server.policy'),
  customquestions = require('../controllers/customquestions.server.controller');

module.exports = function(app) {
  // Customquestions Routes
  app.route('/api/customquestions').all(customquestionsPolicy.isAllowed)
    .get(customquestions.list)
    .post(customquestions.create);

  app.route('/api/customquestions/:customquestionId').all(customquestionsPolicy.isAllowed)
    .get(customquestions.read)
    .put(customquestions.update)
    .delete(customquestions.delete);

  // Finish by binding the Customquestion middleware
  app.param('customquestionId', customquestions.customquestionByID);
};
