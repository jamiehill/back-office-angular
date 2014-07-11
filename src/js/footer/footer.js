'strict';

module.exports = angular.module('app.footer', [])

    // Main footer view
    .directive('footerView', function() {
        return {
            restrict: 'E',
            template: require('./footer.tpl.html'),
            controller: 'FooterCtrl'
        };
    })

    // Main footer controller
    .controller('FooterCtrl', ['$scope', function ($scope) {
        
    }]);