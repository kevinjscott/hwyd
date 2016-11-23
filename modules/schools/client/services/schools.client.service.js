// Schools service used to communicate Schools REST endpoints
(function () {
  'use strict';

  angular
    .module('schools')
    .factory('SchoolsService', SchoolsService);

  SchoolsService.$inject = ['$resource'];

  function SchoolsService($resource) {
    return $resource('api/schools/:schoolId', {
      schoolId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
