var BaseEventToolbar = require('../BaseEventToolbar');


module.exports = BaseEventToolbar.extend({


    /**
     * Renders the base toolbar
     */
    onShow: function(){
        BaseEventToolbar.prototype.onShow.call(this, arguments);
        this.initControls();
    },


    /**
     *
     */
    initControls: function(){
        var scope = this,
            eventName = this.model.get('name'),
            eventTime = this.getTime();
        this.toolBar = $(this.el).w2toolbar({
            name: uid.getUid(),
            items: this.items(scope, eventName, eventTime),
            style: "padding: 4px 0px 4px 2px",
            onClick: function(e){
                scope.trigger(e.target+'Click');
            }
        });
    }


});
