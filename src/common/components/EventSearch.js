var EventSearch = function(name) {

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
		    { field: 'eventName', caption: 'Event Name' }
		],
		
		toolbar: {
			items: [
				{ type: 'break' },
				{ type: 'html',  id: 'pastCheck',
					html: '<div style="padding: 3px 10px;">'+
						  '<input type="checkbox" name="pastCheckBox" id="pastEventCheckBox">All</input>'+
						  '</div>' 
				},
			],
		},
		
		columns: [				
			//{ field: 'eventId', caption: 'Event Id', hidden: true },
			{ field: 'eventName', caption: 'Event Name', size: '70%', sortable: true },
			//{ field: 'date', caption: 'Event Time', size: '30%', hidden: true, sortable: true },
			{ field: 'sport', caption: 'Sport', size: '30%', sortable: true }
		],
		
		onSearch: function(e) {
			if (e.searchData.length > 0) {
				
				//$('[type="checkbox"]')
				var pastEventsSelected = $('#pastEventCheckBox').is(':checked');
				
				this.clear();
				this.lock('Searching...');
				var pattern = e.searchData[0].value;//eventName value
				$this.apiServer.searchEvents($this, $this.onSearchResults, pattern, pastEventsSelected);
	    	}
		},
		
		onSelect: function(e) {
			var event = this.get(e.recid).event;
			$.trigger(this, $this.componentName + '_eventSelected', event);
		},

        onUnselect: function(e) {
            var event = this.get(e.recid).event;
            $.trigger(this, $this.componentName + '_eventUnselected', event);
        }
	});
	

};

EventSearch.prototype = {
	
	apiServer : ApiServer.getInstance(),
		
    onSearchResults: function(searchEventModel)
	{
    	//console.log(searchEventModel.attributes.Result);
    	w2ui[this.componentName].unlock();
    	
    	var resultEvents = searchEventModel.attributes.Result.nodes;
    	var events = [];
    	
    	for (var i in resultEvents) {
			var event = resultEvents[i];

			events.push({recid : 'n-' + event.id, eventName : event.name, 
				sport : event.sportsCode, event : event});
		}
    	
    	w2ui[this.componentName].add(events);
	},
};
