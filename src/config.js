/**
 * 
 */
'use strict';

requirejs.config({

    deps: ["main"],

	baseUrl: "assets/javascripts/",
	waitSeconds: 20,
	
	paths: {
		jquery       : 'jquery/jquery-1.10.2',
		jqueryPubsub : 'jquery/jquery-pubsub',
		underscore   : 'backbone/underscore-min',
		backbone     : 'backbone/backbone-min',
        marionette   : 'libs/marionette.min',
        w2ui         : 'libs/w2ui-1.3.2',
        text         : 'text',
        di           : 'libs/d-lite',

        application  : 'ats/backoffice/application/ApplicationPackage',
        commons      : 'ats/common/CommonsPackage',
        model        : 'ats/backoffice/model/ModelPackage',
        util         : 'ats/backoffice/utils/UtilPackage'
	},

	shim : {
		
		'w2ui' : {
			deps : [ 'jquery']
		},
		
		'jqueryPubsub' : {
			deps : [ 'jquery']
		},
		
		'underscore' : {
			exports : '_'
		},

		'backbone' : {
			deps : [ 'underscore', 'jquery'],
			exports : 'Backbone'
		},

        'marionette' : {
            deps : ['jquery', 'underscore', 'backbone'],
            exports : 'Marionette'
        },
		
		'application' : {
			deps : [ 'jqueryPubsub']
		},

		'commons' : {
			deps: ['w2ui', 'backbone', 'application','model','util']
		}
		
	}

});

//requirejs([ "assets/javascripts/index.js" ]);
