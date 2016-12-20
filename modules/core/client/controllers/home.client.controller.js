'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'moment', 'TeachersService',
  function ($scope, Authentication, moment, TeachersService) {
    var i, o;

    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.teachers = TeachersService.query();

    $scope.version = version;

    $scope.dates = [];
    for (i = 0; i < 7; i++) {
      var temp = moment().add(i, 'days');
      o = {};
      o.pretty = temp.format('ddd, MMM D');
      o.ms = temp.format('x');
      o.ignoreme = moment(o.pretty, 'ddd, MMM D').format('x');
      $scope.dates.push(o);
    }
  }
]);
