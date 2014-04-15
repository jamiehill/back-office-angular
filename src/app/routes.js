'strict'

module.exports = function($routeProvider) {
    $routeProvider

    // Send everything to main
    .when('/', {
        controller: require('./main/main.js'),
        template: require('./main/main.tpl.html')
    })

    .otherwise('/')
}