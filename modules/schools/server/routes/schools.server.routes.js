'use strict';

/**
 * Module dependencies
 */
var schoolsPolicy = require('../policies/schools.server.policy'),
  schools = require('../controllers/schools.server.controller');

module.exports = function(app) {
  // Schools Routes
  app.route('/api/schools').all(schoolsPolicy.isAllowed)
    .get(schools.list)
    .post(schools.create);

  app.route('/api/schools/:schoolId').all(schoolsPolicy.isAllowed)
    .get(schools.read)
    .put(schools.update)
    .delete(schools.delete);

  // Finish by binding the School middleware
  app.param('schoolId', schools.schoolByID);
};
