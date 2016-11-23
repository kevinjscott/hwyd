(function () {
  'use strict';

  // Customers controller
  angular
    .module('customers')
    .controller('CustomersController', CustomersController)
    .constant('s', window.s)  // http://stackoverflow.com/questions/14968297/use-underscore-inside-angular-controllers
    .constant('_', window._)
    .run(function ($rootScope) {
      $rootScope.s = window.s;
      $rootScope._ = window._;
    });

  CustomersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'customerResolve', 'moment'];

  function CustomersController ($scope, $state, $window, Authentication, customer, moment) {
    var vm = this;

    vm.authentication = Authentication;
    vm.customer = customer;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.teachersNames = function(separator) {
      var k = vm.customer.kids;
      k = _.map(k, 'teacher.name');
      k = _.uniq(k);
      k = _.sortBy(k);
      var result = s.toSentenceSerial(k, ', ', separator);
      return result;
    };

    vm.kidsNames = function(separator) {
      var k = vm.customer.kids;
      k = _.map(k, 'name');
      k = _.sortBy(k);
      var result = s.toSentenceSerial(k, ', ', separator);
      return result;
    };

    vm.convertTime1 = function(timeString) {
      return moment(timeString, 'H:mm').format('LT');
    };

    // Remove existing Customer
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.customer.$remove($state.go('customers.list'));
      }
    }

    // Save Customer
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.customerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.customer._id) {
        vm.customer.$update(successCallback, errorCallback);
      } else {
        vm.customer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('customers.view', {
          customerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
