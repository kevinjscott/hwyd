(function () {
  'use strict';

  angular
    .module('schools')
    .controller('SchoolsListController', SchoolsListController);

  SchoolsListController.$inject = ['SchoolsService'];

  function SchoolsListController(SchoolsService) {
    var vm = this;

    vm.schools = SchoolsService.query();
  }
}());
