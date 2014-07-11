'strict';


var apiService      = require('./api-service'),
    sessionService  = require('./session-service'),
    socketService   = require('./socket-service');


angular.module('ats.services', [

    'ats.services.api-service',
    'ats.services.session-service',
    'ats.services.socket-service'

]);