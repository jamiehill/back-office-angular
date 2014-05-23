var MainView = require('./views/MainView');


// Creates a new Marionette application
var App = Marionette.Application();

// Set up basic paths
App.root = 'assets/javascripts/';

// Adds any methods to be run after the app was initialized.
App.addInitializer(function () {
    App.show(new MainView());
});

App.start();