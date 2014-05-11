var app = require('./app');

describe("app.js", function() {
  var module;

  beforeEach(function(){
    module = angular.module("app");
  });

  it("should be registered ...", function() {
    expect(module.name).toBe('app');
  });

  it('should have an AppCtrl controller', 
    inject(function($rootScope, $controller) {

    var scope = $rootScope.$new();
    var ctrl = $controller(AppCtrl, {$scope: scope }); 

    expect(ctrl).not.to.equal(null);
  }));

  describe('should have dependencies:', function() {
    var deps;
    var hasModule = function(m) {
      return deps.indexOf(m) >= 0;
    };
    beforeEach(function() {
      deps = module.value('app').requires;
    });

    it("'ngRoute'", function() {
      expect(hasModule('ngRoute')).toBe(true);
    });

    it("'ui.bootstrap'", function() {
      expect(hasModule('ui.bootstrap')).toBe(true);
    });

    it("'ats.services'", function() {
      expect(hasModule('ats.services')).toBe(true);
    });

    it("'app.header'", function() {
      expect(hasModule('app.header')).toBe(true);
    });

    it("'app.main'", function() {
      expect(hasModule('app.main')).toBe(true);
    });

    it("'app.footer'", function() {
      expect(hasModule('app.footer')).toBe(true);
    });

    it("'app.templates'", function() {
      expect(hasModule('app.templates')).toBe(true);
    });

  });

  describe('should have constants:', function() {

  });

});