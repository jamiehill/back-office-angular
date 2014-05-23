var EventView = require('./EventView');
var sportsTpl = require('./SportsView.tpl.html');
var BaseToolbar = require('../sports/BaseToolbar');


/**
 * Base view class for all sports
 */
module.exports = Backbone.View.extend({

    tagName: 'li',
    id: function(){ return this.collection.cid; },
    views: {},
    events: {
        'dblclick' : 'toggleAll'
    },


    /**
     * The SportView listens to changes to it's model, re-rendering.
     */
    initialize: function(){
        this.listenTo(this.collection, "add", this.addEvent);
        this.listenTo(this.collection, "remove", this.removeEvent);
        this.listenTo(this.collection, "destroy", this.remove);
        this.sport = this.collection.sport;
        this.init();
    },


    /**
     * Renders the top level accordion container
     * @returns {MarketDetailsView}
     */
    init: function(){
        $(this.el).append(
            _.template(sportsTpl, {sport:this.sport}));

        this.$stack = $(this.el).find('.sportstack-sport');
        this.addAll(this.collection.models);
        this.initToolbar();
    },


    /**
     * @returns {*|el|w.el}
     */
    initToolbar: function(){
        var header = $(this.el).find('.item-header');

        this.$toolbar = new BaseToolbar({el: header, sport:this.sport});
        this.listenTo(this.$toolbar, 'toggleButtonClick', this.toggle);

        this.toolBarRegion = new Marionette.Region({el:header});
        this.toolBarRegion.show(this.$toolbar);
    },


    /**
     * Adds an Event instance to this sport view
     * @param event
     */
    addEvent: function(event) {
        if (_.has(this.views, event.id)) return;
        var view = this.getView(event),
            element = view.render().el;
        this.$stack.append(element);
    },


    /**
     * Adds all provided Event instances to this view
     * @param event
     */
    addAll: function(evts) {
        _.each(evts, this.addEvent, this);
    },


    /**
     * Removes an Event instance from this sport view
     * @param event
     */
    removeEvent: function(event) {
        this.getView(event).remove();
        delete this.views[event.id];
    },


    /**
     * Removes all Event instances from this view.
     * Not quite sure why you'd want to do this and keep the view!
     * @param event
     */
    removeAll: function(event) {
        _.each(evts, this.removeEvent, this);
    },


    /**
     * Returns the SportView associated with the specified sport.  If not yet
     * instantiated, creates a new SportView and adds to the collection
     * @param sport
     * @returns {*}
     */
    getView: function (event) {
        if (_.isUndefined(this.views[event.id]))
            this.views[event.id] = new EventView({model:event});
        return this.views[event.id];
    },


    /**
     * Toggle the collapsed/expanded state of this item
     */
    toggle: function(e){
        if (e) e.stopImmediatePropagation();
        this.toggleElement('.item-header');
        this.toggleElement('.item-content');
    },


    /**
     * Toggle all child views
     */
    toggleAll: function(e){
        if (e) e.stopImmediatePropagation();
        _.each(this.views, function(view){
            view.toggle(e);
        });
    },


    /**
     * @param element
     */
    toggleElement: function(element){
        var $el = $(this.el).find(element);
        $el.toggleClass('expanded');
        $el.trigger('expandedChange');
    }


});