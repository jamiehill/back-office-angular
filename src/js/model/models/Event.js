var Market = require('./Market');


module.exports = Backbone.Model.extend({

    Markets: null,

    defaults: {
        id: "na",
        name: "na",
        recid: "na",
        sport: "na",
        active: 'false',
        detail: 'full',
        templateId: '',
        level: 0,
        managed: 'true',
        numChildMarkets: 0,
        numChildNodes: 0,
        parentId: '',
        path: '',
        state: '',
        sysRef: '',
        type: 'TRADING'
    },



    /**
     * Update the model with full Event details once loaded
     * @param data
     */
    update: function(data){
        var scope = this;
        scope.data = data;
        _.each(data, function(val, key){
            if (_.has(scope.defaults, key))
                scope.defaults[key] = val;
        });

        if (_.has(data, 'Markets'))
            scope.Markets = Event.parseMarkets(data.Markets);
    }


},{

    /**
     * var event = Event.parse(data);
     *
     * Current schema:
     * {recid : 'n-' + event.id, eventName : event.name, stack : event.sportsCode, event : event}
     *
     * Event Schema:
     * competitionName: "The FA Women's Super League"
     * eventTime: 1401022800000
     * id: 1724232
     * name: "Arsenal Lfc vs Bristol Academy Wfc"
     * path: "166661:166663:167012:427492:1724232"
     * sportsCode: "SOCCER"
     * type: "TRADING"
     *
     * TODO: Incorporate into one Event instance when data initially loaded
     */
    parse : function(data){
        return new Event({
            id: data.id,
            name: data.name,
            eventTime: new Date(data.eventTime),
            recid: "",
            sport: data.sportsCode,
            data: data
        });
    },


    /**
     *
     */
    parseMarkets: function(mkts){
        var markets = _.map(mkts, function(m){
            return Market.parse(m);
        });
        return new (Backbone.Collection.extend({model: Market}))(markets)
    }

});