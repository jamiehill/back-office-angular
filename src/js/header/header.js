'strict';

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

        $scope.projectName = "Back Office";

        // controller
        $scope.window = {
            open: function() {
            $scope.modal.center().open();
        }
    };
//        };
}]);