describe("Services: ats.services.api-service", function() {
	var expectMethod = function(meth) {
	  it("should implement '"+meth+"' method", inject(['apiService',function(service) {
	     expect(service[meth]).toBeDefined();
	 }]));
	};


	// Setup/teardown ------------------------------------------


	beforeEach(window.module('ats.services.api-service'));
	
	
	// Specs ----------------------------------------------------
	

  it('should contain an apiService service', inject(function(apiService) {
    expect(apiService).toBeDefined();
  }));

	describe("should implement methods:", function(){
		expectMethod('login');
		expectMethod('keepAlive');
		expectMethod('getEvent');
		expectMethod('getSportsRootNodes');
		expectMethod('getSportsNode');
		expectMethod('getSportMarkets');
		expectMethod('searchEvents');
		expectMethod('searchEventsByCriteria');
		expectMethod('searchMarkets');
	})
});