'strict'

angular.module('app.footer', [])

    // Main footer view
    .directive('footerView', function() {
        return {
            restrict: 'E',
            templateUrl: require('./footer.tpl.html'),
            controller: 'HeaderCtrl'
        };
    })

    // Main footer controller
    .controller('FooterCtrl', ['$scope', function ($scope) {

    }]);