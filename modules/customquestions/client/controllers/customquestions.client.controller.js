(function () {
  'use strict';

  // Customquestions controller
  angular
    .module('customquestions')
    .controller('CustomquestionsController', CustomquestionsController);

  CustomquestionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'customquestionResolve', 'stateParamsResolve', 'moment'];

  function CustomquestionsController ($scope, $state, $window, Authentication, customquestion, routeParams, moment) {
    var vm = this;

    vm.customQuestion = customQuestion;   // todo: secure this page / API
    vm.authentication = Authentication;
    // vm.teacher = teacher;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.routeParams = routeParams;

    vm.customquestion = customquestion;

    if (routeParams.encryptedDate) {
      vm.customquestion.date = routeParams.encryptedDate;
      vm.customquestion.teacher = routeParams.teacherId;
    }

    vm.convertDate = convertDate;

    function customQuestion() {
      // var d = '11/28/2016';
      var d = convertDate('l');
      var result = _.find(vm.customquestion.teacher.customitems, ['date', d]);
      if (result) {
        return result.message;
      } else {
        return null;
      }
    }

    function convertDate(token) {
      var u = moment(vm.routeParams.encryptedDate, 'x');
      if (u.isValid()) {
        u = u.format(token);
      } else {
        u = null;
      }
      return u;
    }

    // Remove existing Customquestion
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.customquestion.$remove($state.go('customquestions.list'));
      }
    }

    // Save Customquestion
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.customquestionForm');
        return false;
      }

      if (vm.customquestion._id) {
        vm.customquestion.$update(successCallback, errorCallback);
      } else {
        vm.customquestion.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('customquestions.view', {
          customquestionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
