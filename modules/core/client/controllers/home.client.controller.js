'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'moment', 'TeachersService',
  function ($scope, Authentication, moment, TeachersService) {
    var i, o;

    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.teachers = TeachersService.query();

    $scope.dates = [];
    for (i = 0; i < 7; i++) {
      o = {};
      o.pretty = moment().add(i, 'days').format('ddd, MMM D');
      o.ms = moment().add(i, 'days').format('x');
      $scope.dates.push(o);
    }
  }
]);
