'strict';


var service = require('./service.js'),
 	login   = require('./login/login.js'), 
 	auth 	= require('./authorization.js');

angular.module('security', [

  'security.service',
  'security.login',
  'security.authorization'

  ]);