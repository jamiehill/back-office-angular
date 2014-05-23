var apiServer = require('../../../../../common/services/ApiServer');
var commonModel = require('../../../../model/SportsCommonModel');
var streamingServer = require('../../../../../common/services/StreamingServer');


module.exports = Backbone.Model.extend({


    initialize: function(options){
    },

    /**
     * @param id
     * @param isMarket
     */
    showBets : function(id, isMarket) {

        var header = w2ui[this.gridId].header;
        var market = null;
        var selection = null;

        if (isMarket) {
            for (var i = 0; i < this.model.Markets.length; i++)
            {
                var m = this.model.Markets.models[i];
                if (m.id == id) { market = m; break; }
            }
            header = header + ' > ' + market.type;
        } else {
            for (var i = 0; i < this.model.Markets.length; i++)
            {
                var m = this.model.Markets.models[i];
                for (var j = 0; j < m.Instruments.models.length; j++)
                {
                    var s = m.Instruments.models[j];
                    if (s.id == id) {market = m; selection = s; break;}
                }
            }
            header = header + ' > ' + market.type + ' > ' + selection.name;
        }


        var showBetObj = {};
        showBetObj.id = id;
        showBetObj.isMarket = isMarket;
        showBetObj.header = id;

        $.trigger(this,'onOpenBetsPopup',showBetObj);
    },


    setResults: function(){

    },


    unsetResults: function(){

    },


    /**
     * @param marketId
     */
    settleByMarket: function(marketId) {
        var selectionRecords = [];
        if ( w2ui.hasOwnProperty('subgrid-' + marketId) ) {
            selectionRecords = w2ui['subgrid-' + marketId].records;
        }

        console.log('SETTLE '+marketId);
        for (var i = 0; i < selectionRecords.length; i++){
            var dataObj = selectionRecords[i];
            var selectionId = dataObj.selection.id;
            var result = dataObj.changes.result;
            this.amendSelectionResult(selectionId,result);
        }

        this.resettleMarket(marketId);
    },


    viewAudit: function(){

    },


    resettleMarket: function(marketId){
        var BetAmendmentRequest = {};
        var resettleMarketObj = {};
        resettleMarketObj.id = parseInt(marketId);
        BetAmendmentRequest.resettleMarket = resettleMarketObj;

        BetAmendmentRequest.userId = this.commonModel.getAccountId();
        BetAmendmentRequest.requestId = '1';

        var o = {};
        o.BetAmendmentRequest = BetAmendmentRequest;
        var pattern = JSON.stringify(o);
        console.log(pattern);

        this.apiServer.amendBets(this, this.onResettleResult, pattern, this.commonModel.getSessionToken());
    },

    onResettleResult: function( betAmendmentModel ){
        console.log('Resettle market result found');
    },

    amendSelectionResult: function(selectionId,result){
        var resultValue = '';

        switch (result)
        {
            case 'W':
                resultValue = 'WIN';
                break;
            case 'D':
                resultValue = 'DRAW';
                break;
            case 'L':
                resultValue = 'LOSE';
                break;
            case 'V':
                resultValue = 'VOID';
                break;
        }

        var BetAmendmentRequest = {};
        var amendSelectionResultObj = {};
        amendSelectionResultObj.selectionId = parseInt(selectionId);
        amendSelectionResultObj.result = resultValue;//WIN, LOSE, DRAW, VOID
        BetAmendmentRequest.amendSelectionResult = amendSelectionResultObj;
        BetAmendmentRequest.userId = this.commonModel.getAccountId();
        BetAmendmentRequest.requestId = '1';

        var o = {};
        o.BetAmendmentRequest = BetAmendmentRequest;
        var pattern = JSON.stringify(o);
        console.log(pattern);

        this.apiServer.amendBets(this, this.onAmendSelectionResult, pattern, this.commonModel.getSessionToken());
    },

    onAmendSelectionResult: function( betAmendmentModel ){
        console.log('Selection amendment result');
    },

    //Scope EVENT, MARKET, SELECTION
    unsettleByScope: function(scope,id){
        var BetAmendmentRequest = {};
        var unsettleObject = {};
        unsettleObject.id = parseInt(id);
        unsettleObject.scope = scope; //'SELECTION';
        BetAmendmentRequest.unsettle = unsettleObject;
        BetAmendmentRequest.userId = this.commonModel.getAccountId();
        BetAmendmentRequest.requestId = '1';

        var o = {};
        o.BetAmendmentRequest = BetAmendmentRequest;

        var pattern = JSON.stringify(o);
        console.log(pattern);
        this.apiServer.amendBets(this, this.onUnsettleResult, pattern, this.commonModel.getSessionToken());
    },

    onUnsettleResult: function( betAmendmentModel ){
        console.log('Selection amendment result');
    },


    amendBetResult: function(accountId,betId,betPartId,selectionId,result){
        var BetAmendmentRequest = {};
        var amendBetResult = {};
        amendBetResult.accountId = accountId;//Account id who placed the bet
        amendBetResult.betId = betId;
        amendBetResult.partId = betPartId;
        amendBetResult.selectionId = selectionId;
        amendBetResult.result = result;

        BetAmendmentRequest.amendBetResult = amendBetResult;
        BetAmendmentRequest.userId = this.commonModel.getAccountId();
        BetAmendmentRequest.requestId = '1';

        var o = {};
        o.BetAmendmentRequest = BetAmendmentRequest;

        var pattern = JSON.stringify(o);
        console.log(pattern);
        this.apiServer.amendBets(this, this.onAmendBetResult, pattern, this.commonModel.getSessionToken());
    },

    onAmendBetResult: function(amendBetModel){
        console.log('onAmendBetResult');
    },

    amendPayout: function(accountId,betId,payout){
        var BetAmendmentRequest = {};
        var amendPayoutObj = {};
        amendPayoutObj.accountId = accountId;
        amendPayoutObj.betId = betId;
        amendPayoutObj.payout = payout;

        BetAmendmentRequest.amendPayout = amendPayoutObj;
        BetAmendmentRequest.userId = this.commonModel.getAccountId();
        BetAmendmentRequest.requestId = '1';

        var o = {};
        o.BetAmendmentRequest = BetAmendmentRequest;

        var pattern = JSON.stringify(o);
        console.log(pattern);
        this.apiServer.amendBets(this, this.onAmendPayoutResult, pattern, this.commonModel.getSessionToken());
    },

    onAmendPayoutResult: function(amendBetModel){
        console.log('onAmendBetResult');
    }

});