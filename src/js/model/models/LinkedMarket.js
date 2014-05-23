module.exports = Backbone.Model.extend({

    defaults: {
    }

},{

    /**
     * @param data
     * @returns {Market}
     */
    parse : function(data){
        var scope = this;
        scope.data = data;
        scope.lm = new LinkedMarket();
        scope.options = scope.lm.defaults;
        _.each(data, function(val, key){
            if (_.has(scope.options, key))
                scope.options[key] = val;
        });
        return scope.lm;
    }

});