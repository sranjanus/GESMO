var windowMode =  GESMO.MaxMode;
var ui, leapController, dataController, player, leapController, gestureController;

var queue = [];
var loadedData = [];
var searchQueries = [];

window.onload = function(){
	ui = new GESMO.GesmoUI(document.getElementById('container'));
	dataController = new GESMO.DataController();
	player = new GESMO.GesmoPlayer([]);
	// leapController = new Leap.Controller({ enableGestures: true })
	// 	.use('transform', {
	// 		position: new THREE.Vector3(0, -200, -400),
	// 		effectiveParent: ui.camera
	// 	})
	// 	.use('riggedHand', {
	// 		parent: ui.scene,
	// 		renderer: ui.renderer,
	// 		camera: ui.camera,
	// 		materialOptions: {
	// 	      wireframe: true,
	// 	      color: new THREE.Color(0xcccccc)
	// 	    },
	// 		renderFn: function(){
	// 			gestureController.update();
	// 			ui.animate();
	// 		}
	// 	}).connect();


	//gestureController = new GESMO.GestureController(leapController, ui);

	window.addEventListener('gesmo.ui.fetchlibrary', function(event){
		switch(event.detail.query.type){
			case "queue" : {
					sendQueueToUI();
					searchQueries.push(event.detail.query);
				break;
			}

			case "back" : {
					searchQueries.pop();
					dataController.fetchData(searchQueries[searchQueries.length - 1], dataFetched, dataFetchFailed);
				break;
			}

			default: {
				dataController.fetchData(event.detail.query, dataFetched, dataFetchFailed);
				searchQueries.push(event.detail.query);
			}
		}
		
	}.bind(this));

	window.addEventListener('gesmo.ui.addtoqueue', function(event){
		addToQueue(event.detail.type, event.detail.id);
	}.bind(this));

	window.addEventListener('gesmo.ui.setupcomplete', function(){
		var query = {
			type: "artists",
			filterName: null,
			filterValue: null
		};
		searchQueries.push(query);
		dataController.fetchData(query, dataFetched, dataFetchFailed);
	}.bind(this));

	window.addEventListener('resize', function(event){
		ui.onWindowResize();
	}.bind(this), false);

	document.addEventListener('mousedown', function(event){
		ui.onMouseDown(event);
	}.bind(this), false);

	document.addEventListener('mouseup', function(event) {
		ui.onMouseUp(event);
	}.bind(this), false);

	document.addEventListener('mousemove', function(event) {
		ui.onMouseMove(event);
	}.bind(this), false);

	document.addEventListener('click', function(event) {
		ui.onClick(event);
	}.bind(this), false);

	window.addEventListener('gesmo.actions.play', function(event){
		player.play();
	}.bind(this));

	window.addEventListener('gesmo.actions.pause', function(event){
		player.pause();
	}.bind(this));

	window.addEventListener('gesmo.actions.prev', function(event){
		player.skip("prev");
	}.bind(this));

	window.addEventListener('gesmo.actions.next', function(event){
		player.skip("next");
	}.bind(this));

	window.addEventListener('gesmo.player.newsong', function(event){
		ui.onSongChange(event.detail.index);
	});

	loop();
};

function loop(){
	requestAnimationFrame(loop);
	ui.animate();
}

function dataFetched(type, data){
	var dataList = [];
	loadedData.length = 0;
	data.forEach(function(item){
		dataList.push({
			name: item.name,
			id: item.id
		});
		loadedData.push(item);
	}.bind(this));
	ui.showLibrary(type, dataList);
}

function dataFetchFailed(error){
	console.log(error);
}

function addToQueue(type, id){
	if(type == "songs"){
		var songObj = findObjectByKey(loadedData, "id", id);
		if(songObj != null) { this.player.playlist.push(songObj); 
			if(this.player.checkState() == GESMO.PLAYLISTEMPTY){
				this.player.play(0);
			}
		}
		else { console.log("Error: Could not find song with id = " + id + " to add to the queue");}
	}
}

function findObjectByKey(arr, key, value){
	for(var i = 0;i < arr.length;i++){
		if(arr[i][key] == value){
			return arr[i];
		}
	}
	return null;
}

function sendQueueToUI(){
	var dataList = [];
	this.player.playlist.forEach(function(qItem){
		dataList.push({
			name: qItem.name,
			id: qItem.id
		});
	}.bind(this));
	ui.showLibrary("queue", dataList);
}