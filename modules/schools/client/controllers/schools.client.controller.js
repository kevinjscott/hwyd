(function () {
  'use strict';

  // Schools controller
  angular
    .module('schools')
    .controller('SchoolsController', SchoolsController);

  SchoolsController.$inject = ['$scope', '$state', '$timeout', '$window', 'Authentication', 'schoolResolve', 'customerResolve', 'moment'];

  function SchoolsController ($scope, $state, $timeout, $window, Authentication, school, customer, moment) {
    var vm = this;

    vm.authentication = Authentication;
    vm.school = school;
    vm.customer = customer;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.saveCustomer = saveCustomer;
    vm.addKid = addKid;

    // Remove existing School
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.school.$remove($state.go('schools.list'));
      }
    }

    // Save School
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.schoolForm');
        return false;
      }

      if (vm.school._id) {
        vm.school.$update(successCallback, errorCallback);
      } else {
        vm.school.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('schools.view', {
          schoolId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }


    function saveCustomer(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.customerForm');
        return false;
      }

      vm.customer.name = vm.customer.email;
      vm.customer.delivery.address = vm.customer.email;
      vm.customer.delivery.method = 'email';
      vm.customer.delivery.time = moment(vm.customer.delivery.time).format('H:mm');

      if (vm.customer._id) {
        vm.customer.$update(successCallback, errorCallback);
      } else {
        vm.customer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('customers.confirm', {
          customerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    vm.customer.kids = [{}];
    vm.customer.delivery = {};
    vm.customer.delivery.time = 'Tue Nov 22 2016 15:00:00 GMT-0500 (EST)';

    function addKid(){ 
      vm.customer.kids.push({});
      for (var i = 0; i < 6; i++) {
        focusOn('kidname' + i);
      }
    }

    function focusOn(id) {
      $timeout(function() {
        var element = $window.document.getElementById(id);
        if(element) {
          element.focus();
        }
      });
    }

  }
}());
