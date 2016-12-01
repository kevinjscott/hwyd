(function () {
  'use strict';

  // Teachers controller
  angular
    .module('teachers')
    .controller('TeachersController', TeachersController);

  TeachersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'teacherResolve', 'stateParamsResolve', 'moment'];

  function TeachersController ($scope, $state, $window, Authentication, teacher, routeParams, moment) {
    var vm = this;

    vm.authentication = Authentication;
    vm.teacher = teacher;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.saveQuestion = saveQuestion;
    vm.routeParams = routeParams;
    vm.date = convertDate;

    function convertDate() {
      var u = moment(vm.routeParams.encryptedDate, 'X');
      if (u.isValid()) {
        u = u.format('l');
      } else {
        u = null;
      }
      return u;
    }

    // Remove existing Teacher
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.teacher.$remove($state.go('teachers.list'));
      }
    }

    // Save Teacher
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.teacherForm');
        return false;
      }

      if (vm.teacher._id) {
        vm.teacher.$update(successCallback, errorCallback);
      } else {
        vm.teacher.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('teachers.view', {
          teacherId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function saveQuestion(isValid) {  // todo: implement this function
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

  }
}());
