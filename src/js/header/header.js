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

    /**
     * 
     */
    // Header controller
    .controller('HeaderCtrl', ['$scope', 'cfg', 'sessionService', 'socketService', function ($scope, cfg, sessionService, socketService) {

        var socket;

        $scope.projectName = cfg.appname;

        $scope.currentUser = {username:'test1', password:'test1'};
        $scope.authError = null;
        $scope.authReason = null;
        $scope.loggedIn = false;

        /**
         *
         */
        $scope.login = function() {
            var user = $scope.currentUser.username,
                pass = $scope.currentUser.password;
            sessionService.login(user, pass);
        }

        /**
         *
         */
        $scope.logout = function() {
            sessionService.logout();
        }

        /**
         * Listen for authentication events
         */
        $scope.$on('SessionService.Authenticated', function(event, data) {
            $scope.loggedIn = true;
            socket = socketService.new();
            socket.onmessage(function(event) {
                console.log('message: ', event.data);
            });
            socket.onclose(function() {
                console.log('connection closed');
            });
            socket.onopen(function() {
                console.log('connection open');
                socket.send('Hello World').send(' again').send(' and again');
            });

        });

        /**
         * Listen for session termination events
         */
        $scope.$on('SessionService.Terminated', function(event, data) {
            $scope.loggedIn = false;
            socketService.close();
        });

    }]);
