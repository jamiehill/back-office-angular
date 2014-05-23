define([
         'backbone','di',
         'ats/backoffice/application/ScreenDM',
         'ats/backoffice/application/ScreenPresenter',
         'ats/backoffice/application/ApplicationDM',
         'ats/backoffice/application/ApplicationPresenter',
         'ats/backoffice/search/SearchPresenter',
         'ats/backoffice/marketResultGrid/MarketResultGridModel',
         'ats/backoffice/marketResultGrid/MarketResultGridPresenter',
         'ats/backoffice/search/SearchPuntersModel',
         'ats/backoffice/search/SearchPuntersPresenter',
         'ats/backoffice/search/SearchBetsModel',
         'ats/backoffice/search/SearchBetsPresenter',

        // market details

        'ats/backoffice/views/header/HeaderView',
        'ats/backoffice/model/models/Event',
        'ats/backoffice/model/EventCache',
        'ats/backoffice/views/MainView',
        'ats/backoffice/views/main/markets/MarketDetailsModel'



],
function(Backbone, blah,
		BackofficeScreenDM,
		BackofficeScreenPresenter,
		ApplicationDM,
        ApplicationPresenter,
		SearchPresenter,
		MarketResultGridModel,
		MarketResultGridPresenter,
		SearchPuntersModel,
		SearchPuntersPresenter,
		SearchBetsModel,
		SearchBetsPresenter,
        HeaderView,
        Event,
        EventCache,
        MainView,
        MarketDetailsModel
		) {
	'use strict';


    /* ======================================================================== */


    // Creates a new Marionette application
    var App = Marionette.Application();

    // Set up basic paths
    App.root = 'assets/javascripts/';

    // Add the main region, that will hold the page layout
    App.addRegions({
        main: '#layout'
    });

    // Adds any methods to be run after the app was initialized.
    App.addInitializer(function () {
        this.initAppLayout();
    });

    // The main initializing function sets up the basic layout and its regions.
    App.initAppLayout = function() {
        var AppLayout = Backbone.Marionette.Layout.extend({
            template: 'layouts/default',
            regions: {
                left: '#left',
                top: '#top',
                main: '#main'
            }
        });

        // Inject the main layout into the #layout region of the page.
        App.regionMain.show(new AppLayout());
    };

    App.start();









//	var BackofficeBootstrap = Backbone.Model.extend({
//		name: "BackofficeBootstrap",
//
//		init: function( autoLayout )
//		{
//            var ctx = di.createContext();
//            ctx.register('eventCache', EventCache);
//            ctx.register('mainView', MainView);
//            ctx.initialize();
//
//			var screenDM = new BackofficeScreenDM();
//			var screenPresenter = new BackofficeScreenPresenter({model : screenDM});
//
//			var applicationDM = new ApplicationDM({cookieName : 'ATS_BO'});
//			var applicationPresenter = new ApplicationPresenter({ model : applicationDM });
//
//			var searchPresenter = new SearchPresenter();
//
////			var resultGridModel = new MarketResultGridModel();
////			var marketResultGridPresenter = new MarketResultGridPresenter({model : resultGridModel});
//
//			var searchPuntersModel = new SearchPuntersModel();
//			var searchPuntersPresenter = new SearchPuntersPresenter({model:searchPuntersModel});
//
//			var searchBetsModel = new SearchBetsModel();
//			var searchBetsPresenter = new SearchBetsPresenter({model:searchBetsModel});
//
//            //////
//
////            var eventCache = new EventCache();
//
////            var main = new MainView();
////            var marketDetailsModel = new MarketDetailsModel();
////            var marketDetailsView = new MarketDetailsView({collection:eventCache});
//		}
//
//	});
//	return BackofficeBootstrap;
});