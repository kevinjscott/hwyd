(function () {
  'use strict';

  angular
    .module('customquestions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('customquestions', {
        abstract: true,
        url: '/customquestions',
        template: '<ui-view/>'
      })

      .state('editquestion2', {
        abstract: true,
        url: '/q',
        template: '<ui-view/>'
      })

      // custom question routes
      .state('editquestion2.editquestion', {
        url: '/:teacherId/:encryptedDate',
        templateUrl: 'modules/customquestions/client/views/form-customquestion.client.view.html',
        controller: 'CustomquestionsController',
        controllerAs: 'vm',
        resolve: {
          // teacherResolve: getTeacher,
          customquestionResolve: newCustomquestion,
          stateParamsResolve: getStateParams
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle: 'Add a custom question'  // todo: page title
          // pageTitle: 'Add a custom question - {{ teacherResolve.name }}'
        }
      })

      .state('customquestions.list', {
        url: '',
        templateUrl: 'modules/customquestions/client/views/list-customquestions.client.view.html',
        controller: 'CustomquestionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Customquestions List'
        }
      })
      .state('customquestions.create', {
        url: '/create',
        templateUrl: 'modules/customquestions/client/views/form-customquestion.client.view.html',
        controller: 'CustomquestionsController',
        controllerAs: 'vm',
        resolve: {
          customquestionResolve: newCustomquestion
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle: 'Customquestions Create'
        }
      })
      .state('customquestions.edit', {
        url: '/:customquestionId/edit',
        templateUrl: 'modules/customquestions/client/views/form-customquestion.client.view.html',
        controller: 'CustomquestionsController',
        controllerAs: 'vm',
        resolve: {
          customquestionResolve: getCustomquestion
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle: 'Edit Customquestion {{ customquestionResolve.name }}'
        }
      })
      .state('customquestions.view', {
        url: '/:customquestionId',
        templateUrl: 'modules/customquestions/client/views/view-customquestion.client.view.html',
        controller: 'CustomquestionsController',
        controllerAs: 'vm',
        resolve: {
          customquestionResolve: getCustomquestion,
          // teacherResolve: getTeacher,
          stateParamsResolve: getStateParams
        },
        data: {
          pageTitle: 'Customquestion {{ customquestionResolve.name }}'
        }
      });
  }

  getTeacher.$inject = ['$stateParams', 'TeachersService'];

  function getTeacher($stateParams, TeachersService) {
    return TeachersService.get({
      teacherId: $stateParams.teacherId
    }).$promise;
  }

  getCustomquestion.$inject = ['$stateParams', 'CustomquestionsService'];

  function getCustomquestion($stateParams, CustomquestionsService) {
    return CustomquestionsService.get({
      customquestionId: $stateParams.customquestionId
    }).$promise;
  }

  getStateParams.$inject = ['$stateParams'];

  function getStateParams($stateParams) {
    return $stateParams;
  }

  newCustomquestion.$inject = ['$stateParams', 'CustomquestionsService', 'TeachersService'];

  function newCustomquestion($stateParams, CustomquestionsService, TeachersService) {
    var s = new CustomquestionsService();
    getTeacher($stateParams, TeachersService).then(function(teacher){
      s.teacher = teacher._id;
      s.teachername = teacher.name;
    });
    return s;
  }
}());
