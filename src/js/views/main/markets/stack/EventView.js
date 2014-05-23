var eventTpl = require('./EventView.tpl.html');
var BaseView = require('../sports/BaseView');
var FootballView = require('../sports/football/FootballView');
var HorsesView = require('../sports/horses/HorsesView');
var HorsesToolbar = require('../sports/horses/HorsesToolbar');
var BaseEventToolbar = require('../sports/BaseEventToolbar');

/**
 * Base view class for all sports
 */
module.exports = Marionette.Layout.extend({

    tagName: 'li',
    id: function(){ return this.model.id; },
    events: {
        'dblclick' : 'toggle'
    },


    /**
     * Renders the top level accordion container
     * @returns {MarketDetailsView}
     */
    render: function(){
        $(this.el).append(
            _.template(eventTpl, {event:this.model}));

        this.initToolbar();
        this.initGrid();
        return this;
    },


    /**
     * @returns {*|el|w.el}
     */
    initToolbar: function(){
        var view = this.getToolbar(),
            element = $(this.el).find('.item-header2');

        this.$toolbar = new view({el: element, model:this.model});
        this.showRegion('header', '.item-header2', this.$toolbar);

        this.listenTo(this.$toolbar, 'toggleButtonClick', this.toggle);
    },


    /**
     * @returns {*|el|w.el}
     */
    initGrid: function(){
        var view = this.getView(),
            element = $(this.el).find('.item-content');

        this.$datagrid = new view({el:element, model:this.model});
        this.showRegion('content', '.item-content', this.$datagrid);
    },


    /**
     * Returns the view associated with the specified sport.
     * @param sport
     * @returns {*}
     */
    getView: function () {
        var sport = this.model.get('sport').toLowerCase(),
            ViewClass;

        switch(sport) {
            case 'horse_racing':
                ViewClass = HorsesView;
                break;
            default:
                ViewClass = BaseView;
                break;
        }

        return ViewClass;
    },


    /**
     * Returns the view associated with the specified sport.
     * @param sport
     * @returns {*}
     */
    getToolbar: function () {
        var sport = this.model.get('sport').toLowerCase(),
            ToolbarClass;

        switch(sport) {
            case 'horse_racing':
                ToolbarClass = HorsesToolbar;
                break;
            default:
                ToolbarClass = BaseToolbar;
                break;
        }
        return ToolbarClass;
    },


    /**
     * @param name
     * @param tag
     * @param element
     */
    showRegion: function(name, tag, element){
        var region = this.addRegion(name, tag);
        region.show(element);
    },


    /**
     * Toggle the collapsed/expanded state of this item
     */
    toggle: function(e){
        if (e) e.stopImmediatePropagation();
        this.toggleElement($(this.el).find('.item-header'));
        this.toggleElement($(this.el).find('.item-content'));
    },


    /**
     * @param element
     */
    toggleElement: function(element){
        element.toggleClass('expanded');
        element.trigger('expandedChange');
    }


});
