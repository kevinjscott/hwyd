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
          customquestionResolve: getCustomquestion
        },
        data: {
          pageTitle: 'Customquestion {{ customquestionResolve.name }}'
        }
      });
  }

  getCustomquestion.$inject = ['$stateParams', 'CustomquestionsService'];

  function getCustomquestion($stateParams, CustomquestionsService) {
    return CustomquestionsService.get({
      customquestionId: $stateParams.customquestionId
    }).$promise;
  }

  newCustomquestion.$inject = ['CustomquestionsService'];

  function newCustomquestion(CustomquestionsService) {
    return new CustomquestionsService();
  }
}());
