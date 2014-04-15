'strict'

module.exports = angular.module('app.main', [])

    // Main view
    .directive('mainView', function() {
        return {
            restrict: 'E',
            template: require('./main.tpl.html'),
            controller: 'MainCtrl'
        };
    })

    // Main controller
    .controller('MainCtrl', ['$scope', function ($scope) {

    }]);