var uid = require('../../../../../common/util/UIDUtil');
var uid = require('../../../../../common/util/StringUtil');

/**
 * Base view class for all sports
 *
 * @param sport The sport name for this toolbar
 */
module.exports = Marionette.View.extend({

    toolBar: null,
    bindings: [],


    /**
     * @param options
     */
    initialize: function(options) {
        this.sport = options.sport;
    },


    /**
     * Renders the base toolbar
     */
    onShow: function(){
        var scope = this;

        this.toolBar = $(this.el).w2toolbar({
            name: uid.getUid(),
            items: this.items(scope),
            style: "padding: 4px 0px 4px 2px",
            onClick: function(e){
                scope.trigger(e.target+'Click');
            }
        });

        this.addBinding($(this.el), 'expandedChange', this.toggle);
        return this;
    },


    /**
     * Override backbones remove method to augment
     * it with removal of our custom bindings
     * @returns {BaseEventToolbar}
     */
    remove: function() {
        this.$el.remove();
        this.stopListening();
        _.each(this.bindings, function(b){
            b.element.unbind(b.event);
        });
        this.bindings = [];
        return this;
    },


    /**
     * @param element
     * @param event
     * @param callback
     */
    addBinding: function(element, event, callback){
        this.bindings.push({element:element, event:event});
        element.bind(event, {scope:this}, callback);
    },


    /**
     * Toggles the expanded/collapsed button
     * @param expanded
     */
    toggle: function(e){
        var scope = e.data.scope,
            expanded = $(scope.el).hasClass('expanded'),
            item = scope.toolBar.get('toggleButton');

        item.icon = (expanded) ? "fa fa-minus-square fa-fw" : "fa fa-plus-square fa-fw";
        scope.toolBar.render();
    },


    /**
     * Items settings for tool bar
     */
    items: function(scope){
        return [
            {type: 'button',  id: 'toggleButton', icon: 'fa fa-minus-square-o fa-fw'},
            {type: 'break'},
            {type: 'html', id: 'eventName', html: '<h3> '+scope.sport+'</h3>'},
            {type: 'spacer'},
            {type: 'html',  id: 'filter',
                html: "<div style='padding: 3px 10px;'>Event Filter:	<input size='10' style='padding: 3px; border-radius: 2px; border: 1px solid silver'/></div>"
            }
        ];
    }


});