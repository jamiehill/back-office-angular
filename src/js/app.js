'strict';


require('jquery');
require('angular');
require('angular-route');
require('angular-bootstrap');
//require('kendo-ui');
//require('angular-kendo');

// common
require('../common/services/all');

// views
require('./login/login')
require('./header/header')
require('./main/main')
require('./footer/footer')


angular.module('app', [

	"ngRoute",
    'ui.bootstrap',

    'ats.services',

    'app.header',
    'app.main',
    'app.footer'])

    .constant('cfg', {
        endpoint: 'http://sportsbook-dev.amelco.co.uk/sb-backoffice/v1/api/',
        ws: 'ws://sportsbook-dev.amelco.co.uk:9998/websocket',
        appName: 'Back Office'
    })

    .controller('AppCtrl', ['$rootScope', function ($rootScope) {



    }])


    .config(require('./http'))
    .config(require('./routes'));
