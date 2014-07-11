describe("Services: ats.services", function() {
  var currentModule, deps;
  var expectModule = function(dep) {
    it(dep, function() {
      var hasModule = deps.indexOf(dep) >= 0;
      expect(hasModule).toBe(true);
    });
  };


  // Setup/teardown ------------------------------------------
  

  beforeEach(function() {
    module = angular.module(currentModule);
    deps = module.value(currentModule).requires;
  });


  //  Specs ----------------------------------------------------
  
  currentModule = 'app';
  it("should be initialised", function() {
    expectModule('ats.services');
  });

  currentModule = 'ats.services';
  describe('should have dependencies:', function() {  
    expectModule('ats.services.api-service');
    expectModule('ats.services.session-service');
    expectModule('ats.services.socket-service');
  });

});