'use strict';
 
describe('httpIntercetor', function(){
    
    var httpProvider;

    beforeEach(module('app', function ($httpProvider) {
        console.log('BEGIN: module callback');
        httpProvider = $httpProvider;
        console.log('END: module callback');
    }));

    it('should show that beforeEach module callback is not executed when test does not need module', function () {
        console.log('BEGIN: it test - no module');
        expect(true).toBeTruthy();
        console.log('END: it test - no module');
    });

    it('should have added authTokenHttpInterceptor as http interceptor (inject calls module callback before run test)', inject(function () {
        console.log('BEGIN: it test');
        expect(httpProvider.interceptors).toContain('falseHttpInterceptor');
        console.log('END: it test');
    }));
 

});