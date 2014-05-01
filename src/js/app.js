'strict';

// require('jquery');
require('angular');
require('angular-route');
//require('kendo-ui-core');
//require('angular-kendo-ui');

angular.module('app', [ "ngRoute",

    // Dependencies
    require('./header/header.js').name,
    require('./footer/footer.js').name,
    require('./main/main.js').name])

    // Config
    .config(require('./routes'))

    .controller('AppCtrl', ['$scope', function ($scope) {
       $scope.say = "Hello World!!!!";
    }]);
