var Event = require('./models/Event');


/**
 * Stores all stack specific event instances, used to
 * generate the accordion sportstack view.
 * @type {*|void}
 */
module.exports = Backbone.Collection.extend({

    model: Event,
    sports: {},
    uid: 0,

    /**
     * On initialization, we want to listen to the event tree for event
     * selection/unselections, and also parse any initially provided events
     * @param events
     */
    initialize: function(evts){
        $.subscribe('boEventSearch_eventSelected', this, this.onEventSelected);
        $.subscribe('boEventSearch_eventUnselected', this, this.onEventUnselected);
        this.addAll(evts);
    },


    /**
     * Adds an event instance to the cache
     * @param event
     */
    addEvent: function(evt) {
        this.getSport(evt.get('sport')).add(evt);
        this.add(evt);
        this.trigger("addEvent", {event:evt});
    },


    /**
     * Adds an array of events
     * @param evts
     */
    addAll: function(evts) {
        _.each(evts, this.addEvent, this);
    },


    /**
     * Removes an event instance from the cache
     * @param event
     */
    removeEvent: function(evt) {
        var sport = evt.get('sport'),
            coll  = this.getSport(sport);

        coll.remove(evt, {});
        this.remove(evt);

        if (!coll.length)
            this.trigger("removeEvent", {event:evt});
    },


    /**
     * Adds an array of events
     * @param evts
     */
    removeAll: function(evts) {
        _.each(evts, this.removeEvent, this);
        this.sports = {};
    },


    /**
     * Returns a stack Collection' or creates a new one if not already present
     * @param evt
     * @returns {*}
     */
    getSport: function(sport) {
        if (_.isUndefined(this.sports[sport]))
            this.sports[sport] = this.factory(sport);
        return this.sports[sport];
    },


    /**
     * Factory method for producing collections
     * @returns {*|void}
     */
    factory: function(sport) {
        return new (Backbone.Collection.extend({
            model: Event,
            sport: sport,
            uid: this.uid ++,
            nameFilter: function (value) {
                return collection.select(function (model) {
                    return model.get('name').contains(value);
                });
            }
        }))();
    },


    // Handlers


    /**
     * An event has been selected in the event tree
     * @param e
     */
    onEventSelected: function(e) {
        this.addEvent(Event.parse(e.data));
    },


    /**
     * An event has been unselected in the event tree
     * @param e
     */
    onEventUnselected: function(e) {
        var event = this.get(e.data.id);
        if (event)  this.removeEvent(event);
    }


});