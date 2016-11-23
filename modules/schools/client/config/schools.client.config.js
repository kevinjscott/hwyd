(function () {
  'use strict';

  angular
    .module('schools')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Schools',
      state: 'schools',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'schools', {
      title: 'List Schools',
      state: 'schools.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'schools', {
      title: 'Create School',
      state: 'schools.create',
      roles: ['user']
    });
  }
}());
