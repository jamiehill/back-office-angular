'strict'

angular.module('app.main', [])

    // Main view
    .directive('mainView', function() {
        return {
            restrict: 'E',
            templateUrl: require('./main.tpl.html'),
            controller: 'MainCtrl'
        };
    })

    // Main controller
    .controller('MainCtrl', ['$scope', function ($scope) {

    }]);