var BaseToolbar = require('./BaseToolbar');
var uid = require('../../../../../common/util/UIDUtil');
var time = require('../../../../../common/util/DateTimeUtil');


/**
 * Base view class for all events toolbars in the accordion
 *
 * @param sport The sport name for this toolbar
 */
module.exports = BaseToolbar.extend({


    /**
     * Renders the base toolbar
     */
    onShow: function(){
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

        this.addBinding($(this.el), 'expandedChange', this.toggle);
        return this;
    },


    /**
     * Humanize event time
     * @returns {*}
     */
    getTime: function() {
        var eventTime = this.model.get('eventTime');
        return time.formatTimeFromDate(eventTime);
    },


    /**
     * Items settings for tool bar
     */
    items: function(scope, name, time){
        return [
            {type: 'button',  id: 'toggleButton', icon: 'fa fa-minus-square fa-fw'},
            {type: 'break'},
            {type: 'html', id: 'eventName', html: '<h5> '+name+'</h5>'},
            {type: 'break'},
            {type: 'html', id: 'eventTime', html: "<h5 class='fa fa-clock-o fa-fw'> "+time+"</h5>"},
            {type: 'spacer'},
            {type: 'button',  id: 'columns',  icon: 'fa fa-columns fa-fw'},
            {type: 'break'},
            {type: 'check',  id: 'active', caption: '', icon: 'fa fa-check-circle-o fa-fw', checked: false, hint: 'Is the Event currently Active?' },
            {type: 'check',  id: 'display', caption: '', icon: 'fa fa-eye fa-fw',checked: false, hint: 'Is the Event currently Displayed?' },
            {type: 'check',  id: 'inplay', caption: '', icon: 'fa fa-flag fa-fw',checked: false, hint: 'Is the Event currently Inplay?' },
            {type: 'check',  id: 'willGoInplay', caption: '', icon: 'fa fa-flag-checkered fa-fw',checked: false, hint: 'Can the Event go Inplay?' },
            {type: 'break'},
            { type: 'menu',   id: 'sort', caption: 'Sort', items: [
                { text: 'Time' },
                { text: 'Name' },
                { text: 'Prices' },
                { text: 'Random' }
            ]},
            { type: 'menu',   id: 'channel', caption: 'Channel', items: [
                { text: 'All' },
                { text: 'Internet' },
                { text: 'Mobile' },
                { text: 'Retail' }
            ]}
        ];
    }


});