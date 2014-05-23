module.exports = function (accountId, username, password,sessionToken, accountBalance, accountCurrency) {
	
	this.sessionToken    = sessionToken;
	this.accountId       = accountId;
	this.accountBalance  = accountBalance;
	this.accountCurrency = accountCurrency;
	this.username        = username;
}
