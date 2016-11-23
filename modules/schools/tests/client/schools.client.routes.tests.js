(function () {
  'use strict';

  describe('Schools Route Tests', function () {
    // Initialize global variables
    var $scope,
      SchoolsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SchoolsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SchoolsService = _SchoolsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('schools');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/schools');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SchoolsController,
          mockSchool;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('schools.view');
          $templateCache.put('modules/schools/client/views/view-school.client.view.html', '');

          // create mock School
          mockSchool = new SchoolsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'School Name'
          });

          // Initialize Controller
          SchoolsController = $controller('SchoolsController as vm', {
            $scope: $scope,
            schoolResolve: mockSchool
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:schoolId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.schoolResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            schoolId: 1
          })).toEqual('/schools/1');
        }));

        it('should attach an School to the controller scope', function () {
          expect($scope.vm.school._id).toBe(mockSchool._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/schools/client/views/view-school.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SchoolsController,
          mockSchool;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('schools.create');
          $templateCache.put('modules/schools/client/views/form-school.client.view.html', '');

          // create mock School
          mockSchool = new SchoolsService();

          // Initialize Controller
          SchoolsController = $controller('SchoolsController as vm', {
            $scope: $scope,
            schoolResolve: mockSchool
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.schoolResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/schools/create');
        }));

        it('should attach an School to the controller scope', function () {
          expect($scope.vm.school._id).toBe(mockSchool._id);
          expect($scope.vm.school._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/schools/client/views/form-school.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SchoolsController,
          mockSchool;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('schools.edit');
          $templateCache.put('modules/schools/client/views/form-school.client.view.html', '');

          // create mock School
          mockSchool = new SchoolsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'School Name'
          });

          // Initialize Controller
          SchoolsController = $controller('SchoolsController as vm', {
            $scope: $scope,
            schoolResolve: mockSchool
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:schoolId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.schoolResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            schoolId: 1
          })).toEqual('/schools/1/edit');
        }));

        it('should attach an School to the controller scope', function () {
          expect($scope.vm.school._id).toBe(mockSchool._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/schools/client/views/form-school.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
