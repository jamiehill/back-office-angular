module.exports = Backbone.View.extend({
    

    initialize: function(options)
    {
    	this.render();
    },
    
    addEventListeners: function( scope )
    {    		
    	$.subscribe('openLogin', this, this.openLogin);
    	$.subscribe('apiLogin', this, this.updateLoginDetails);
    	$.subscribe('apiLoginFailure', this, this.loginFailed);
    	$.subscribe('doLogout', this, this.logout);//starts logout
    	$.subscribe('logout', this, this.onLoggedout);//after logout action
    	
    	$.subscribe('addSplash', this, this.onAddSplash);
    	$.subscribe('removeSplash', this, this.onRemoveSplash);	
    },
    
    openLogin: function()
    {
    	appUtil.openPopup('Login', '210px', '500px');
    },
        
    onAddSplash: function()
    {
    	w2ui['layout'].lock('main', 'Loading...', true);
    },
    
    onRemoveSplash: function()
    {
    	w2ui['layout'].unlock('main');
    },
	
	updateLoginDetails: function( event )
	{
		w2ui['LoginForm'].unlock();
		w2ui['LoginForm'].refresh();

		$().w2popup('close');
		
    	var login = event.data;
    	//w2ui['applicationButtonToolbar'].get('user').caption = login.username;
    	//w2ui['applicationButtonToolbar'].refresh();
	},
	
	loginFailed: function(event)
	{
		w2ui['LoginForm'].unlock();
		w2ui['LoginForm'].error(event.data.value);
	},
	
	onLoggedout: function( event )
	{
	},
   

   logout: function()
   {
	   this.model.logout();
   },
    
    
    initComponents: function( scope )
    {
    	
    	$().w2form({
			name: 'LoginForm',
			style: 'border: 0px; background-color: transparent;',
			formURL  : 'assets/popups/LoginForm.html', 
			fields: [
				{ name: 'username', type: 'text', required: true },
				{ name: 'password', type: 'password', required: true },
			],
			    	
			actions: {
				"save": function () { 
					var errors = this.validate();
					if (errors.length !== 0) {
						return;
					}
					this.lock('Logging In...');
					scope.model.login(this.record.username, this.record.password);
					this.clear();
				},
				"reset": function () { this.clear(); }
			}
		});
    	    	
    },
    
	render: function()
	{
		this.initComponents( this );
		this.addEventListeners( this );
		return this;
	}
    
});