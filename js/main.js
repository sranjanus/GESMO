var windowMode =  GESMO.MaxMode;
var ui, leapController, dataController, player, leapController, gestureController;

var queue = [];
var loadedData = [];
var searchQueries = [];

window.onload = function(){
	ui = new GESMO.GesmoUI();
	dataController = new GESMO.DataController();
	player = new GESMO.GesmoPlayer([]);
	leapController = new Leap.Controller({ enableGestures: true })
		.use('transform', {
			position: new THREE.Vector3(0, -200, -150),
			effectiveParent: ui.camera
		})
		.use('riggedHand', {
			parent: ui.scene,
			renderer: ui.renderer,
			camera: ui.camera,
			materialOptions: {
		      wireframe: false,
		      color: new THREE.Color(0xcccccc)
		    },
		    scale: 0.1,
			renderFn: function(){
				gestureController.update();
				ui.animate();
			}
		}).connect();


	gestureController = new GESMO.GestureController(leapController, ui, player);

	leapController.on('ready', function () {  
		showMessage("Please connect device and perform a grab gesture with both hands to begin.");
	});

	window.addEventListener('gesmo.ui.fetchlibrary', function(event){
		switch(event.detail.query.type){
			case "queue" : {
					sendQueueToUI();
					searchQueries.push(event.detail.query);
				break;
			}

			case "back" : {
					searchQueries.pop();
					console.log(searchQueries);
					if(searchQueries.length == 0){
						ui.createHome();
					} else {
						dataController.fetchData(searchQueries[searchQueries.length - 1], dataFetched, dataFetchFailed);
					}
				break;
			}

			case "home" : {
					searchQueries.length = 0;
					ui.createHome();
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
		ui.createHome();
	}.bind(this));

	window.addEventListener('gesmo.ui.startcomplete', function(){
		gestureController.setStartGesture();
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
	}.bind(this));

	window.addEventListener('gesmo.gesture.startdectected', function(event){
		openGates();
	}.bind(this));

	//loop();

	// setTimeout(function() {
	// 	openGates();
	// }.bind(this), 100);
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
			if(this.player.checkPlaylistState() == GESMO.PLAYLISTEMPTY){
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
	ui.showLibrary("queueitem", dataList);
}

function openGates(){
	var leftCurtainWid = $('#leftCurtain').width() + 5;
	var rightCurtainWid = $('#rightCurtain').width() + 5;
	var messageBrdHt = $('#messageboard').height() + 10;
	$('#leftCurtain').animate({left: '-=' + leftCurtainWid+'px'}, 2000);
	$('#rightCurtain').animate({right: '-=' + rightCurtainWid+'px'}, 2000);
	$('#messageboard').animate({top: '-=' + messageBrdHt + 'px'}, 2000, function(){
		ui.startDescent();
	}.bind(this));
}

function showMessage(msg){
	$('#messageboard').empty();
	$('<p>').append(msg).appendTo($('#messageboard'));
}