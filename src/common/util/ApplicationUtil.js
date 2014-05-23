var ApplicationUtil = (function() {

	// Instance stores a reference to the Singleton
	var instance;

	function init() {
		
		var openPopup = function(title, height, width) {
			w2popup.open({	
				title	: title,
				body	: '<div id="form" style="width: 100%; height: 100%;"></div>',
				style	: 'padding: 15px 0px 0px 0px',
				width	: width,
				height	: height, 
				showMax : false,
				onOpen	: function (event) {
					event.onComplete = function () {
						$('#w2ui-popup #form').w2render(title+'Form');
					};
				}
			});
		};

		return {
			openPopup : openPopup
		};
	};

	return {

		getInstance : function() {

			if (!instance) {
				instance = init();
			}

			return instance;
		}

	};

})();

var appUtil = ApplicationUtil.getInstance();
