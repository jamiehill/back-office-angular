'strict';

module.exports = function($httpProvider, cfg) {

    /**
     * Enable cross domain calls
     */
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    /**
     * Prefixes the service call with the server endpoint
     */
    $httpProvider.interceptors.push(function ($q) {
        return {
            'request': function (config) {
                config.url = (cfg.endpoint + config.url);
                return config || $q.when(config);
            }
        };
    });


    /**
     * Add session token to all Authorization headers
     */
//    $httpProvider.defaults.headers.common.Authorization = {Authorization: 'Bearer ' + $window.sessionStorage.token};


    /**
     * Ensures the correct headers are sent for 'post's
     * @type {{Content-Type: string}}
     */
    $httpProvider.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded'};
    $httpProvider.defaults.transformRequest = function(obj) {
        var str = [];
        for(var p in obj) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
        return str.join('&');
    }
};