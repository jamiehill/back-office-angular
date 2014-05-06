'strict';

angular.module('app.main', [])

    // Main view
    .directive('mainView', function() {
        return {
            restrict: 'E',
            template: require('./main.tpl.html'),
            controller: 'MainCtrl'
        };
    })

    /*

     {
     "id" : 168769,
     "name" : "Federation Cup",
     "path" : "166661:166666:168230:168769",
     "type" : "NON_TRADING",
     "hasChildren" : true
     }

     */

    // Main controller
    .controller('MainCtrl', ['$scope', 'apiService', function ($scope, apiService) {

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

    }])
