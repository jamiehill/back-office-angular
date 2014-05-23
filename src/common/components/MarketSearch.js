var MarketSearch = function(name) {

	var $this = this;
	this.componentName = name;
	
	$().w2grid({ 
		name: $this.componentName, 
		show: { 
			toolbar: true,
			selectColumn: true
		},
		multiSearch: false,
		searches: [
		    { field: 'market', caption: 'Market' }
		],
		columns: [				
			{ field: 'marketCode', caption: 'Code', size: '20%', sortable: true },
			{ field: 'marketName', caption: 'Name', size: '50%', sortable: true },
			{ field: 'sport', caption: 'Sport', size: '30%', sortable: true }
		],
		
		onSearch: function(e) {
			if (e.searchData.length > 0) {
				
				this.clear();
				this.lock('Searching...');
				
				var pattern = e.searchData[0].value;//eventName value
				$this.apiServer.searchMarkets($this, $this.onSearchResults, pattern);
	    	}
		},
		
		onSelect: function(e) {
			var event = this.get(e.recid);
			$.trigger(this, $this.componentName + '_eventSelected', event);
		}
	});
	

};

MarketSearch.prototype = {
	
	apiServer : ApiServer.getInstance(),
		
    onSearchResults: function(searchEventModel)
	{
    	//console.log(searchEventModel.attributes.Result);
    	w2ui[this.componentName].unlock();
    	
    	var resultEvents = searchEventModel.attributes.Result.nodes;
    	var events = [];
    	
    	for (var i in resultEvents) {
			var event = resultEvents[i];

			events.push({recid : 'n-' + event.id, eventId : event.id, eventName : event.name, 
				sport : event.sportsCode, competition : event.competitionName, eventTime : new Date(event.eventTime)});
		}
    	
    	w2ui[this.componentName].add(events);
	},
};
