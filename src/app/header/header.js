'strict'

var angular = require('angular');

angular.module('app.header', [])

    // Main header view
    .directive('headerView', function() {
        return {
            restrict: 'E',
            templateUrl: require('./header.tpl.html'),
            controller: 'HeaderCtrl'
        };
    })

    // Main header controller
    .controller('HeaderCtrl', ['$scope', '$location', 'security', function ($scope, $location, security) {

        $scope.location = $location;

        $scope.isAuthenticated = security.isAuthenticated;
        $scope.isAdmin = security.isAdmin;

        $scope.home = function () {
            var path = security.isAuthenticated() ?
                '/dashboard' : 'projects'
            $location.path(path);
        };
    }]);