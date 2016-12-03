(function () {
  'use strict';

  // Customquestions controller
  angular
    .module('customquestions')
    .controller('CustomquestionsController', CustomquestionsController);

  CustomquestionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'customquestionResolve'];

  function CustomquestionsController ($scope, $state, $window, Authentication, customquestion) {
    var vm = this;

    vm.authentication = Authentication;
    vm.customquestion = customquestion;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

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

      // TODO: move create/update logic to service
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
