// Customquestions service used to communicate Customquestions REST endpoints
(function () {
  'use strict';

  angular
    .module('customquestions')
    .factory('CustomquestionsService', CustomquestionsService);

  CustomquestionsService.$inject = ['$resource'];

  function CustomquestionsService($resource) {
    return $resource('api/customquestions/:customquestionId', {
      customquestionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
