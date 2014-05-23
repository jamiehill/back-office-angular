module.exports = Backbone.View.extend({
    	
    initialize: function(options)
    {
		this.initSearchComponents();
    },

    initSearchComponents: function() {
    	
    	var $this = this;
		
		var boEventSearch  = new EventSearch('boEventSearch');
		var boEventTree    = new EventTree('boEventTree');
		//var boMarketSearch = new MarketSearch('boMarketSearch');
		//var boMarketTree   = new MarketTree('boMarketTree');
		
		
		
		$().w2form({
			name: 'boFilterForm',
			style: 'border: 0px; background-color: transparent;',
			formURL  : 'assets/popups/SearchFilterForm.html', 
			fields: [
				{ name: 'eventTime', type: 'select', options : {items: [
				                                                        'Last 31 Days',
				                                                        'Last 7 Days',
				                                                        'Last 3 Days',
				                                                        'Yesterday',
				                                                        'Last 1 Hour',
				                                                        'Last 30 Minutes',
				                                                        'Today',
				                                                        'Tomorrow',
				                                                        'Next 3 Days',
				                                                        'Next 7 Days',
				                                                        'In The Future',
				                                                        'Custom',
				                                                       ] } },
				{ name: 'eventStartDate', type: 'date' },
				{ name: 'eventStartTime', type: 'time' },
				{ name: 'eventEndDate', type: 'date' },
				{ name: 'eventEndTime', type: 'time' },
				{ name: 'eventStatus', type: 'select', options : {items: [{value: 'SETTLED', text: 'Settled'},
				                                                          {value: 'RESULTED', text: 'Resulted'},
				                                                          {value: 'RESULTS_CONFIRMED', text: 'Results Confirmed'},
				                                                          {value: 'NOT_RESULTED', text: 'Not Resulted'},
				                                                          {value: 'EITHER', text: 'Either'},
				                                                          ] } },
				{ name: 'eventInfo', type: 'checkbox' },
			],
			
			onRefresh: function (target, data) {
                data.onComplete = function () {
                	var $eventTime = $('li[name="boFilterForm"] select[name="eventTime"]');
                	
                	$eventTime.on('change', function() {
                		var fromDate = null;
                		var toDate = null;
                		
                		switch(this.value) {
                			case 'Last 31 Days' :    fromDate = null; toDate = null; break;
                			case 'Last 7 Days' :     fromDate = null; toDate = null; break;
                			case 'Last 3 Days' :     fromDate = null; toDate = null; break;
                			case 'Yesterday' :       fromDate = null; toDate = null; break;
                			case 'Last 1 Hour' :     fromDate = null; toDate = null; break;
                			case 'Last 30 Minutes' : fromDate = null; toDate = null; break;
                			case 'Today' :           fromDate = null; toDate = null; break;
                			case 'Tomorrow' :        fromDate = null; toDate = null; break;
                			case 'Next 3 Days' :     fromDate = null; toDate = null; break;
                			case 'Next 7 Days' :     fromDate = null; toDate = null; break;
                			case 'In The Future' :   fromDate = null; toDate = null; break;
                		}
            		});
                };
			}
		});
		
		
		
		
		/*$().w2grid({ 
    		name: 'availableRegionsGrid', 
    		header: 'Available',
    		show: { header: false, columnHeaders:false },
    		columns: [				
    		          { field: 'recid', hidden:true },
    		          { field: 'region', size: '100%', caption: 'Region' },
    		],
    		records: [
    		          {recid : 1, region : 'UK'},
    		          {recid : 2, region : 'IT'},
    		          {recid : 3, region : 'EXPEKT'},
    		          {recid : 4, region : 'EIRE'},
    		          {recid : 5, region : 'DE'},
    		],
    		onClick: function (event) {
    			var grid = this;
    			// need timer for nicer visual effect that record was selected
    			setTimeout(function () {
    				w2ui['selectedRegionsGrid'].add( $.extend({}, grid.get(event.recid), { selected : false }) );
    				grid.selectNone();
    				grid.remove(event.recid);
    			}, 150);
    		}
    	});
    	
    	$().w2grid({ 
    		name: 'selectedRegionsGrid', 
    		header: 'Selected',
    		show: { header: false, columnHeaders:false },
    		columns: [					
    		          { field: 'recid', hidden:true },
    		          { field: 'region', size: '100%', caption: 'Region' },
    		],
    		onClick: function (event) {
    			var grid = this;
    			// need timer for nicer visual effect that record was selected
    			setTimeout(function () {
    				w2ui['availableRegionsGrid'].add( $.extend({}, grid.get(event.recid), { selected : false }) );
    				grid.selectNone();
    				grid.remove(event.recid);
    			}, 150);
    		}
    	});	
    	
    	$().w2layout({
			name: 'selectRegionsGrid',
			padding: 0,
			panels: [
				{ type: 'left', size : '50%', content: w2ui['availableRegionsGrid'] },
				{ type: 'right', size : '50%', content: w2ui['selectedRegionsGrid'] },
			]
		});*/
    	
    	$().w2layout({
			name: 'boAdvancedSearch',
			padding: 0,
			panels: [
				{ type: 'main', content: 
											'<li id="boEventTree" style="height:65%;list-style:none"></li>'+
											//'<li id="boMarketSearch" style="height:200px;list-style:none"></li>'+
											//'<li id="boMarketTree" style="height:200px;list-style:none"></li>'+
											'<li id="boFilterForm" style="height:35%;list-style:none"></li>'
											//'<li id="selectRegionsGrid" style="height:25%;list-style:none"></li>'
													},
				{ type: 'bottom', size : '50px', content: '<div class="w2ui-form-outer" style="text-align:center"><div class="w2ui-buttons"> <input type="button" value="Search" name="save"> </div></div>' },
			]
		});
    	

		$().w2tabs({
			name: 'searchTabs',
			active: 'simple',
			tabs: [
				{ id: 'simple', caption: 'Simple Search' },
				{ id: 'advanced', caption: 'Advanced Search' },
			],
			onClick : function(event) {
				switch (event.target) {
				
				case 'simple':
					$('#selectedSearchTab').w2render('boEventSearch');
					break;
				case 'advanced':
					$('#selectedSearchTab').w2render('boAdvancedSearch');

					$('#boEventTree').w2render('boEventTree');
					$('#boFilterForm').w2render('boFilterForm');
					$('.w2ui-form-outer input[name="save"]').unbind('click').click(function(){$this.doAdvancedSearch();});
					break;
				}
				
			},
			onRender : function(event) {
				this.click('simple');
			}
		});
		
		$('#searchTabs').w2render('searchTabs');
		
	},
	
	doAdvancedSearch: function() {
		
		var criteria = {};
		
		criteria.marketAreas = ['SOCCER']; //soccer
		//next 7 days
		criteria.startTime = new Date().getTime() - (7 * 24 * 60 * 60);
		criteria.endTime   = new Date().getTime() + (14 * 24 * 60 * 60);
		
		//criteria.eventStatus = '';
		//criteria.selectedChannels = [];
		
		ApiServer.getInstance().searchEventsByCriteria(this, this.onAdvancedSearchResults, criteria);
	},
	
	onAdvancedSearchResults: function(eventSearchByCriteriaModel)
	{
		console.log('data found');
		
		var resultDataProvider = [];
		
		var stubbedObject = {};
		stubbedObject.competitionName = "Premier League";
		stubbedObject.eventTime = 1399816800000;
		stubbedObject.id = 1709637;
		stubbedObject.name = "Liverpool FC vs Newcastle United";
		stubbedObject.path = "166661:166663:166988:167010:1709637";
		stubbedObject.sportsCode = "SOCCER";
		stubbedObject.text = "Liverpool FC vs Newcastle United";
		stubbedObject.type = "TRADING";
		
		resultDataProvider.push(stubbedObject);
		
		$.trigger(this, 'onAdvancedSearchDataResults', resultDataProvider);
	}
	
	
  });