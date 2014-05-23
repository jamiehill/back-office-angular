var StreamingServer = (function() {

	// Instance stores a reference to the Singleton
	var instance;

	function init() {
		
		var streamingUrl = 'ws://sportsbook-dev.amelco.co.uk:9998/websocket';
		var connection = null;
		var pendingMessages = [];
		
		var publicLoginComplete = false;
		var PUBLIC_LOGIN_REQ_ID = 0;
		var PUBLIC_LOGIN_REQ_ID_FOR_DEFERRED_USER = 2;
		var USER_LOGIN_REQ_ID = 3;
		var KEEP_ALIVE_REQ_ID = 1;
		var APPLICATION_REF = 'web-sb-backoffice';
		
		var connect = function() {

			var WS = window.MozWebSocket ? window.MozWebSocket : WebSocket;
			
			if ( WS == null ) {
				console.log('WebSocket is not supported..');
			}
			
			if (!connection) {
				connection = new WS(streamingUrl);
			    
				connection.onopen = function() {
			        console.log('websocket is now open');
			        sendPendingMessages();
				};
			
				connection.onerror = function(event) {
					var userNotificationDTO = new UserNotificationDTO('Problem','There was an Error with the Websocket');
		    		$.trigger(this, 'onError', userNotificationDTO);
				};
				
				connection.onmessage = function (event)  {	
			    	var data = JSON.parse(event.data);
			    	
			    	if (data.error) 
			    	{
			    		var userNotificationDTO = new UserNotificationDTO('Streaming Error','There was an Error with the Websocket '+data.error);
			    		$.trigger(this, 'onError', userNotificationDTO);
			    	}
			    	else {
			    		var response = data.Response;
			        	if (response) {
			        		var status = response.status;
			        		if (status == 'error' || status == 'Error') {
					    		var userNotificationDTO = new UserNotificationDTO('Error','There is a problem with data from the websocket');
					    		$.trigger(this, 'onError', userNotificationDTO);
			        		}
			        		else {
			        			var reqId = response.reqId;
			        			if (reqId == PUBLIC_LOGIN_REQ_ID 
			        					|| reqId == PUBLIC_LOGIN_REQ_ID_FOR_DEFERRED_USER
			        					|| reqId == USER_LOGIN_REQ_ID) 
			        			{
				        			$.trigger(this, 'wsLogin', {reqId : response.reqId});
			        			}
			        			
			        			if (reqId == PUBLIC_LOGIN_REQ_ID_FOR_DEFERRED_USER) {
			        				loginUserToWebsocket();
			        			}
			        		}
			        	}
			        	
			        	//to perform asynchronously, using setTimeout, probably use a worker
						setTimeout(function() {
							publishStreaminMessage(data);
						}, 0);
			    	}
			    };
			}
			
		};
		
		var sendPendingMessages = function() {
			for (var i in pendingMessages) {
				send(pendingMessages[i]);
			}
			pendingMessages = [];
		};
		
		var send = function(data) {
			try {
				console.log('Sending WS data: '+data);
				connection.send(data);
			} 
			catch(e) {
				console.log('send failed');
				pendingMessages.push(data);
			}
		};
		
		var keepAlive = function() {
			send('{KeepAlive:{reqId:' + KEEP_ALIVE_REQ_ID + '}}');
		};
		
		var loginUserToWebsocket = function() {
			if ( !publicLoginComplete )
			{
				requestPublicLogin(true);
				return;
			}
			
			var loginObj = SportsCommonModel.getInstance().getLogin();			
			var UpgradePublicLoginRequest = {};
			UpgradePublicLoginRequest.userName = loginObj.username;
			UpgradePublicLoginRequest.accountId = loginObj.accountId;
			UpgradePublicLoginRequest.apiSessionToken = loginObj.sessionToken;
			UpgradePublicLoginRequest.reqId = USER_LOGIN_REQ_ID;
			
			var o = {};
			o.UpgradePublicLoginRequest = UpgradePublicLoginRequest;
			send(JSON.stringify(o));
		};
		
		var requestPublicLogin = function(isUserLoginDeferred) {
			var PublicLoginRequest = {};
			PublicLoginRequest.application = APPLICATION_REF;
			PublicLoginRequest.locale = 'en-gb';
			PublicLoginRequest.channel = 'INTERNET';
			if (isUserLoginDeferred) {
				PublicLoginRequest.reqId = PUBLIC_LOGIN_REQ_ID_FOR_DEFERRED_USER;
			} else {
				PublicLoginRequest.reqId = PUBLIC_LOGIN_REQ_ID;
			}
			
			var o = {};
			o.PublicLoginRequest = PublicLoginRequest;
			
			send(JSON.stringify(o));
			publicLoginComplete = true;
		};
		
		var initConnection = function() {
			connect();
		};
		
		var websocketJsonRequest = function(json)
		{
			if ( json )
			{
				send(json);	
			}
		};
		
		var publishStreaminMessage = function(data) 
		{	
			console.log('INCOMING WS DATA '+JSON.stringify(data));	
			//TODO. IMPLEMENT PUBLISH OF MESSAGES TO MODELS USING PubSub.
			if ( data.BetAmendmentResponse )
			{
				console.log('Bet amendment response.');
			}
		};
		
		return {
			initConnection     	  : initConnection,
			keepAlive             : keepAlive,
			requestPublicLogin 	  : requestPublicLogin,
			loginUserToWebsocket  : loginUserToWebsocket,
			websocketJsonRequest : websocketJsonRequest 
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