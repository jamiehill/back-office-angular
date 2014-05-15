describe("Services: ats.services.session-service", function() {
	var $sessionService, $httpBackend, win;
	var success = sinon.spy(),
					failure = sinon.spy();


	// expects a method to be defined on the service
	var expectMethod = function(meth) {
		it("should implement '"+meth+"' method", inject(['sessionService',function(service) {
			expect(service[meth]).toBeDefined();
		}]));
	};

	var isAuthorized = function(auth) {
		if(auth)
		{
			win.sessionStorage.should.have.property('user');
			win.sessionStorage.user.should.equal('bob');
			win.sessionStorage.should.have.property('token');
			win.sessionStorage.token.should.equal('xxxxxxxxxx');
		}
		else
		{
			win.sessionStorage.should.not.have.property('user');
			win.sessionStorage.should.not.have.property('token');
		}
	}


	// Setup/teardown ------------------------------------------


	beforeEach(function(){
		window.module('ats.services.session-service');
		window.module(function ($provide) {
			$provide.value('cfg', { appname:'someApp '});
			$provide.value('$window', win = {});
		});
	});

	beforeEach(inject(function(_$httpBackend_, _sessionService_){
		$sessionService = _sessionService_;
		$httpBackend  	= _$httpBackend_;
	}));

	afterEach(function() {
		success.reset(); failure.reset();
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});


  	// Specs ----------------------------------------------------


  	it('should contain a sessionService service', function() {
  		$sessionService.should.be.defined;
  	});

  	it('should have non null $httpBackend', function() {
  		$httpBackend.should.be.defined;
  	});


  	describe("should implement methods:", function(){

  		describe("Services: ats.services.session-service::login", function(){
  			var good = {Login:{user:'bob',sessionToken:'xxxxxxxxxx'}},
  			bad  = {Error:{}};

  			expectMethod('login');
  			it('should make valid request and set user/token to $window.sessionStorage', function () {
  				$httpBackend.whenPOST('login').respond(200, good);

  				$sessionService.login('test1','test1').success(success).error(failure);
  				$httpBackend.flush();

  				isAuthorized(true);
  			});

  			it('should make invalid request and clear $window.sessionStorage', inject(function ($httpBackend) {
  				var response = {Error:{}};
  				$httpBackend.whenPOST('login').respond(401, bad);

  				$sessionService.login('what','ever').success(success).error(failure);
  				$httpBackend.flush();

  				isAuthorized(false);
  			}));

  		});

  		describe("Services: ats.services.session-service::logout", function(){

  			expectMethod('logout');
  			it('should make valid request and clear $window.sessionStorage', function () {
  				$httpBackend.whenPOST('logout').respond();

  				// mock previously authenticated
  				win.sessionStorage = {token:'xxxxxxxxxx', user: 'bob'};


  				$sessionService.logout().success(success).error(failure);
  				$httpBackend.flush();

  				isAuthorized(false);
  			});

  		});

  	});







});
