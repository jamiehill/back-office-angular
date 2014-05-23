module.exports = Backbone.View.extend({


    /**
     * @param options
     */
    initialize: function(options) {
        $.subscribe('apiLogin', this, this.onApiLogin);
        this.initScreen();
    },


    onApiLogin: function(event)
    {
        w2ui['applicationButtonToolbar'].get('loginModal').hidden = true;
        w2ui['applicationButtonToolbar'].get('searchPunters').hidden = false;
        w2ui['applicationButtonToolbar'].refresh();
    },


    /**
     *
     */
    initScreen: function() {
        var scope = this;

        $().w2layout({
            name: 'layout',
            padding: 0,
            panels: [

                { type: 'left', size: 350, content: '<div id="searchTabs" style="width: 100%;"></div> <div id="selectedSearchTab" style="width:100%; height:95%"></div>'},
                { type: 'main', content: ''},
                { type: 'top', size : '30px', content: ''},
            ],

        });


        $().w2toolbar({
            name: 'applicationButtonToolbar',
            items: [
                { type: 'button',  id: 'loginModal', caption: 'Login',    hint: 'Login' },
                { type: 'button',  id: 'searchPunters', caption: 'Search Punters', hint: 'Search Punters',hidden:true },
            ],

            onClick: function (event) {
                scope.handleToolbarClick(event);
            }

        });


        w2ui['layout'].content('top', w2ui['applicationButtonToolbar']);
        $('#layout').w2render('layout');
    },


    handleToolbarClick: function(event) {
        var toolbar = w2ui['applicationButtonToolbar'];
        var target  = event.target;

        if ( target == 'loginModal' )
        {
            $.trigger(this, 'openLogin');
        }
        else if ( target == 'searchPunters' )
        {
            $.trigger(this, 'openSearchPunters');
        }
        else if ( target == 'user' && subItem == 'Logout' )
        {
            $.trigger(this, 'doLogout');
        }

    }


});