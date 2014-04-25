(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
'strict';

// require('jquery');
require('angular');
require('angular-route');
//require('kendo-ui-core');
//require('angular-kendo-ui');

angular.module('app', [ "ngRoute",

    // Dependencies
    require('./header/header.js').name,
    require('./footer/footer.js').name,
    require('./main/main.js').name])

    // Config
    .config(require('./routes'));

},{"./footer/footer.js":3,"./header/header.js":5,"./main/main.js":7,"./routes":9,"angular":"osiaBs"}],3:[function(require,module,exports){
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
},{"./footer.tpl.html":4}],4:[function(require,module,exports){
module.exports = '<div>footer</div>';
},{}],5:[function(require,module,exports){
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

//        $scope.location = $location;

//        $scope.isAuthenticated = security.isAuthenticated;
//        $scope.isAdmin = security.isAdmin;
//
//        $scope.home = function () {
//            var path = security.isAuthenticated() ?
//                '/dashboard' : 'projects'
//            $location.path(path);
//        };
    }]);
},{"./header.tpl.html":6}],6:[function(require,module,exports){
module.exports = '<div class="navbar" ng-controller="HeaderCtrl">\n    <div class="navbar-inner">\n        <a class="brand" ng-click="home()">AScrum</a>\n        <ul class="nav">\n            <li ng-class="{active:isNavbarActive(\'projectsinfo\')}"><a href="/projectsinfo">Current Projects</a></li>\n        </ul>\n\n        <ul class="nav" ng-show="isAuthenticated()">\n            <li ng-class="{active:isNavbarActive(\'projects\')}"><a href="/projects">My Projects</a></li>\n            <li class="dropdown" ng-class="{active:isNavbarActive(\'admin\'), open:isAdminOpen}" ng-show="isAdmin()">\n                <a id="adminmenu" role="button" class="dropdown-toggle" ng-click="isAdminOpen=!isAdminOpen">Admin<b class="caret"></b></a>\n                <ul class="dropdown-menu" role="menu" aria-labelledby="adminmenu">\n                    <li><a tabindex="-1" href="/admin/projects" ng-click="isAdminOpen=false">Manage Projects</a></li>\n                    <li><a tabindex="-1" href="/admin/users" ng-click="isAdminOpen=false">Manage Users</a></li>\n                </ul>\n            </li>\n        </ul>\n        <ul class="nav pull-right" ng-show="hasPendingRequests()">\n            <li class="divider-vertical"></li>\n            <li><a href="#"><img src="/img/spinner.gif"/></a></li>\n        </ul>\n        <login-toolbar></login-toolbar>\n    </div>\n</div>';
},{}],7:[function(require,module,exports){
'strict';

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
},{"./main.tpl.html":8}],8:[function(require,module,exports){
module.exports = '<ul kendo-mobile-list-view k-style="\'inset\'" k-type="\'group\'">\n    <li>\n        Photo sources\n        <ul>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/gpeters/3469819385/">Sashimi salad</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/dakiny/5074989825/">Chirashi sushi</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/khawkins04/5473790679/">Seaweed salad</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/joyosity/3298425351/">Edamame</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/lachlanhardy/2469888555/">Miso soup</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/wordridden/2968300636/">Maguro</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/avlxyz/4735224066/">Shake</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/avlxyz/4760494838/">Shiromi</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/peno/436574543/">Tekka maki</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/avlxyz/4734585503/">Hosomaki Mix</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/loozrboy/4137652434/">California rolls</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/quinnanya/3705756211/">Seattle rolls</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/calgaryreviews/5724940779/">Spicy Tuna rolls</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/gpeters/3453507595/">Ebi rolls</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/socialmediarts/5443438197/">Chicken Teriyaki</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/socialgeek/3658810182/">Salmon Teriyaki</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/francescog/2374468280/">Gohan</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/avlxyz/430256138/">Tori Katsu</a></li>\n            <li><a target="_top" data-rel="external" href="http://www.flickr.com/photos/socialmediarts/5593223819/">Yaki Udon</a></li>\n        </ul>\n    </li>\n</ul>';
},{}],9:[function(require,module,exports){
'strict';

module.exports = function($routeProvider) {
    $routeProvider

    // Send everything to main
    .when('/', {
        controller: require('./main/main.js'),
        template: require('./main/main.tpl.html')
    })

    .otherwise('/');
};
},{"./main/main.js":7,"./main/main.tpl.html":8}]},{},[2])