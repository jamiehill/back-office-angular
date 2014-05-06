'strict';


angular.module('ats.services.api-service', [])

    .factory('apiService', ['$http', function($http) {
        return {

            login: function(user, pass, app) {
                return $http.post('login', {application:app, username:user, password:pass});
            },

            keepAlive: function(sessionToken) {
                return $http.get('keepAlive', {sessionToken:sessionToken, username:user, password:pass});
            },

            getEvent: function(eventId, channelId, locale) {
                return $http.get('getEvent', {eventId:eventId, channelId:channelId, locale:locale});
            },

            getSportsRootNodes: function() {
                return $http.get('sportsRootNodes');
            },

            getSportsNode: function(nodeId) {
                return $http.get('sportsNode', {nodeId:nodeId});
            },

            getSportMarkets: function(nodeId) {
                return $http.get('sportMarkets', {nodeId:nodeId});
            },

            searchEvents: function(pattern) {
                return $http.get('eventSearch', {pattern:pattern});
            },

            searchEventsByCriteria: function(criteria) {
                return $http.get('eventSearchByCriteria', {criteria:JSON.stringify(criteria)});
            },

            searchMarkets: function(pattern) {
                return $http.get('marketSearch', {pattern:pattern});
            }
        };
    }]);
