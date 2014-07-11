'strict';


angular.module('ats.services.session-service', [])

    .factory('sessionService', ['$http', '$window', '$rootScope', 'cfg', function($http, $window, $rootScope, cfg) {
        return {

            login: function(user, pass) {
                var promise = $http.post('login', {application:cfg.appname, username:user, password:pass})
                    .success(function (data, status, headers, config) {
                        $window.sessionStorage = {token:data.Login.sessionToken, user: data.Login.user};
                        $rootScope.$broadcast('SessionService.Authenticated', data);
                    })
                    .error(function (data, status, headers, config) {
                        $window.sessionStorage = {};
                        $rootScope.$broadcast('SessionService.Authenticated', data);
                    });
                return promise;
            },

            logout: function() {
                $window.sessionStorage = {};
                $rootScope.$broadcast('SessionService.Terminated');
                return $http.post('logout');
            }
        };

    }]);
