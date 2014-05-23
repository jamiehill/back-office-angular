var ApiServer = (function() {

	// Instance stores a reference to the Singleton
	var instance;

	function init() {
		
		var requestedAPIDictionary = new Array();
		
		var apiUrl = 'http://sportsbook-dev.amelco.co.uk/sb-backoffice/v1/api/';
		//var apiUrl = 'http://sportsbook-dev.amelco.co.uk/sportsbook/v1/api/';
		//var apiUrl = 'http://192.168.13.83:8081/sportsbook/v1/api/';
		
		var LoginModel              = Backbone.Model.extend({ url: apiUrl + 'login' });
		var KeepAliveModel          = Backbone.Model.extend({ url: apiUrl + 'keepAlive' });

		var EventDetailsModel = Backbone.Model.extend({ url: apiUrl + 'getEvent', showSplash : true });
		var EventFullDetailsModel = Backbone.Model.extend({ url: apiUrl + 'getFullEventDetails',showSplash : true });
		
		var GetSportsRootNodesModel      = Backbone.Model.extend({ url: apiUrl + 'sportsRootNodes' });
		var GetSportsNodeModel           = Backbone.Model.extend({ url: apiUrl + 'sportsNode' });
		var EventSearchModel             = Backbone.Model.extend({ url: apiUrl + 'eventSearch', showSplash : true });
		var EventSearchByCriteriaModel   = Backbone.Model.extend({ url: apiUrl + 'eventSearchByCriteria', showSplash : true });
		var GetSportMarketsModel         = Backbone.Model.extend({ url: apiUrl + 'sportMarkets' });
		var MarketSearchModel            = Backbone.Model.extend({ url: apiUrl + 'marketSearch', showSplash : true });
		
		var CountPuntersModel = Backbone.Model.extend({ url: apiUrl + 'countPunters', showSplash : true });
		var SearchPuntersModel = Backbone.Model.extend({ url: apiUrl + 'searchPunters', showSplash : true });
		
		var CountBetsModel = Backbone.Model.extend({ url: apiUrl + 'countBets', showSplash : true });
		var SearchBetsModel = Backbone.Model.extend({ url: apiUrl + 'searchBets', showSplash : true });
		var GetBetModel = Backbone.Model.extend({ url: apiUrl + 'getBet', showSplash : true });
		var GetChildBetsModel = Backbone.Model.extend({ url: apiUrl + 'getChildBets', showSplash : true });
		
		var BetAmendmentModel = Backbone.Model.extend({ url: apiUrl + 'amendBets', showSplash : true });
		
		var requestServer = function(model, scope, callback, data) 
		{	
			if ( model.showSplash )
			{
				requestedAPIDictionary.push(model.url);
			}
			model.on('change', function(){apiReturned(callback,scope, model);}, scope);
			model.fetch(data);
		};

		var requestServerWithJsonHeader = function(model, scope, callback, data) 
		{	
			if ( model.showSplash )
			{
				requestedAPIDictionary.push(model.url);
			}
			model.on('change', function(){apiReturned(callback,scope, model);}, scope);
			model.fetch({
				   type: "GET",  
				   data: data.data,
				   headers: {'Accept' : 'text/x-json'}
			 });
		};
		
		
		var postServer = function(model, scope, callback, data) 
		{	
			if ( model.showSplash )
			{
				requestedAPIDictionary.push(model.url);
				addSplash();
			}
			model.on('change', function(){apiReturned(callback,scope, model);}, scope);
			data.type = "POST";
			model.fetch(data);
		};
		
		var apiReturned = function(callback, scope, model)
		{
			callback.call(scope, model);
			if ( model.showSplash == true )
			{
				requestedAPIDictionary.pop(model.url);
				if ( requestedAPIDictionary.length == 0 )
				{
					removeSplash();	
				}
			}
		};
		
		var addSplash = function()
		{
			$.trigger(this, 'addSplash');
			console.log('ADDED '+requestedAPIDictionary.length);
		};
		
		var removeSplash = function()
		{
			$.trigger(this, 'removeSplash');
			console.log('REMOVED '+requestedAPIDictionary.length);
		};
		
		
		var login = function(scope, callback, username, password, application ) {
			var data = { data: $.param({application:application, username:username, password:password}) };
			postServer(new LoginModel(), scope, callback, data);
		};
		
		var keepAlive = function(scope, callback, sessionToken) {
			var data = { data: $.param({sessionToken:sessionToken}) };
			requestServer(new KeepAliveModel(), scope, callback, data);
		};
		
		//This API is depricated by the getFullEventDetails
		var getEvent = function(scope, callback, eventId, channelId, locale) {
			var data = { data: $.param({eventId:eventId, channelId:channelId, locale:locale}) };
			requestServer(new EventDetailsModel(), scope, callback, data);
		};
		
		var getFullEventDetails = function(scope, callback, eventId, sessionToken ) {
			var data = { data: $.param({id:eventId, includeDescendants:'true', includeInstruments:'true', includeSettlement:'true', sessionToken:sessionToken}) };
			requestServerWithJsonHeader(new EventFullDetailsModel(), scope, callback, data);
		};
		
		
		var getSportsRootNodes = function(scope, callback) {
			requestServer(new GetSportsRootNodesModel(), scope, callback);
		};
		
		var getSportsNode = function(scope, callback, nodeId) {
			var data = { data: $.param({nodeId:nodeId}) };
			requestServer(new GetSportsNodeModel(), scope, callback, data);
		};
		
		var getSportMarkets = function(scope, callback, sportNodeId) {
			var data = { data: $.param({nodeId:sportNodeId}) };
			requestServer(new GetSportMarketsModel(), scope, callback, data);
		};
		
		var searchEvents = function(scope, callback, pattern, includePastEvents) {
			var data = { data: $.param({pattern:pattern,includePastEvents:includePastEvents}) };
			requestServer(new EventSearchModel(), scope, callback, data);
		};
		
		var searchEventsByCriteria = function(scope, callback, criteria) {
			var data = { data: $.param({criteria:JSON.stringify(criteria)}) };
			requestServer(new EventSearchByCriteriaModel(), scope, callback, data);
		};
		
		var searchMarkets = function(scope, callback, pattern) {
			var data = { data: $.param({pattern:pattern}) };
			requestServer(new MarketSearchModel(), scope, callback, data);
		};

		var countPunters = function(scope, callback, searchPattern, sessionToken) {
			//userName, firstName, lastName, currency, country (code), startDate (epoch), endDate (epoch)
			searchPattern.sessionToken = sessionToken;
			var data = { data: $.param(searchPattern) };
			requestServer(new CountPuntersModel(), scope, callback, data);
		};

		var searchPunters = function(scope, callback, searchPattern, sessionToken) {
			//userName, firstName, lastName, currency, country (code), startDate (epoch), endDate (epoch)
			searchPattern.sessionToken = sessionToken;
			var data = { data: $.param(searchPattern) };
			requestServer(new SearchPuntersModel(), scope, callback, data);
		};

		var countBets = function(scope, callback, searchPattern, sessionToken) {
			//placedTime=long accountId=long channelId=long status=string eventId=long marketId=long instrumentId=long
			searchPattern.sessionToken = sessionToken;
			var data = { data: $.param(searchPattern) };
			requestServer(new CountBetsModel(), scope, callback, data);
		};
		
		var searchBets = function(scope, callback, searchPattern, sessionToken) {
			//placedTime=long accountId=long channelId=long status=string eventId=long marketId=long instrumentId=long
			searchPattern.sessionToken = sessionToken;
			var data = { data: $.param(searchPattern) };
			requestServer(new SearchBetsModel(), scope, callback, data);
		};
		
		//Used to get betDetails for Multiples.
		var getBet = function(scope, callback, accountId, betId, sessionToken) {
			var data = { data: $.param({accountId:accountId,betId:betId,sessionToken:sessionToken}) };
			requestServer(new GetBetModel(), scope, callback, data);
		};

		//Used to get the bets from the masterBetId (systemBet)
		var getChildBets = function(scope, callback, accountId, masterBetId, sessionToken) {
			var data = { data: $.param({accountId:accountId,betId:masterBetId,sessionToken:sessionToken}) };
			requestServer(new GetChildBetsModel(), scope, callback, data);
		};
		
		var amendBets = function(scope, callback, amendmentPattern, sessionToken) {
			//var data = { data: $.param({pageLayout:JSON.stringify(pageLayout)}) };
			var data = { data: $.param({amendment:amendmentPattern,sessionToken:sessionToken})};
			postServer(new BetAmendmentModel(), scope, callback, data);
		};
		
		
		return {
			login : login,
			keepAlive : keepAlive,
			
			getEvent : getEvent,
			getFullEventDetails : getFullEventDetails,
			
			getSportsRootNodes : getSportsRootNodes,
			getSportsNode : getSportsNode,
			searchEvents : searchEvents,
			getSportMarkets : getSportMarkets,
			searchMarkets : searchMarkets,
			
			searchEventsByCriteria : searchEventsByCriteria,
			
			countPunters : countPunters,
			searchPunters : searchPunters,
			
			countBets : countBets,
			searchBets : searchBets,
			getBet : getBet,
			getChildBets : getChildBets,
			
			amendBets  : amendBets
		};

	};

	return {

		getInstance : function() {

			if (!instance) {
				instance = init();
			}

			return instance;
		}

	};

})();