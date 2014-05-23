var SportsCommonModel = (function() {

	var instance;
    var login = null;

    return {
        isLoggedIn : function() {
            return login != null;
        },


        addLogin : function(loginObj) {
            var username = loginObj.hasOwnProperty("username") ? loginObj.username : loginObj.name;
            login = new Login(loginObj.accountId, username, loginObj.password, loginObj.sessionToken,
                loginObj.accountBalance.value, loginObj.accountBalance.currency);

            $.publish(this, 'apiLogin', login);
            return login;
        },

        removeLogin : function() {
            login = null;
            $.publish(this, 'logout');
        },

        getLogin: function() {
            return login;
        },

        getSessionToken : function() {
            return login.sessionToken;
        },

        getAccountId : function() {
            return login.accountId;
        },

        getUsername : function() {
            return login.username;
        },

        getAccountBalance : function() {
            return login.accountBalance;
        },

        setAccountBalance : function( amount ) {
            login.accountBalance = amount;
        }
    }

})();