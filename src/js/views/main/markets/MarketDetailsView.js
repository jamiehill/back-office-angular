var SportsView = require('./stack/SportsView');

/**
 * Responsible to generating the accordion view for all loaded
 * sports/events, to display market details datagrid for each
 */
module.exports = Backbone.View.extend({

    id: 'sportstack',
    className: 'sportstack',
    tagName: 'ul',
    views: {},


    /**
     * Listen to the model for add/remove events
     */
    initialize: function(){
        this.listenTo(this.collection, "addEvent", this.addEvent);
        this.listenTo(this.collection, "removeEvent", this.removeEvent);
        this.init();
    },


    /**
     * Main initialisation
     */
    init: function() {
//            $().w2layout({
//                name: 'sportStackLayout',
//                padding: 0,
//                panels: [
//                    { type: 'top', content: ''},
//                    { type: 'main', content: ''}
//                ]
//            });

//            w2ui['sportStackLayout'].content('top', this.el);
//            w2ui['sportStackLayout'].content('main', this.el);
        w2ui['layout'].content('main', this.el);
    },


    /**
     * @param e
     */
    addEvent: function(e) {
        var sport = e.event.get('sport'),
            view  = this.getView(sport);
        $(this.el).append(view.render().el);
        $.publish(this,'elementReady');
    },


    /**
     * @param e
     */
    removeEvent: function(e) {
        var sport = e.event.get('sport');
        this.getView(sport).remove();
        delete this.views[sport];
    },


    /**
     * Returns - or creates if non-existent - the view for the specified sport
     * @param sport
     * @returns {*}
     */
    getView: function (sport) {
        var col = this.collection.getSport(sport);
        if (_.isUndefined(this.views[sport]))
            this.views[sport] = new SportsView({collection:col, name:sport});
        return this.views[sport];
    }


});