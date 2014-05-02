'strict';


require('angular');
require('angular-route');
require('angular-bootstrap');

require('../common/security/index.js');


angular.module('app', [ 

	"ngRoute", 'ui.bootstrap',

	// Ats module dependencies
	'security',

    // Dependencies
    require('./header/header.js').name,
    require('./footer/footer.js').name,
    require('./main/main.js').name])

    // Config
    .config(require('./routes'))

    .controller('AppCtrl', ['$scope', function ($scope) {
       
    }]);
