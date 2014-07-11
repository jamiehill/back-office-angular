xdescribe("Module: app.header", function() {
	var scope, controller;

  // Setup/teardown ------------------------------------------

  beforeEach(function () {
  	window.module('app.header');
    inject(function($rootScope, $controller) {
        scope       = $rootScope.$new();
        controller  = $controller("HeaderCtrl", { $scope: scope });
    });
	});

  // Specs ----------------------------------------------------

  it('should have a HeaderCtrl initialised', inject(function(HeaderCtrl) {
  	expect(controller).toBeDefined();
	}));

});