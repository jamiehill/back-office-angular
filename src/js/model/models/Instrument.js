module.exports = Backbone.Model.extend({

    defaults: {
        displayOrder: "",
        fbResult: "",
        id: '',
        name: '',
        position: '',
        result: '',
        resultConfirmed: 'false',
        settled: 'false',
        sysRef: ''
    }

},{

    /**
     * @param data
     * @returns {Market}
     */
    parse : function(data){
        var scope = this;
        scope.data = data;
        scope.instr = new Instrument();
        scope.options = scope.instr.defaults;
        _.each(data, function(val, key){
            if (_.has(scope.options, key))
                scope.options[key] = val;
        });
        return scope.instr;
    }

});