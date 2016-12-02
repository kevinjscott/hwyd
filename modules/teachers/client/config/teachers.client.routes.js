(function () {
  'use strict';

  angular
    .module('teachers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('teachers', {
        abstract: true,
        url: '/teachers',
        template: '<ui-view/>'
      })
      .state('editquestion', {
        abstract: true,
        url: '/q',
        template: '<ui-view/>'
      })

      // custom question routes
      .state('editquestion.editquestion', {
        url: '/:teacherId/:encryptedDate',
        templateUrl: 'modules/teachers/client/views/form-question.client.view.html',
        controller: 'TeachersController',
        controllerAs: 'vm',
        resolve: {
          teacherResolve: getTeacher,
          stateParamsResolve: getStateParams
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle: 'Add a custom question - {{ teacherResolve.name }}'
        }
      })

      // teachers routes
      .state('teachers.list', {
        url: '',
        templateUrl: 'modules/teachers/client/views/list-teachers.client.view.html',
        controller: 'TeachersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Teachers List'
        }
      })
      .state('teachers.create', {
        url: '/create',
        templateUrl: 'modules/teachers/client/views/form-teacher.client.view.html',
        controller: 'TeachersController',
        controllerAs: 'vm',
        resolve: {
          teacherResolve: newTeacher
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Teachers Create'
        }
      })
      .state('teachers.edit', {
        url: '/:teacherId/edit',
        templateUrl: 'modules/teachers/client/views/form-teacher.client.view.html',
        controller: 'TeachersController',
        controllerAs: 'vm',
        resolve: {
          teacherResolve: getTeacher
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Teacher {{ teacherResolve.name }}'
        }
      })
      .state('teachers.view', {
        url: '/:teacherId',
        templateUrl: 'modules/teachers/client/views/view-teacher.client.view.html',
        controller: 'TeachersController',
        controllerAs: 'vm',
        resolve: {
          teacherResolve: getTeacher
        },
        data: {
          pageTitle: 'Teacher {{ teacherResolve.name }}'
        }
      });
  }

  getTeacher.$inject = ['$stateParams', 'TeachersService'];

  function getTeacher($stateParams, TeachersService) {
    return TeachersService.get({
      teacherId: $stateParams.teacherId
    }).$promise;
  }

  getStateParams.$inject = ['$stateParams'];

  function getStateParams($stateParams) {
    return $stateParams;
  }

  newTeacher.$inject = ['TeachersService'];

  function newTeacher(TeachersService) {
    return new TeachersService();
  }
}());
