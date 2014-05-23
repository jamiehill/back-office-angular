var MarketTree = function(name) {

	var $this = this;
	this.componentName = name;
	
	$().w2sidebar({ 
		name: $this.componentName,
		nodes: [],
			
		onClick : function(e) {
			/*if (e.object.type == 'TRADING') {
				console.log('event reached, populate form');
			}
			else if (e.object.nodes.length == 0) {
				$this.apiServer.getSportsNode($this, $this.onGetSportsNode, e.object.id.replace('n-', ''));
			}*/
		},
	});
	
	this.apiServer.getSportsRootNodes(this, this.onGetSportsRootNodes);
};

MarketTree.prototype = {

	apiServer : ApiServer.getInstance(),
		
	onGetSportsRootNodes: function(getSportsRootNodesModel)
	{
		//console.log(JSON.stringify(getSportsRootNodesModel.attributes));
		
		var resultNodes = getSportsRootNodesModel.attributes.Result.nodes;
		var nodes = [];
		
		for (var i in resultNodes) {
			var n = resultNodes[i];
			nodes.push({id: 'n-' + n.id, text: n.name, img: 'icon-folder', plus: true, nodes : [], nodeType : n.type});
		}
		w2ui[this.componentName].add(nodes);
	},
	
	onGetSportsNode: function(getSportsNode) 
	{
		var error = getSportsNode.attributes.Error;
		if (error) {
			console.log(error);
			return;
		}
		
		var node = getSportsNode.attributes.Result.node;
		//console.log(JSON.stringify(node));
		
		if (node.hasChildren) {
			var children = [];
			
			for (var i in node.children) {
				var n = node.children[i];
				var child = {id: 'n-' + n.id, text: n.name, nodeType : n.type};
				child.img = n.hasChildren ? 'icon-folder' : 'icon-page';
				if (n.hasChildren) {child.nodes = []; child.hasChildren = true;};
				
				children.push(child);
			}
			
			w2ui[this.componentName].insert('n-' + node.id, null, children);
			w2ui[this.componentName].expand('n-' + node.id);
		}
		
	},	
	
};
