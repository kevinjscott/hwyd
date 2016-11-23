(function () {
  'use strict';

  angular
    .module('schools')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('schools', {
        abstract: true,
        url: '/schools',
        template: '<ui-view/>'
      })
      .state('schools.list', {
        url: '',
        templateUrl: 'modules/schools/client/views/list-schools.client.view.html',
        controller: 'SchoolsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Schools List'
        }
      })
      .state('schools.create', {
        url: '/create',
        templateUrl: 'modules/schools/client/views/form-school.client.view.html',
        controller: 'SchoolsController',
        controllerAs: 'vm',
        resolve: {
          schoolResolve: newSchool,
          customerResolve: newCustomer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Schools Create'
        }
      })
      .state('schools.edit', {
        url: '/:schoolId/edit',
        templateUrl: 'modules/schools/client/views/form-school.client.view.html',
        controller: 'SchoolsController',
        controllerAs: 'vm',
        resolve: {
          schoolResolve: getSchool,
          customerResolve: newCustomer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit School {{ schoolResolve.name }}'
        }
      })
      .state('schools.view', {
        url: '/:schoolId',
        templateUrl: 'modules/schools/client/views/view-school.client.view.html',
        controller: 'SchoolsController',
        controllerAs: 'vm',
        resolve: {
          schoolResolve: getSchool,
          customerResolve: newCustomer
        },
        data: {
          pageTitle: 'School {{ schoolResolve.name }}'
        }
      })
      .state('schools.signup', {
        url: '/:schoolId/signup',
        templateUrl: 'modules/schools/client/views/form-signup.client.view.html',
        controller: 'SchoolsController',
        controllerAs: 'vm',
        resolve: {
          schoolResolve: getSchool,
          customerResolve: newCustomer
        },
        data: {
          pageTitle: 'School {{ schoolResolve.name }}'
        }
      });
  }

  getSchool.$inject = ['$stateParams', 'SchoolsService'];

  function getSchool($stateParams, SchoolsService) {
    return SchoolsService.get({
      schoolId: $stateParams.schoolId
    }).$promise;
  }

  newSchool.$inject = ['SchoolsService'];

  function newSchool(SchoolsService) {
    return new SchoolsService();
  }

  newCustomer.$inject = ['CustomersService'];

  function newCustomer(CustomersService) {
    return new CustomersService();
  }
}());
