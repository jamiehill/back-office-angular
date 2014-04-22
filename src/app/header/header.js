'use strict';

module.exports = angular.module('app.header', [])

    // Main header directive
    .directive('headerView', function() {
        return {
            restrict: 'E',
            template: require('./header.tpl.html'),
            controller: 'HeaderCtrl'
        };
    })

    // Header controller
    .controller('HeaderCtrl', ['$scope', function ($scope) {

//        $scope.location = $location;

//        $scope.isAuthenticated = security.isAuthenticated;
//        $scope.isAdmin = security.isAdmin;
//
//        $scope.home = function () {
//            var path = security.isAuthenticated() ?
//                '/dashboard' : 'projects'
//            $location.path(path);
//        };
    }]);