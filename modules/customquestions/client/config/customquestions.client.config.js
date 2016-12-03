(function () {
  'use strict';

  angular
    .module('customquestions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Customquestions',
      state: 'customquestions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'customquestions', {
      title: 'List Customquestions',
      state: 'customquestions.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'customquestions', {
      title: 'Create Customquestion',
      state: 'customquestions.create',
      roles: ['user']
    });
  }
}());
