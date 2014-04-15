'strict'

require('angular')
require('angular-route')
require('angular-bootstrap')

angular.module('app', [ 'ngRoute', 'ui.bootstrap',

    // Dependencies
    require('./header/header.js').name,
    require('./footer/footer.js').name,
    require('./main/main.js').name])

    // Config
//    .config(require('./routes'));
