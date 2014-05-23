 require([
	 'jquery',
	 'ats/backoffice/BackofficeBootstrap'
 ], 
 function($, BackofficeBootstrap) {
	
		$(function() 
	    {
			var bootstrap = new BackofficeBootstrap();
     		bootstrap.init(true);
	    });
		
});