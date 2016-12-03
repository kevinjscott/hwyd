(function () {
  'use strict';

  angular
    .module('customquestions')
    .controller('CustomquestionsListController', CustomquestionsListController);

  CustomquestionsListController.$inject = ['CustomquestionsService'];

  function CustomquestionsListController(CustomquestionsService) {
    var vm = this;

    vm.customquestions = CustomquestionsService.query();
  }
}());
