var fs = require('fs');
module.exports = function($routeProvider) {
    $routeProvider.otherwise('/'), {
        controller: require('./main/main.js'),
        template: require('./main/main.tpl.html')
    }
};