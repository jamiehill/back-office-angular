'strict';


module.exports = function($stateProvider) {
//    $stateProvider.state('authenticate', {
//        template: require('./login/login.tpl.html'),
//        controller: function ($scope, apiService) {
//
//            console.log("LoginCtrl");
//
//            $scope.user = {};
//            $scope.authError = null;
//            $scope.authReason = null;
//
//            /**
//             *
//             */
//            $scope.login = function() {
//
//                var request = apiService.login(user.username, user.password, "back-office");
//                request.then(loginSuccess, loginFailure);
//
//            }
//
//            /**
//             * @param response
//             */
//            function loginSuccess(response) {
//                console.log("LoginSuccess :"+response);
//            }
//
//            /**
//             * @param response
//             */
//            function loginFailure(response) {
//                console.log("LoginFailed :"+response);
//            }
//
//        }
//    })

    $stateProvider.state('authenticated', {
        template: require('./main/main.tpl.html'),

        controller: function ($scope, apiService) {

            console.log("MainCtrl");

            $scope.rootNodes = null;
            $scope.selectedSports = [];

            $scope.selectSportOptions = {
                placeholder: "Select sports",
                dataTextField: "name",
                dataValueField: "id",
                autoBind: false
            };


            $scope.gridColumns = [
                { field: "id", title: "Node Id" },
                { field: "name", title: "Sport" },
                { field: "path", title: "Path" },
                { field: "type", title: "Type" },
                { field: "hasChildren", title: "Children" }
            ];

            $scope.mainGridOptions = {
                sortable: true,
                pageable: true,
                columns: [
                    { field: "id", title: "Node Id" },
                    { field: "name", title: "Sport" },
                    { field: "path", title: "Path" },
                    { field: "type", title: "Type" },
                    { field: "hasChildren", title: "Children" }
                ]
            };

            apiService.getSportsRootNodes().then(function (response) {
                $scope.rootNodes = response.data.Result.nodes;
            });

        }
    })
};