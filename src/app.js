define([

    // Libraries.
    'jquery',
    'underscore',
    'backbone',
    'marionette',

    // Modules
    ''

], function($, _, Backbone, Marionette) {
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
        App.main.show(new MainView());
    };

    return App;

});