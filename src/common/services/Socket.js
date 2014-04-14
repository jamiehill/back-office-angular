'use strict';

angular.module('app.services', []).factory('api', function ($rootScope, $http, $window) {

    var apiBase = 'api'
        , token = ($window.sessionStorage.token || $window.localStorage.token)
        , headers = {Authorization: 'Bearer ' + token}
    //, wsHost = ($window.document.location.origin || ($window.location.protocol + '//' + $window.location.host)).replace(/^http/, 'ws')
        , wsHost = "ws://sportsbook-dev.amelco.co.uk:9998/websocket"
        , api = {events: {}};


    // Initiate the websocket connection
    var ws = api.ws = new WebSocket(wsHost + '?access_token=' + token);
    $window.setInterval(function () {
        ws.send('ping');
    }, 1000 * 25); // keep-alive signal

    // utilize jQuery's callbacks as an event system
    function event() {
        var callbacks = $.Callbacks();
        return {
            subscribe: function ($scope, fn) {
                if (fn) {
                    // unsubscribe from event on controller destruction to prevent memory leaks
                    $scope.$on('$destroy', function () {
                        callbacks.remove(fn);
                    });
                } else {
                    fn = $scope;
                }
                callbacks.add(fn);
            },
            unsubscribe: callbacks.remove,
            publish: callbacks.fire
        };
    }

    // websocket connected disconnected events
    api.connected = event();
    ws.onopen = function () {
        console.log("Opened")
    };

    api.disconnected = event();
    ws.onclose = function () {
        console.log("Closed")
    };

    // api http endpoints and websocket events
    api.posts = {
        list: function () {
            return $http({method: 'GET', url: apiBase + '/posts', headers: headers});
        },
        create: function (post) {
            return $http({method: 'POST', url: apiBase + '/posts', data: post, headers: headers});
        },
        created: event(),
        comments: {
            create: function (postId, comment) {
                return $http({method: 'POST', url: apiBase + '/posts/' + postId + '/comments', data: comment, headers: headers});
            },
            created: event()
        }
    };

    api.debug = {
        flushDatabase: function () {
            return $http({method: 'POST', url: apiBase + '/debug/flushDatabase', headers: headers});
        }
    };

    // websocket data event (which transmits json-rpc payloads)
    function index(obj, i) {
        return obj[i];
    } // convert dot notation string into an actual object index
    ws.onmessage = function (event /* websocket event object */) {
        var data = JSON.parse(event.data /* rpc event object (data) */);
        console.log(data);
    };

    return api;

});