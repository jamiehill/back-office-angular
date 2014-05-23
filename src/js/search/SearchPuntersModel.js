var apiServer = require('../../common/services/ApiServer');
var commonModel = require('../model/SportsCommonModel');


module.exports = Backbone.Model.extend({


    puntersCount:0,
    puntersDataProvider:[],

    initialize: function(options)
    {
    },

    getCountPuntersFromApi: function(searchField,searchValue)
    {
        var searchPattern = {};
        searchPattern[searchField] = searchValue;
        this.apiServer.countPunters(this, this.onCountPuntersResult,searchPattern,this.commonModel.getSessionToken());
    },

    onCountPuntersResult: function(countPuntersModel)
    {
        if ( countPuntersModel.hasOwnProperty('attributes') )
        {
            this.puntersCount = countPuntersModel.attributes.count;
            $.trigger(this,'onCountPuntersResult',this.puntersCount);
        }
    },

    getSearchPuntersFromApi: function(searchField,searchValue)
    {
        var searchPattern = {};
        searchPattern[searchField] = searchValue;
        this.apiServer.searchPunters(this, this.onSearchPuntersResult,searchPattern,this.commonModel.getSessionToken());
    },

    onSearchPuntersResult: function(searchPuntersModel)
    {
        this.puntersDataProvider = [];
        if ( searchPuntersModel.hasOwnProperty('attributes') )
        {
            if ( searchPuntersModel.attributes.hasOwnProperty('Punters') )
            {
                var puntersArray = searchPuntersModel.attributes.Punters.punters;

                for (var i = 0; i < puntersArray.length; i++)
                {
                    var punter = puntersArray[i];
                    var punterDTO = new PunterDTO();
                    punterDTO.accountStatus = punter.accountStatus;
                    punterDTO.address = punter.address;
                    punterDTO.amountMultiplier = punter.amountMultiplier;
                    punterDTO.balance = punter.balance;
                    punterDTO.betLimit = punter.betLimit;
                    punterDTO.betLimitCurrency = punter.betLimitCurrency;
                    punterDTO.colourCategory = punter.colourCategory;
                    punterDTO.countryCode = punter.countryCode;
                    punterDTO.creationDate = punter.creationDate;
                    punterDTO.currencyCode = punter.currencyCode;
                    punterDTO.dateOfBirth = punter.dateOfBirth;
                    punterDTO.email = punter.email;
                    punterDTO.excludedFromRiskAlert = punter.excludedFromRiskAlert;
                    punterDTO.firstName = punter.firstName;
                    punterDTO.id = punter.id;
                    punterDTO.recid = i + 1;
                    punterDTO.inplayDelayCategory = punter.inplayDelayCategory;
                    punterDTO.inplayStakeCoeff = punter.inplayStakeCoeff;
                    punterDTO.lastIP = punter.lastIP;
                    punterDTO.lastLoginTime = punter.lastLoginTime;
                    punterDTO.lastName = punter.lastName;
                    punterDTO.liveBetLimit = punter.liveBetLimit;
                    punterDTO.minimumStake = punter.minimumStake;
                    punterDTO.name = punter.name;
                    punterDTO.onWatchList = punter.onWatchList;
                    punterDTO.prematchStakeCoeff = punter.prematchStakeCoeff;
                    punterDTO.priceAdjustment = punter.priceAdjustment;
                    punterDTO.ref = punter.ref;

                    this.puntersDataProvider.push(punterDTO);
                }
            }
        }

        $.trigger(this,'onSearchPuntersResult',this.puntersDataProvider);
    }

});