'strict';


angular.module('app.login', []);

//    .config(function($stateProvider) {
//
//        $stateProvider.state('authenticate', {
//            template: require('./login.tpl.html'),
//            controller: function ($scope, apiService) {
//
//                console.log("LoginCtrl");
//
//                $scope.user = {};
//                $scope.authError = null;
//                $scope.authReason = null;
//
//                /**
//                 *
//                 */
//                $scope.login = function() {
//
//                    var request = apiService.login(user.username, user.password, "back-office");
//                    request.then(loginSuccess, loginFailure);
//
//                }
//
//                /**
//                 * @param response
//                 */
//                function loginSuccess(response) {
//                    console.log("LoginSuccess :"+response);
//                }
//
//                /**
//                 * @param response
//                 */
//                function loginFailure(response) {
//                    console.log("LoginFailed :"+response);
//                }
//
//            }
//        })
//    });
