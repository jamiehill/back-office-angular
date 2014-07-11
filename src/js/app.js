'strict';


require('../common/services/all');
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
    'app.footer',])

    .constant('cfg', {
        appname: 'Back Office',
        endpoint: 'http://sportsbook-dev.amelco.co.uk/sb-backoffice/v1/api/',
        ws: 'ws://sportsbook-dev.amelco.co.uk:9998/websocket'
    })

    .controller('AppCtrl', ['$rootScope', 'cfg', , function ($rootScope, cfg) {
        $scope.appname = cfg.appname;
        $scope.endpoint = cfg.endpoint;
        $scope.ws = cfg.ws;
    }])


    .config(require('./config/http'))
    .config(require('./config/routes'));



