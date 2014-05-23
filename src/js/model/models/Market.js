var Instrument = require('./Instrument'),
    LinkedMarket = require('./LinkedMarket');


module.exports = Backbone.Model.extend({

    Instruments: null,
    LinkedMarkets: null,

    defaults: {
        bir: "true",
        detail: "full",
        displayOrder: "0",
        doubleResulting: "false",
        eachwayPlaces: "0",
        id: '',
        maxTotalScore: "0",
        name: '',
        published: 'true',
        resultConfirmed: 'false',
        resultingStatus: 'NOT_SET',
        settled: 'false',
        state: 'OPEN',
        sysRef: '',
        type: '',
        visible: 'true'
    }


},{

    /**
     * @param data
     * @returns {Market}
     */
    parse : function(data){
        var scope = this;
        scope.data = data;
        scope.market = new Market();
        scope.options = scope.market.defaults;
        _.each(data, function(val, key){
            if (_.has(scope.options, key))
                scope.options[key] = val;
        });

        if (_.has(data, 'Instruments'))
            scope.market.Instruments = Market.parseInstruments(data.Instruments);
        if (_.has(data, 'LinkedMarkets'))
            scope.market.LinkedMarkets = Market.parseLinkedMarket(data.LinkedMarkets);

        return scope.market;
    },


    /**
     *
     */
    parseInstruments: function(instrs){
        var instruments = _.map(instrs, function(i){
            return Instrument.parse(i);
        });
        return new (Backbone.Collection.extend({model: Instrument, comparator:'position'}))(instruments)
    },


    /**
     *
     */
    parseLinkedMarket: function(mkts){
        var markets = _.map(mkts, function(m){
            return LinkedMarket.parse(m);
        });
        return new (Backbone.Collection.extend({model: LinkedMarket}))(markets)
    }

});