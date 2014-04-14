'strict'

require('angular')
require('./header/header.js')
require('./footer/footer.js')
require('./main/main.js')

angular.module('app', [ 'ngRoute',
    'app.header',
    'app.footer',
    'app.main'])

angular.config(require('./routes'));