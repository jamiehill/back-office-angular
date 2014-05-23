var HeaderView = require('./header/HeaderView');
var MarketDetailsView = require('./main/markets/MarketDetailsView');


module.exports = Marionette.Layout.extend({
    views: {},


    /**
     * Listen to the model for add/remove events
     */
    initialize: function(){
        this.init();
    },


    /**
     * Main initialisation
     */
    init: function() {
        $().w2layout({
            name: 'layout',
            padding: 0,
            panels: [
                { type: 'left', size: 350, content: '<div id="searchTabs" style="width: 100%;"></div> <div id="selectedSearchTab" style="width:100%; height:95%"></div>'},
                { type: 'main', content: ''},
                { type: 'top', size : '30px', content: ''}
            ]
        });
        $('#layout').w2render('layout');


        $().w2toolbar({
            name: 'applicationButtonToolbar',
            items: [
                { type: 'button',  id: 'loginModal', caption: 'Login',    hint: 'Login' },
                { type: 'button',  id: 'searchPunters', caption: 'Search Punters', hint: 'Search Punters',hidden:true },
            ]
//            onClick: function (event) {
//                scope.handleToolbarClick(event);
//            }
        });

        this.layout = $().w2layout({
            name: 'mainLayout',
            padding: 0,
            panels: [
                { type: 'top', content: ''},
                { type: 'main', content: ''}
            ]
        });

        w2ui['mainLayout'].content('top', this.getHeader());
        w2ui['mainLayout'].content('main', this.getMain());
        w2ui['layout'].content('top', w2ui['applicationButtonToolbar']);
        w2ui['layout'].content('main', this.layout);
    },


    /**
     *
     */
    getHeader: function () {
        this.$header = new HeaderView();
        this.showRegion('header', this.$header.$el, this.$header);
        return this.$header;
    },


    /**
     *
     */
    getMain: function () {
        this.$main = this.getView();
        this.showRegion('header', this.$main.$el, this.$main);
        return this.$main;
    },


    /**
     * Returns the correct view for the specified tab
     * @returns {*|MarketDetailsView}
     */
    getView: function(){
        return new MarketDetailsView({collection:this.eventCache});
    },


    /**
     * @param name
     * @param tag
     * @param element
     */
    showRegion: function(name, tag, element){
        var region = this.addRegion(name, tag);
        region.show(element);
    }


});