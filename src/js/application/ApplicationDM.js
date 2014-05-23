module.exports = {

    userLoggedIn:false,
    timerRunning:false,
    keepAliveInterval:10,
    keepAliveApiInterval:20,
    keepAliveApiTimerCount:0,
    keepAliveApiStarted:false,
    eventTimerInterval:1000,
    eventTimerCount:0,

    commonModel :SportsCommonModel.getInstance(),
    apiServer:ApiServer.getInstance(),
    streamingServer:StreamingServer.getInstance(),

    initialize: function(options)
    {
        $.bind('apiLogin', this, this.onApiLogin);
        $.bind('wsLogin', this, this.onWSLogin);
        this.devLogin();
    },

    /**
     *
     */
    devLogin: function(){
        if (util.isDev())
            this.apiServer.login(this, this.onLoginDataChange, 'test1', 'test1','web-sb-backoffice');
    },


    loginUserToWebsocket: function()
    {
        this.streamingServer.loginUserToWebsocket();
        this.sessionValidated();
    },

    requestPublicLogin: function()
    {
        this.streamingServer.requestPublicLogin();
        this.sessionValidated();
    },

    sessionValidated: function()
    {
        this.streamingServer.initConnection();
        $.trigger(this, 'sessionValidationComplete');
    },


    login: function(username, password)
    {
        this.apiServer.login(this, this.onLoginDataChange, username, password,'web-sb-backoffice');
    },

    onLoginDataChange: function(loginModel)
    {
        if (loginModel.attributes.Error) {
            $.publish(this, 'apiLoginFailure', loginModel.attributes.Error);
        } else {
            var loginObj = loginModel.attributes.Login;
            this.commonModel.addLogin(loginObj);
        }

    },

    onApiLogin : function() {
        if (!this.keepAliveApiStarted)
        {
            this.keepAliveApiStarted = true;
            this.keepAliveApiTimerCount = 0;
        }
        this.loginUserToWebsocket();
    },

    onWSLogin : function() {
        this.startTimer();
    },

    logout: function()
    {
        if ( this.commonModel.isLoggedIn )
        {
            this.keepAliveApiStarted = false;
            this.commonModel.removeLogin();
            this.streamingServer.requestPublicLogin();
        }
    },

    keepAliveApi: function()
    {
        this.apiServer.keepAlive(this, this.onKeepAliveResult, this.commonModel.getSessionToken());
        console.log('KEEP ALIVE API');
    },

    onKeepAliveResult: function(keepAliveModel)
    {
        //TODO Check result is valid.
    },


    startTimer: function()
    {
        if ( !this.timerRunning )
        {
            window.setInterval(this.onTimerTick,this.eventTimerInterval,this);
            this.timerRunning = true;
        }
    },

    onTimerTick: function( scope )
    {
        scope.eventTimerCount ++;
        scope.keepAliveApiTimerCount ++;

        if ( scope.eventTimerCount == scope.keepAliveInterval )
        {
            scope.keepAlive();
            scope.eventTimerCount = 0;
        }

        if ( scope.keepAliveApiStarted )
        {
            if ( scope.keepAliveApiTimerCount == scope.keepAliveApiInterval )
            {
                scope.keepAliveApi();
                scope.keepAliveApiTimerCount = 0;
            }
        }

        scope.triggerTimerEvent();
    },

    triggerTimerEvent: function()
    {
        $.publish(this, 'timerEvent');
    },

    keepAlive: function()
    {
        this.streamingServer.keepAlive();
    }

}