'use strict';


angular.module('ats.services.socket-service', [])

    .factory('socketService', ['$rootScope', '$timeout', 'cfg', function($rootScope, $timeout, cfg) {

        var socket;

        function async (callback) {
            return function(args) {
                args = Array.prototype.slice.call(arguments);
                $timeout(function() {
                    callback.apply(socket, args);
                });
            };
        };

        function addListener (event) {
            event = event && 'on'+event || 'onmessage';
            return function(callback) {
                socket[event] = async(callback);
                return this;
            };
        };


        return {

            states: ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'],

            onmessage: addListener('message'),
            onclose: addListener('close'),
            onopen: addListener('open'),
            onerror: addListener('error'),

            /**
             * Connect the socket
             * @param user
             */
            new: function () {
                socket = new WebSocket(cfg.ws);
                return this;
            },

            /**
             * Disconnect the socket
             */
            close: function () {
                socket.close();
                return this;
            },


            readyState: function () {
                return socket.readyState
            },
            currentState: function () {
                return this.states[socket.readyState];
            },


            /**
             * Send a message across the socket
             * @param message
             */
            send: function (message) {
                message = Array.prototype.slice.call(arguments);
                socket.send.apply(socket, message);
                return this;
            },


            removeListener: function (args) {
                args = Array.prototype.slice.call(arguments);
                socket.removeEventListener.apply(socket, args);
                return this;
            },


            /**
             * when ws.on('someEvent', fn (data) { ... }),
             * call scope.$broadcast('someEvent', data)
             * @param events
             * @param scope
             * @returns {*}
             */
            forward: function (events, scope) {

                if (events instanceof Array === false) {
                    events = [events];
                }

                if (!scope) {
                    scope = $rootScope;
                }

                events.forEach(function (eventName) {
                    var prefixedEvent = 'websocket:' + eventName;
                    var forwardEvent = async(function (data) {
                        scope.$broadcast(prefixedEvent, data);
                    });
                    scope.$on('$destroy', function () {
                        socket.removeEventListener(eventName, forwardEvent);
                    });
                    socket.onmessage(eventName, forwardEvent);
                });
                return this;
            }
        };
    }]);
