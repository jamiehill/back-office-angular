module.exports = Backbone.View.extend({
    
    commonModel :SportsCommonModel.getInstance(),
    	
    initialize: function(options)
    {
    	$.subscribe('onOpenBetsPopup', this, this.onOpenBetsPopup);
    	$.subscribe('onCountBetsResult', this, this.onCountBetsResult);
    	$.subscribe('onSearchBetsResult', this, this.onSearchBetsResult);

    	this.initComponents();
    },

    
    onSearchBetsForSelectedFieldAndValue: function(selectedField, selectedValue)
    {
    	this.model.searchBetsFromApi(selectedField,selectedValue);
    },
    
    initComponents: function()
    {
    	var scope = this;
    	
    	$().w2grid({
    		header: '',
        	name: 'betsGrid',
        	
        	show: { 
    			header: true,
    			toolbar: true,
    			selectColumn: false,
    			footer:true
    		},
    		
    		multiSearch: false,
    		
    		toolbar: {
    			items: [
    				{ type: 'break' },
    				{ type: 'button', id: 'backButton', caption: 'Go Back', img: 'icon-page', hidden:true }
    			],
    		},
    		
    		searches: [
    		    { field: 'accountId', caption: 'Account ID' },
    		    { field: 'channelId', caption: 'Channel' },
    		    { field: 'eventId', caption: 'Event ID' },
    		    { field: 'marketId', caption: 'Market ID' },
    		    { field: 'instrumentId', caption: 'Selection ID' },
    		    { field: 'status', caption: 'Status' },
    		],
    		
			columns: [
			          { field: 'recid', hidden:true},
			          { field: 'type', caption: 'Type', size: '80px',resizable:true ,sortable:true},
			          { field: 'id', caption: 'Bet Id', hidden: true},
			          { field: 'user', caption: 'User', size: '100px',resizable:true, sortable:true},//This can be added in the backbone callback.
			          { field: 'marketName', caption: 'Market', size: '100px',resizable:true, sortable:true},
			          { field: 'selectionName', caption: 'Selection', size: '100px',resizable:true, sortable:true},
			          { field: 'decimalOdds', caption: 'Odds', size: '50px',resizable:true ,sortable:true},
			          { field: 'stake', caption: 'Stake', size: '50px',resizable:true ,sortable:true},
			          { field: 'currency', caption: 'Currency', size: '50px',resizable:true ,sortable:true,hidden:true},
			          { field: 'winType', caption: 'Win', size: '50px',resizable:true ,sortable:true},
			          { field: 'formattedBetTime', caption: 'Bet Time', size: '90px',resizable:true ,sortable:true},
			          { field: 'numOfParts', caption: 'Lines', size: '20px',resizable:true ,sortable:true},//This is the number of BetParts (for multiples)
			          { field: 'betStatus', caption: 'Status', size: '80px',resizable:true ,sortable:true},
		        	  { field: 'amend', caption: 'Amend Bet', size: '100px',
							render: function (record) {
								return '<button data-betId="'+record.betId + '" data-action="settle" >Amend bet</button>';
							}
					  }
			],
			
  			onExpand: function (event) {
  				var betId = this.get(event.recid).betId;
  				
  				if (w2ui.hasOwnProperty('subgrid-' + betId)) w2ui['subgrid-' + betId].destroy();
  				$('#'+ event.box_id).css({ margin: '0px', padding: '0px', width: '100%' });
  				
  				var records = scope.getExpandedDataForBet(betId);
  				var expandedGrid = scope.newExpandedGrid(betId,records);
  				
				$('#'+ event.box_id).animate({ height: (expandedGrid.records.length * 30) + 'px' }, 100);
				
				setTimeout(function () {
  					$('#'+ event.box_id).w2render(expandedGrid);
  					w2ui['subgrid-' +betId].resize();
  				}, 300);
  			},
			
			onSearch: function(e) {
				if (e.searchData.length > 0) 
				{
					e.preventDefault();
					this.lock('Searching Bets.');
					var searchField = e.searchField;
					var searchValue = e.searchValue;
					
					scope.onSearchBetsForSelectedFieldAndValue(searchField,searchValue);
		    	}
			},
			
    	});
    	
    },

    getExpandedDataForBet: function(betId)
    {
    	var searchArray = this.model.getSearchBetDTOForExpandedGrid(betId);
    	return searchArray;
    },
   
	newExpandedGrid: function(betId,dataProvider)
	{
		var scope = this;		
		var records = [];
		
		for (var i = 0; i < dataProvider.length; i++) 
		{
			var searchBetDTO = dataProvider[i];
			searchBetDTO.recid = i;
			records.push(searchBetDTO);
		}
		
		$().w2grid({ 
        	header: '',
        	name: 'subgrid-' + betId,
        	
        	show: { 
    			columnHeaders: false
    		},
    		
    		records: records,
        	
    		columns: [
			          { field: 'recid', hidden:true},
			          { field: 'type', caption: 'Type', size: '80px',resizable:true ,sortable:true},
			          { field: 'id', caption: 'Bet Id', hidden: true},
			          { field: 'user', caption: 'User', size: '100px',resizable:true, sortable:true},//This can be added in the backbone callback.
			          { field: 'marketName', caption: 'Market', size: '100px',resizable:true, sortable:true},
			          { field: 'selectionName', caption: 'Selection', size: '100px',resizable:true, sortable:true},
			          { field: 'decimalOdds', caption: 'Odds', size: '50px',resizable:true ,sortable:true},
			          { field: 'stake', caption: 'Stake', size: '50px',resizable:true ,sortable:true},
			          { field: 'currency', caption: 'Currency', size: '50px',resizable:true ,sortable:true,hidden:true},
			          { field: 'winType', caption: 'Win', size: '50px',resizable:true ,sortable:true},
			          { field: 'formattedBetTime', caption: 'Bet Time', size: '90px',resizable:true ,sortable:true},
			          { field: 'numOfParts', caption: 'Lines', size: '20px',resizable:true ,sortable:true},//This is the number of BetParts (for multiples)
			          { field: 'betStatus', caption: 'Status', size: '80px',resizable:true ,sortable:true},
		        	  { field: 'amend', caption: 'Amend Bet', size: '100px'}
			],
			                
        });
		
		return w2ui['subgrid-' + betId];
	},
    
    
    onSearchBetsResult:function(event)
    {
    	var records = event.data;
    	for (var i = 0; i < records.length; i++) {
    		records[i].recid = i + 1; 
    		if (records[i].type == 'SINGLE') {
    			records[i].expanded = 'none';
    		}
    	}
    	w2ui['betsGrid'].unlock();
    	w2ui['betsGrid'].records = records;
    	w2ui['betsGrid'].refresh();
    },
    
	onCountBetsResult: function(event)
	{
		var countBetData = event.data;
		var betCount = countBetData.betCount;
		w2ui['betsGrid'].total = betCount;
		w2ui['betsGrid'].refresh();
	},
	
	
	getBetDetailsById: function(accountId,betId)
	{
		this.model.getBetDetailsById(accountId,betId);
	},
	
	searchBetsForMarket: function(marketId)
	{
		this.model.searchBetsFromApi('marketId',marketId);
	},
	
	searchBetsForSelection: function(selectionId)
	{
		this.model.searchBetsFromApi('instrumentId',selectionId);
	},
	
	countBetsForMarket: function(marketId)
	{
		this.model.searchCountBetsFromApi('marketId',marketId);
	},
	
	countBetsForSelection: function(selectionId)
	{
		this.model.searchCountBetsFromApi('instrumentId',selectionId);
	},
	
	
    onOpenBetsPopup: function(event)
    {
    	if ( !this.commonModel.isLoggedIn() )
    	{
			$.trigger(this, 'openLogin');
			return;
    	}
    	
    	var showBetObj = event.data;
    	var header = showBetObj.header;
    	var isMarket = showBetObj.isMarket;
    	var id = showBetObj.id;
    	
    	if ( isMarket )
    	{
    		this.searchBetsForMarket(id);
    	}
    	else
    	{
    		this.searchBetsForSelection(id);
    	}
    	
		w2popup.open({
			title 	: 'View Bets',
			width	: 1000,
			height	: 600,
			body 	: '<div id="main" style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px;"></div>',
			onOpen  : function (event) {
				event.onComplete = function () {
					w2ui['betsGrid'].header = header;
					$('#w2ui-popup #main').w2render('betsGrid');
				};
			}
		});
    }
    
	
});