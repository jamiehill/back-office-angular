var time = require('../../common/util/DateTimeUtil')


module.exports = Backbone.Model.extend({
		
    apiServer : ApiServer.getInstance(),
    commonModel :SportsCommonModel.getInstance(),

    betsCount:0,
    betsDataProvider:[],
    searchBetsResult:[],

    initialize: function(options)
    {
        $.subscribe('onSearchBetsForAccountId', this, this.onSearchBetsForAccountId);
    },

    onSearchBetsForAccountId: function(event)
    {
        var accountId = event.data;
        this.searchBetsFromApi('accountId',accountId);
    },

    searchCountBetsFromApi: function(searchField,searchValue)
    {
        var searchPattern = {};
        searchPattern[searchField] = searchValue;
        this.apiServer.countBets(this, this.onCountBetsResult, searchPattern, this.commonModel.getSessionToken());
    },

    onCountBetsResult: function(countBetsModel)
    {
        if ( countBetsModel.hasOwnProperty('attributes') )
        {
            this.betsCount = countBetsModel.attributes.count;
            $.trigger(this,'onCountBetsResult',this.betsCount);
        }
    },

    getChildBetsById: function(accountId,masterBetId)
    {
        this.apiServer.getChildBets(this, this.onGetChildBetsDetailResult, accountId, masterBetId, this.commonModel.getSessionToken());
    },

    onGetChildBetsDetailResult: function(getChildBetsModel)
    {
        //TODO. GOT BET DETAILS FOR MULTIPLE NOW AMEND TO MULTIPLE BET IN THE GRID.
        console.log('got betDetails for child data');
    },

    getBetDetailsById: function(accountId,betId)
    {
        this.apiServer.getBet(this, this.onGetBetDetailResult, accountId, betId, this.commonModel.getSessionToken());
    },

    onGetBetDetailResult: function(getBetModel)
    {
        //TODO. GOT BET DETAILS FOR MULTIPLE NOW AMEND TO MULTIPLE BET IN THE GRID.
        console.log('got betDetails data');
    },

    searchBetsFromApi: function(searchField,searchValue)
    {
        var searchPattern = {};
        searchPattern[searchField] = searchValue;
        this.apiServer.searchBets(this, this.onSearchBetsResult, searchPattern, this.commonModel.getSessionToken());
    },

    getSearchBetDTOForExpandedGrid: function(betId)
    {
        var expandedDataProvider = [];

        for (var i = 0; i < this.searchBetsResult.length; i++)
        {
            var bet = this.searchBetsResult[i];
            if ( bet.id == betId )
            {
                for (var j = 0; j < bet.parts.betPart.length; j++)
                {
                    var part = bet.parts.betPart[j];

                    var searchBetsGridDTO = new SearchBetsGridDTO();
                    searchBetsGridDTO.betId = bet.id;
                    searchBetsGridDTO.betNo = bet.betNo;
                    searchBetsGridDTO.winType = bet.winType;
                    searchBetsGridDTO.betTime = bet.betTime;
                    searchBetsGridDTO.stake = bet.stake.amount;

                    searchBetsGridDTO.selectionName = part.selection.name;
                    searchBetsGridDTO.decimalOdds = part.odds.decimal;
                    searchBetsGridDTO.marketName = part.market.name;

                    expandedDataProvider.push( searchBetsGridDTO );
                }
            }
        }
        return expandedDataProvider;
    },

    addSearchBetsDTO: function(bet)
    {
        var searchBetsDTO = new SearchBetsGridDTO();
        searchBetsDTO.betId = bet.id;
        searchBetsDTO.betNo = bet.betNo;
        searchBetsDTO.type = bet.type;
        searchBetsDTO.winType = bet.winType;
        searchBetsDTO.betTime = bet.betTime;
        searchBetsDTO.stake = bet.stake.amount;
        searchBetsDTO.currency = bet.stake.currency;

        searchBetsDTO.numOfParts = bet.parts.betPart.length;
        searchBetsDTO.selectionName = bet.type == 'SINGLE' ? bet.parts.betPart[0].selection.name : "";
        searchBetsDTO.decimalOdds = bet.type == 'SINGLE' ? bet.parts.betPart[0].odds.decimal : "";
        searchBetsDTO.marketName = bet.type == 'SINGLE' ? bet.parts.betPart[0].market.name : "";

        searchBetsDTO.user = 'Test Account';//Add details from Backbone callback.
        searchBetsDTO.formattedBetTime = time.formatTimeFromDate(new Date(bet.betTime));
        searchBetsDTO.betStatus = bet.betStatus;
        return searchBetsDTO;
    },

    onSearchBetsResult: function(searchBetsModel)
    {
        this.betsDataProvider = [];
        this.searchBetsResult = [];
        if ( searchBetsModel.attributes.hasOwnProperty("Bets") )
        {
            var betResultArray = searchBetsModel.attributes.Bets.bet;
            this.searchBetsResult = betResultArray;
            if ( betResultArray )
            {
                for (var i = 0; i < betResultArray.length; i++)
                {
                    var bet = betResultArray[i];
                    var searchBetsDTO = this.addSearchBetsDTO(bet);
                    searchBetsDTO.recid = i.toString();

                    //TODO. Bring in BetDTO from punter client.
                    this.betsDataProvider.push(searchBetsDTO);
                }
            }
        }
        $.trigger(this,'onSearchBetsResult',this.betsDataProvider);
    }

});
