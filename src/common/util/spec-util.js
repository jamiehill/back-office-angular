'strict';

module.exports = {
  hasDependency: function(dep, deps) {
  	return it(dep, function() {
     var hasModule = deps.indexOf(dep) >= 0;

     console.log("Dep: "+dep+", Deps: "+deps.join('|'))
     expect(hasModule).toBe(true);
   });
  },

  expectDefinition: function(def) {
    return it("should have an '"+def+"' defined", function() {
      expect(cfg[def]).toBeDefined();
    });
  }

};