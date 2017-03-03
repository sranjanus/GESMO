/*
 * GESMO UI Home View
 * Author: @Shashank
 */

 GESMO.HomeView = function (scene) {
 	this.scene = scene;

 	this.library = new THREE.Object3D();
 	this.scene.add(this.library);

 	this.tiles = [];

 	this.homeMenu = [
		{type: 'newReleases', name: "New Relases"},
		{type: 'topCharts', name: "Top Charts"},
		{type: 'artistsList', name: "Artists" },
		{type: 'musicLibrary', name: "My Music" },
		{type: 'stations', name: "Stations"}
	];

	var t = Math.floor(this.homeMenu.length/2);
	var start, end, incr;
	if(t%2 == 0){
		start = -t*Math.PI/8;
		end = t*Math.PI/8;
		incr = Math.PI/8;
	} else{
		start = -t*Math.PI/6;
		end = t*Math.PI/6;
		incr = Math.PI/6;
	}

	for(var theta = start, i = 0;theta <= end;theta += incr, i++){
		var tile = document.createElement('div');
		tile.className = 'tile';
		tile.style.backgoundColor = 'rgba(0, 127,127,' + ( Math.random()
			* 0.5 + 0.25) + ')';

		var title = document.createElement('div');
		title.className = 'title';
		title.textContent = this.homeMenu[i].name;
		tile.appendChild(title);

		var object = new THREE.CSS3DObject(tile);
		object.position.set(GESMO.LIBRARYRADIUS * Math.cos(theta), 50, 
										GESMO.LIBRARYRADIUS * Math.sin(theta));
		object.lookAt(new THREE.Vector3(0, 0, 0));
		this.tiles.push(object);
		this.library.add(object);
	}
 }