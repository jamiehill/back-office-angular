describe("Module: app", function() {
  var module, cfg, deps;
  var expectModule = function(dep) {
    it(dep, function() {
      var hasModule = deps.indexOf(dep) >= 0;
      expect(hasModule).toBe(true);
    });
  };


  // Setup/teardown ------------------------------------------


  beforeEach(function(){
    module = angular.module("app");
    deps = module.value('app').requires;
  });


  // Specs ----------------------------------------------------


  it("should be initialised", function() {
    expect(module.name).toBe('app');
  });


  describe('should have dependencies:', function() {
    expectModule('ngRoute');
    expectModule('ui.bootstrap');
    expectModule('app.header');
    expectModule('app.main');
    expectModule('app.footer');
  });

});