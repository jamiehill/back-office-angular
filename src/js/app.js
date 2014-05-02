'strict';

require('jquery');
require('angular');
require('angular-route');
require('kendo-ui');
require('angular-kendo');

angular.module('app', [ "ngRoute", 'kendo.directives', 

    // Dependencies
    require('./header/header.js').name,
    require('./footer/footer.js').name,
    require('./main/main.js').name])

    // Config
    .config(require('./routes'))

    .controller('AppCtrl', ['$scope', function ($scope) {
       $scope.say = "Hello Lucy!";
    }]);
