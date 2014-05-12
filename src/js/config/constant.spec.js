describe("Constant: cfg", function() {
	var cfg;
	var expectDefinition = function(def) {
	    it("should have an '"+def+"' defined", function(){
	  		expect(cfg[def]).toBeDefined();
	  	});
	 };


	// Setup/teardown ------------------------------------------
	

	beforeEach(function () {
		window.module('app');
	    inject(function (_cfg_) {
	    	cfg = _cfg_;
	    });
	});


	// Specs ----------------------------------------------------
	

	it('should be initialised', function () {
    	expect(!!cfg).toBe(true);
  	});

  	describe('should have values:', function() {
	  	expectDefinition('appname');
	  	expectDefinition('endpoint');
	  	expectDefinition('ws');
	});

});