module.exports = Backbone.View.extend({
    
    punterGridInView:true,	
    	
    initialize: function(options)
    {
    	$.subscribe('openSearchPunters', this, this.onOpenSearchPuntersPopup);
    	$.subscribe('onSearchPuntersResult', this, this.onSearchPuntersResult);
    	$.subscribe('onCountPuntersResult', this, this.onCountPuntersResult);

    	this.initComponents();
    },
    
    initComponents: function()
    {
    	var scope = this;
    	//The Below columns can be added from PunterDTO.
    	
    	$().w2grid({
        	name: 'puntersGrid',
        		
        	show: { 
    			header: false,
    			toolbar: true,
    			selectColumn: false,
    			footer:true
    		},
    		
    		multiSearch: false,
    		
    		searches: [
    		    { field: 'userName', caption: 'Username' },
    		    { field: 'firstName', caption: 'First name' },
    		    { field: 'lastName', caption: 'Last name' },
    		    { field: 'country', caption: 'Country code' },
    		    { field: 'currency', caption: 'Currency code' }
    		],
			columns: [
				{ field: 'balance', caption: 'Balance',size: '50px'},
			    { field: 'id', caption: 'UserId',size: '80px'},
			    { field: 'firstName', caption: 'First name',size: '100px'},
			    { field: 'lastName', caption: 'Last name',size: '120px'},
			    { field: 'countryCode', caption: 'Country',size: '50px'},
			    { field: 'currency', caption: 'Currency',size: '80px'},
			    { field: 'dateOfBirth', caption: 'DOB',size: '100px'},
			    { field: 'priceAdjustment', caption: 'Price Adjust',size: '100px'},
	        	{ field: '', caption: 'Show Bets', size: '150px',
					render: function (record) {
						return '<button data-id="'+record.id + '" data-action="showPunterBets" >Show Bets</button>';
					}
			  },
			],
						
			onSearch: function(e) {
				if (e.searchData.length > 0) 
				{
					e.preventDefault();
					this.lock('Searching punters.');
					var searchField = e.searchField;
					var searchValue = e.searchValue;
					
					scope.onSearchPuntersByFieldAndValue(searchField,searchValue);
		    	}
			},
			
			
			onRefresh: function (target, data) {
                data.onComplete = function () {
                	$('button[data-id]').unbind('click').click(function() {
                		var action = $(this).attr('data-action');
                		switch (action) 
                		{
        					case 'showPunterBets':
        						scope.showBetsForPunter($(this).attr('data-id'));
        						break;	
        				}
                		
                	});
                };
    		},
			
			
			
    	});
    },
    
    switchToPuntersGrid: function()
    {
    	$('#w2ui-popup #punterMain').w2render('puntersGrid');
    },
    
    switchToBetGrid: function()
    {
    	$('#w2ui-popup #punterMain').w2render('betsGrid');
    },
    
    switchGrid: function()
    {  
    	if ( this.punterGridInView )
    	{
    		this.switchToBetGrid();
    		this.showBackButton();
    	}
    	else
    	{
    		this.switchToPuntersGrid();
    		this.hideBackButton();
    	}
	
    	this.punterGridInView = !this.punterGridInView;
    	//w2utils.transition($('#puntersGrid')[0], $('#betsGrid')[0], 'slide-left');
    },
    
    addToolbarListeners: function()
    {    
    	//FIXME EXTEND W2UTILS.EVENT TO INCLUDE SCOPE.
    	w2ui['betsGrid'].on('toolbar',this.onBackButtonClick);
    	
    	var handlersArray = w2ui['betsGrid'].handlers;
    	for (var i = 0; i < handlersArray.length; i++) 
    	{
			var eventObj = handlersArray[i];
			if ( eventObj.event.type == 'toolbar' )
			{
				eventObj.event.scope = this;	
			}
		}
    },
        
    removeToolbarListeners: function()
    {
    	w2ui['betsGrid'].off('toolbar',this.onBackButtonClick);
    },
    
    hideBackButton: function()
    {
    	var grid = w2ui['betsGrid'];
    	var toolbar = grid.toolbar;
    	toolbar.hide('backButton');
    	this.removeToolbarListeners();
    },
    
    showBackButton: function()
    {
    	var grid = w2ui['betsGrid'];
    	var toolbar = grid.toolbar;
    	toolbar.show('backButton');
    	this.addToolbarListeners();
    },
    
    onBackButtonClick: function(target,eventData) 
    {
    	if ( target == "backButton" )
    	{
    		if ( eventData.hasOwnProperty('scope') )
    		{
    			var scope = eventData.scope;
    			scope.switchGrid();	
    		}
    	}
    },
    
    showBetsForPunter: function(accountId)
    {
    	this.switchGrid();
    	$.trigger(this,'onSearchBetsForAccountId',accountId);
    },
    
    onCountPuntersResult: function(event)
    {
    	var puntersCount = event.data;
    },
    
    onSearchPuntersResult: function(event)
    {
    	var records = event.data;
    		
    	w2ui['puntersGrid'].unlock();
    	w2ui['puntersGrid'].records = records;
    	w2ui['puntersGrid'].refresh();
    },
    
    
    onSearchPuntersByFieldAndValue: function(searchField, searchValue)
    {
    	console.log('Search for Punters '+searchField,searchValue);
    	this.model.getSearchPuntersFromApi(searchField,searchValue);
    },
    
    onOpenSearchPuntersPopup: function(event)
    {
    	var scope = this;
    	
		w2popup.open({
			title 	: 'Search Punters',
			name	: 'puntersPopup',
			width	: 900,
			height	: 600,
			body 	: '<div id="punterMain" style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px;"></div>',
			
			onOpen  : function (event) {
				event.onComplete = function () {
					$('#w2ui-popup #punterMain').w2render('puntersGrid');
					scope.punterGridInView = true;
				};
			},
			
		});
    },


    
	
  });