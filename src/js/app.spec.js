describe("app.js", function() {
  var module;

  beforeEach(function(){
    module = angular.module("app");
  });

  it("should register module::app", function() {
    expect(module.name).toBe('app');
  });


  describe('should have dependencies:', function() {
    var deps;
    var hasModule = function(m) {
      return deps.indexOf(m) >= 0;
    };
    var expectModule = function(dep) {
      it(dep, function() {
        expect(hasModule(dep)).toBe(true);
      });
    };

    beforeEach(function() {
      deps = module.value('app').requires;
    });

    expectModule('ngRoute');
    expectModule('ui.bootstrap');
    expectModule('ui.bootstrap');
    expectModule('app.header');
    expectModule('app.main');
    expectModule('app.footer');
    expectModule('app.templates');

  });

});