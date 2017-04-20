/*
 * GESMO 3D UI
 * Author: @Shashank
 */

 GESMO.GesmoUI = function(logger){
 	this.logger = logger;
 	// Create the scene and add fog effect
 	this.scene = new THREE.Scene();
 	//this.scene.fog = new THREE.FogExp2(0xcccccc, 0.001);

 	// Create the camera
 	var aspectratio = GESMO.WIDTH/GESMO.HEIGHT;
 	fieldOfView = 75;
 	nearPlane = 0.1;
 	farPlane = 100000;
 	this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectratio,
 												nearPlane, farPlane);
 	this.camera.position.x = 0;
 	this.camera.position.z = 0;//7500; 
 	this.camera.position.y = 0;//600; 
 	//this.camera.lookAt(new THREE.Vector3(1,0,0));

 	// Create the renderer
 	this.renderer = new THREE.WebGLRenderer( { alpha: 1, antialias: true, clearColor: 0x000000 });
	this.renderer.setPixelRatio( window.devicePixelRatio );
	this.renderer.setSize( window.innerWidth, window.innerHeight );
	this.renderer.sortObjects = false;
	this.renderer.shadowMap.enabled = true;
	this.renderer.domElement.style.position = 'absolute';
	this.renderer.domElement.style.top = 0;
	this.renderer.domElement.style.zIndex = 5;
	document.body.appendChild(this.renderer.domElement);

	this.movableObjects = new THREE.Object3D();
	this.movableObjects.savedPos = new THREE.Vector3(0, 0, 0);
	this.movableObjects.savedZPos = 0;
	this.scene.add(this.movableObjects);

	// Create lights
 	this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
 	this.ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
 	this.shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
 	this.shadowLight.position.set(150, 350, 350);
 	this.shadowLight.castShadow = true;
 	this.shadowLight.shadow.camera.left = -400;
 	this.shadowLight.shadow.camera.right = 400;
 	this.shadowLight.shadow.camera.top = 400;
 	this.shadowLight.shadow.camera.bottom = -400;
 	this.shadowLight.shadow.camera.near = 1;
 	this.shadowLight.shadow.camera.far = 1000;
 	this.shadowLight.shadow.mapSize.width = 4096;
 	this.shadowLight.shadow.mapSize.height = 4096
 	this.movableObjects.add(this.hemisphereLight);
 	this.movableObjects.add(this.shadowLight);
 	this.movableObjects.add(this.ambientLight);

 	//this.spaceDebris = new GESMO.SpaceDebris(this.movableObjects);

	//create the music library and it's elements
	this.musicLibrary = new THREE.Object3D();
	this.movableObjects.add(this.musicLibrary);
	this.btnLibrary = new THREE.Object3D();
	this.scene.add(this.btnLibrary);
	this.sections = [];

	this.libElements = [];
	this.btns = [];
	this.targets = [];
	this.viewMode = GESMO.ARTISTSVIEW;
	this.songviewMode = GESMO.SONGSSEARCHVIEW;
	this.curSongIndex = 0;
	this.curQueueIndex = 0;
	this.curSongHiglighter = null;

 	this.buttons = [];
 	this.isFetchingData = false;
 	this.isRotating = false;
 	this.isTranslating = false;

	this.mousePos = new THREE.Vector2();
	this.clock = new THREE.Clock(); 
	this.raycaster = new THREE.Raycaster();
	this.tsOffset = new THREE.Vector3();

	this.highlighted = null;
	this.rays = [
	      new THREE.Vector3(0, 0, 1),
	      new THREE.Vector3(1, 0, 1),
	      new THREE.Vector3(1, 0, 0),
	      new THREE.Vector3(1, 0, -1),
	      new THREE.Vector3(0, 0, -1),
	      new THREE.Vector3(-1, 0, -1),
	      new THREE.Vector3(-1, 0, 0),
	      new THREE.Vector3(-1, 0, 1)
	    ];

	// direction vector [left right up down left-up right-down right-up left-down]
	this.mainList = [
		{type: GESMO.TOPCHARTSVIEW, name: "Top Charts", image: "topCharts.png", position: new THREE.Vector3(-750, 750, GESMO.VIEWDISTANCE), dVector: "01010100"},
		{type: GESMO.NEWRELEASESVIEW, name: "New Releases", image: "newReleases.png", position: new THREE.Vector3(0, 750, GESMO.VIEWDISTANCE), dVector: "11010101"},
		{type: GESMO.MUSICVIDSVIEW, name: "Music Videos", image: "musicvideos.png", position: new THREE.Vector3(750, 750, GESMO.VIEWDISTANCE), dVector: "10010001"},
		{type: GESMO.PLAYLISTSVIEW, name: "Curated Playlists", image:"playlists.png", position: new THREE.Vector3(-750, 0, GESMO.VIEWDISTANCE), dVector: "01110110"},
		{type: GESMO.HOMEVIEW, name: "Home", image:"home.png", position: new THREE.Vector3(0, 0, GESMO.VIEWDISTANCE), dVector: "11111111"},
		{type: GESMO.FAVORITESVIEW, name: "Favorites", image:"favorites.png", position: new THREE.Vector3(750, 0, GESMO.VIEWDISTANCE), dVector: "10111001"},
		{type: GESMO.ARTISTSVIEW, name: "Artists", image: "artists.png", position: new THREE.Vector3(-750, -750, GESMO.VIEWDISTANCE), dVector: "01100010"},
		{type: GESMO.QUEUEVIEW, name: "Queue", image: "stations.png", position: new THREE.Vector3(0, -750, GESMO.VIEWDISTANCE), dVector: "11101010"},
		{type: GESMO.GENRESVIEW, name: "Genres", image: "genres.png", position: new THREE.Vector3(750, -750, GESMO.VIEWDISTANCE), dVector: "10101000"}
	];

	this.curZPos = 0;
	this.maxZPos = 0;
	this.isPaginated = false;
	this.pStartIndex = 0;
	this.pEndIndex = 0;

	this.appStarted = false;

	this.textureLoader = new THREE.TextureLoader();
	this.textures = {
		albums: [],
		artists: [],
		charts: [],
		genres: [],
		playlists: [],
		songs: []
	};

	var imagePath = "http://localhost/GESMO/images/";
	var albumIName = "album_flat_";
	var artistIName = "artist_flat_";
	var chartIName = "charts_flat_";
	var genreIName = "genre_flat_";
	var playlistIName = "playlist_flat_";
	var songIName = "song_flat_";

	for(var i = 1;i <= 10;i++){
		this.textures.albums.push(this.textureLoader.load(imagePath + albumIName + i + ".png"));
		this.textures.artists.push(this.textureLoader.load(imagePath + artistIName + i + ".png"));
		this.textures.charts.push(this.textureLoader.load(imagePath + chartIName + i + ".png"));
		this.textures.genres.push(this.textureLoader.load(imagePath + genreIName + i + ".png"));
		this.textures.playlists.push(this.textureLoader.load(imagePath + playlistIName + i + ".png"));
		this.textures.songs.push(this.textureLoader.load(imagePath + songIName + i + ".png"));
	}

	var fontLoader = new THREE.FontLoader();
	fontLoader.load("http://localhost/GESMO/fonts/droid/droid_serif_regular.typeface.json", function(font){
		this.titleFont = font;
		//this.logger.log("ui, loaded, http://localhost/GESMO/fonts/droid/droid_serif_regular.typeface.json");
		//this.logger.log("ui, complete, setup");
		var newEvent = new CustomEvent('gesmo.ui.setupcomplete', {
 			'detail': {
 				nosections: this.mainList.length
 			}
 		});
		window.dispatchEvent(newEvent);
	}.bind(this));
	
 };

GESMO.GesmoUI.prototype = {

 	constructor: GESMO.GesmoUI,

 	start: function(){
 		var nameMaterial = new THREE.MeshPhongMaterial({ 
 			color: 0x2194ce,
 			specular: 0x111111,
			shininess: 30,
			shading: THREE.SmoothShading,
			vertexColors: THREE.NoColors,
			transparent: true,
			opacity: 0
 		});
		
		var nameGeometry = new THREE.TextGeometry("Gesmo", {
			size: 40,
			height: 0,
			bevelEnabled: false,
			font: this.titleFont,
			weigth: "normal"
		});

		this.name = new THREE.Mesh(nameGeometry, nameMaterial);
		var box = new THREE.Box3().setFromObject(this.name);

		this.scene.add(this.name);
		this.name.position.z = -200;
		this.name.position.x = -box.getSize().x/2;

		var messageMaterial = new THREE.MeshPhongMaterial({ 
 			color: 0x2194ce,
 			specular: 0x111111,
			shininess: 30,
			shading: THREE.SmoothShading,
			vertexColors: THREE.NoColors,
			transparent: true,
			opacity: 0
 		});
		
		var messageGeometry = new THREE.TextGeometry("Perform a grab gesture with both hands to begin.", {
			size: 5,
			height: 0,
			bevelEnabled: false,
			font: this.titleFont,
			weigth: "normal"
		});

		this.message = new THREE.Mesh(messageGeometry, messageMaterial);
		var box = new THREE.Box3().setFromObject(this.message);

		this.scene.add(this.message);
		this.message.position.z = -200;
		this.message.position.x = -box.getSize().x/2;
		this.message.position.y = -box.getSize().y/2 - 10;

		var tween1 = new TWEEN.Tween(this.name.material)
			.to({opacity: 1}, 500);

		var tween2 = new TWEEN.Tween(this.message.material)
			.onComplete(function () {
				//this.logger.log("ui, complete, start");
				var newEvent = new CustomEvent('gesmo.ui.startcomplete');
				window.dispatchEvent(newEvent);
			}.bind(this))
			.to({opacity: 1}, 200);

		tween1.chain(tween2);
		tween1.start();
 	},

 	hideTitle: function(callback){
 		$(loading).fadeIn();
 		this.createHome(callback);
 		new TWEEN.Tween(this.name.material)
 			.to({opacity: 0}, 100)
 			.onComplete(function(){
 				this.scene.remove(this.name);
 			}.bind(this))
 			.start();

		new TWEEN.Tween(this.message.material)
			.to({opacity: 0}, 100)
			.onComplete(function () {
				this.scene.remove(this.message);
				$(loading).fadeOut();
			}.bind(this))
			.start();
 	},

 	createHome: function(callback){
		this.appStarted = true;
 		var incr = (2*Math.PI)/this.mainList.length;

 		for(var i = 0;i < this.mainList.length; i++){
 			var geom = new THREE.PlaneGeometry(200, 50);
 			var mat = new THREE.MeshPhongMaterial({
 				color: 0x000000,
 				shading: THREE.FlatShading,
 				transparent: true,
 				opacity: 0	
 			});

 			var box = new THREE.Mesh(geom, mat);
 			box.position.z = this.mainList[i].position.z;
			box.position.y = this.mainList[i].position.y + 200;
			box.position.x = this.mainList[i].position.x;

 			box.castShadow = true;
 			box.receiveShadow = true;
 			box.userData.name = this.mainList[i].name;
 			box.userData.type = "back";
 			box.name = "header";
 			this.addLabels(box, 15, true, i, 1);
 			this.addBackToLabels(box, 15, true, i, 1);
 			this.buttons.push(box);
 			this.btnLibrary.add(box);
 			this.btns.push(box);

 			var section = new THREE.Object3D();
 			section.position.z = this.mainList[i].position.z;
			section.position.y = this.mainList[i].position.y;
			section.position.x = this.mainList[i].position.x;

			section.name = this.mainList[i].type;
			this.sections.push(section);
			this.musicLibrary.add(section);

			this.libElements.push([]);
 		}

 		this.viewMode = GESMO.HOMEVIEW;

 		var event = new CustomEvent('gesmo.ui.setusermap');
 		window.dispatchEvent(event);

		//this.logger.log("ui, complete, home");

		if(callback)
			callback.apply();
 	},

 	fetchLibrary: function(searchQuery){
 		this.isFetchingData = true;
 		if(searchQuery.filterName == "playlist_id"){
 			this.sendQuery(searchQuery);
 		} else {
 			this.destroyLibrary(this.sendQuery.bind(this), searchQuery);
 		}
 		
 	},

 	sendQuery: function(query){
 		$(loading).fadeIn();
 		var newEvent = new CustomEvent('gesmo.ui.fetchlibrary', {
 			'detail': {
 				query: query,
 				viewno: this.viewMode
 			}
 		});

 		window.dispatchEvent(newEvent);
 	},

 	destroyLibrary: function(callback, callbackargs){
 		while(this.libElements[this.viewMode].length > 0){
 			var libMesh = this.libElements[this.viewMode].pop();
 			this.sections[this.viewMode].remove(libMesh);
 			delete libMesh;
 		}

 		if(callback != null){
 			var args = [];
 			args.push(callbackargs);
 			callback.apply(this, args);
 		}
 	},

 	showLibrary: function(type, data){
 		var opc = 1;
 		var dOpc = 4;

 		this.maxZPos = Math.ceil(data.length/8) - 1;
 		if(type == "songs"){
 			this.curZPos = 0;
 		} else {
 			this.curZPos = this.movableObjects.savedZPos;
 		}

 		var imgType = (type == "queueitem") ? "songs" : type;
	 	for(var i = 0;i < data.length;i++){
	 		var colorIndex = Math.floor(Math.random()*10);
	 		var itemGeom = new THREE.PlaneGeometry(100, 100);
	 		var texture = this.textures[imgType][colorIndex].clone();
	 		texture.needsUpdate = true;
	 		var itemMat = new THREE.MeshPhongMaterial({
						side: THREE.DoubleSide,
						map: texture,
						transparent: true,
						opacity: 1,
						shading: THREE.FlatShading});
	 		var itemMesh = new THREE.Mesh(itemGeom, itemMat);
	 		
	 		itemMesh.scale.x = 0.1;
	 		itemMesh.scale.y = 0.1;
	 		itemMesh.scale.z = 0.1;
	 		itemMesh.userData = data[i];
	 		itemMesh.userData.type = type;
	 		itemMesh.userData.index = i;

			this.addLabels(itemMesh, 10, false, -1, opc);
			//this.addImage(itemMesh, opc);

			this.libElements[this.viewMode].push(itemMesh);
			this.sections[this.viewMode].add(itemMesh);

			if((i+1)%8 == 0){
				opc /= dOpc;
			}
	 	}
 		this.assignTargets(type, null, null);
 		//this.transform(this.targets, 1000, null, null);
 		//this.logger.log("ui, loaded, " + type + " list");
 	},	

 	addLabels: function(mesh, size, isButton, index, opc){
 		var names = mesh.userData.name;
 		var mbox = new THREE.Box3().setFromObject(mesh);
		var bSize = mbox.getSize();
		var bSizey = bSize.y;

		var nameMaterial = new THREE.MeshPhongMaterial({ 
			color: 0xffffff, 
			specular: 0x111111,
			shininess: 30,
			shading: THREE.SmoothShading,
			vertexColors: THREE.NoColor
		});

		if(!isButton){
			nameMaterial.transparent = true;
			nameMaterial.opacity = 1;
		}
		
		var fnameGeometry = new THREE.TextGeometry(names, {
			size: size,
			height: 0,
			bevelEnabled: false,
			font: this.titleFont,
			weigth: "normal"
		});

		var fnameLabel = new THREE.Mesh(fnameGeometry, nameMaterial);
		fnameLabel.name = "flabel";
		mesh.add(fnameLabel);

		var fbox = new THREE.Box3().setFromObject(fnameLabel);
		var fSize = fbox.getSize();
		var fSizex = names.length*size;
		var fSizez = fSize.z;

		fnameLabel.position.x = -fSizex/2;
		fnameLabel.position.y = 0;
		fnameLabel.position.z = 0;

		if(!isButton){
			fnameLabel.position.y = -70;
		}
	},

	addBackToLabels: function(mesh, size, isButton, index, opc){
 		var names = "Click here to go back to " + mesh.userData.name;
 		var mbox = new THREE.Box3().setFromObject(mesh);
		var bSize = mbox.getSize();
		var bSizey = bSize.y;

		var nameMaterial = new THREE.MeshPhongMaterial({ 
			color: 0xffffff, 
			specular: 0x111111,
			shininess: 30,
			shading: THREE.SmoothShading,
			vertexColors: THREE.NoColor
		});

		if(!isButton){
			nameMaterial.transparent = true;
			nameMaterial.opacity = 1;
		}
		
		var fnameGeometry = new THREE.TextGeometry(names, {
			size: size,
			height: 0,
			bevelEnabled: false,
			font: this.titleFont,
			weigth: "normal"
		});

		var fnameLabel = new THREE.Mesh(fnameGeometry, nameMaterial);
		fnameLabel.name = "backToLabel";
		fnameLabel.visible = false;
		mesh.add(fnameLabel);

		var fbox = new THREE.Box3().setFromObject(fnameLabel);
		var fSize = fbox.getSize();
		var fSizex = names.length*size;
		var fSizez = fSize.z;

		fnameLabel.position.x = -fSizex/2;
		fnameLabel.position.y = 0;
		fnameLabel.position.z = 0;

		if(!isButton){
			fnameLabel.position.y = -70;
		}
	},

	addImage: function (mesh, opc) {
		var imagePath = "http://localhost/GESMO/images/";
		if(mesh.userData.image){
			imagePath += mesh.userData.image;
		} else {
			var colorIndex = Math.floor(Math.random()*10) + 1;
			var type = mesh.userData.type;
			if(type == "albums"){
				imagePath += "album_flat_" + colorIndex + ".png";
			} else if(type == "artists"){
				imagePath += "artist_flat_" + colorIndex + ".png";
			} else if(type == "charts"){
				imagePath += "charts_flat_" + colorIndex + ".png";
			}else if(type == "genres"){
				imagePath += "genre_flat_" + colorIndex + ".png";
			} else if(type == "playlists"){
				imagePath += "playlist_flat_" + colorIndex + ".png"; 
			} else {
				imagePath += "song_flat_" + colorIndex + ".png";
			}
		}
		
		
		this.textureLoader.load(
			imagePath,
			function(texture){
				var img = new THREE.MeshPhongMaterial({
					side: THREE.DoubleSide,
					map: texture,
					transparent: true,
					opacity: 1
				});
				img.map.needsUpdate = true;
				var planeHt, planeWd;
				if(mesh.geometry.parameters){
					planeHt = mesh.geometry.parameters.height;
					planeWd = mesh.geometry.parameters.width;
				} else {
					planeHt = 100;
					planeWd = 100;
				}

				var plane = new THREE.Mesh(new THREE.PlaneGeometry(planeWd, planeHt), img);
				plane.overdraw = true;
				plane.name = "image_plane";
				mesh.add(plane);
			}.bind(this),
			function ( xhr ) {
				console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
			},	
			function ( xhr ) {
				console.log( 'An error happened' );
		});
	},

	assignTargets: function(type, start, end){
		this.targets.length = 0;
		if(type == "songs") {
			for ( var i = 0; i < this.libElements[this.viewMode].length; i++ ) {

				var itemGeom = new THREE.PlaneGeometry(1, 1);
				var itemMat = new THREE.MeshNormalMaterial();
				var itemMesh = new THREE.Mesh(itemGeom, itemMat);

				itemMesh.position.x = this.movableObjects.position.x + ( ( i % 4 ) * 160 ) - 250;
				itemMesh.position.y = this.movableObjects.position.y + ( - ( Math.floor( i / 4 ) % 2 ) * 180 ) + 70;
				itemMesh.position.z = -this.movableObjects.position.z - ( Math.floor( i / 8 ) ) * 1000;
				itemMesh.lookAt(new THREE.Vector3(itemMesh.position.x, itemMesh.position.y, itemMesh.position.z));

				this.targets.push( itemMesh );
			}
		} else {
			for ( var i = 0; i < this.libElements[this.viewMode].length; i++ ) {
				var itemGeom = new THREE.PlaneGeometry(1, 1);
				var itemMat = new THREE.MeshNormalMaterial();
				var itemMesh = new THREE.Mesh(itemGeom, itemMat);

				itemMesh.position.x = ( ( i % 4 ) * 160 ) - 250;
				itemMesh.position.y = ( - ( Math.floor( i / 4 ) % 2 ) * 180 ) + 70;
				itemMesh.position.z = -( Math.floor( i / 8 ) ) * 1000;

				itemMesh.lookAt(new THREE.Vector3(itemMesh.position.x, itemMesh.position.y, 0));

				this.targets.push( itemMesh );
			}
		}

		this.transform(this.targets, 1000, null, null);
	},

	transform: function( targets, duration, start, end) {
		var i = 0;
		var l = this.libElements[this.viewMode].length;
		if(start != null){
			i = start;
			l = end; 
		}
		for (; i < l; i++) {
			var object = this.libElements[this.viewMode][ i ];
			var target = (targets.length) ? targets[i] : targets;

			new TWEEN.Tween( object.position )
				.to( { x: target.position.x, y: target.position.y, z: target.position.z }, 1000 )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();

			new TWEEN.Tween( object.rotation )
				.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, 1000 )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();

			new TWEEN.Tween( object.scale )
				.to({x: 1, y: 1, z: 1}, 1000)
				.start();

		}

		new TWEEN.Tween( this )
			.to( {}, 1500 )
			.onUpdate( this.render )
			.onComplete(function(){
	 			$(loading).fadeOut();
	 			this.adjustOpacityOnZ();
				this.isFetchingData = false;
				if(this.viewMode == GESMO.QUEUEVIEW){
					this.highlightCurrentSong();
				}
			}.bind(this))
			.start();


		return this;
	},

 	onWindowResize: function(){
 		this.camera.aspect = window.innerWidth/window.innerHeight;
 		this.camera.updateProjectionMatrix();

 		this.renderer.setSize(window.innerWidth, window.innerHeight);
 	},

 	moveToSection: function(direction, callback){
 		if(!this.isRotating && !this.isTranslating){
 			TWEEN.removeAll();
 			this.isRotating = true;

	 		var goBack = false;
	 		if(this.movableObjects.position.z != 0){
	 			goBack = true;
	 		}

	 		if(this.curSongHiglighter != null){
	 			this.sections[this.viewMode].remove(this.curSongHiglighter);
	 			delete this.curSongHiglighter;
	 			this.curSongHiglighter = null;
	 		}

	 		var tween1;
	 		if(goBack){
	 			tween1 = new TWEEN.Tween(this.movableObjects.position)
	 				.easing( TWEEN.Easing.Exponential.InOut )
	 				.onComplete(function(){
	 					this.movableObjects.savedPos.copy(this.movableObjects.position);
	 				}.bind(this))
	 				.to({ x: 0, y : 0, z: 0}, 100);
	 		}
	 		this.movableObjects.savedZPos = 0;
	 		this.btns[this.viewMode].getObjectByName("backToLabel").visible = false;
			this.btns[this.viewMode].getObjectByName("flabel").visible = true;
	 	
	 		var newView = -1;

	 		var oldView = this.viewMode;
	 		if(direction == "left" && this.mainList[this.viewMode].dVector.substring(0,1) != '0'){
				newView = oldView - 1;
			} else if(direction == "right" && this.mainList[this.viewMode].dVector.substring(1,2) != '0'){
				newView = oldView + 1;
			} else if(direction == "up" && this.mainList[this.viewMode].dVector.substring(2,3) != '0'){
				newView = oldView - 3;
			} else if(direction == "down" && this.mainList[this.viewMode].dVector.substring(3,4) != '0'){
				newView = oldView + 3;
			} else if(direction == "left-up" && this.mainList[this.viewMode].dVector.substring(4,5) != '0'){
				newView = oldView - 4;
			} else if(direction == "right-down" && this.mainList[this.viewMode].dVector.substring(5,6) != '0'){
				newView = oldView + 4;
			} else if(direction == "right-up" && this.mainList[this.viewMode].dVector.substring(6,7) != '0'){
				newView = oldView - 2;
			} else if(direction == "left-down" && this.mainList[this.viewMode].dVector.substring(7,8) != '0'){
				newView = oldView + 2;
			}

			if(newView != -1){
				var current = this.mainList[oldView].position;
				var target = this.mainList[newView].position;
				targetX = -target.x;
				targetY = -target.y;
				var tween2 = new TWEEN.Tween(this.musicLibrary.position)
					 	.to({x: targetX, y: targetY, z: 0}, 700)
					 	.easing( TWEEN.Easing.Exponential.InOut )
					 	.onComplete(function(){
					 		this.destroyLibrary(null, null);
					 		this.viewMode = newView;
					 		this.loadSection();
					 		this.isRotating = false;
					 		var event = new CustomEvent('gesmo.ui.setusermap');
					 		//this.logger.log("ui, movedToSection, from " + oldView + "to " + this.viewMode);
					 		window.dispatchEvent(event);
					 		if(callback != null)
					 			callback();
					 	}.bind(this));

				var tween3 = new TWEEN.Tween(this.btnLibrary.position)
					 	.to({x: targetX, y: targetY, z: 0}, 800)
					 	.easing( TWEEN.Easing.Exponential.InOut);

				if(goBack){
					tween1.chain(tween2);
					tween1.start();
				} else {
					tween2.start();
				}
				tween3.start();
			} else {
				this.isRotating = false;
				if(callback != null)
					callback();
			}
 		} else {
 			if(callback != null)
				callback();
 		}
 	},

 	loadSection: function(){
 		var searchQuery = {
			filterName: null,
			filterValue: null
		};

 		switch(this.mainList[this.viewMode].type){
 			case GESMO.TOPCHARTSVIEW : {
				searchQuery.type = "charts";
				this.sendQuery(searchQuery);
				break;
			}
			case GESMO.NEWRELEASESVIEW: {
				searchQuery.type = "albums";
				searchQuery.filterName = "mostRecent";
				searchQuery.filterValue = 24;
				this.sendQuery(searchQuery);
				break;
			}
			case GESMO.MUSICVIDSVIEW : {
				searchQuery.type = "musicvideos";
				break;
			}
			case GESMO.PLAYLISTSVIEW : {
				searchQuery.type = "playlists";
				this.sendQuery(searchQuery);
				break;
			}
			case GESMO.FAVORITESVIEW : {
				searchQuery.type = "favorites";
				break;
			}
 			case GESMO.ARTISTSVIEW : {
				searchQuery.type = "artists";
				this.sendQuery(searchQuery);
				break;
			}
			case GESMO.QUEUEVIEW : {
				searchQuery.type = "queue";
				this.sendQuery(searchQuery);
				break;
			}
			case GESMO.GENRESVIEW : {
				searchQuery.type = "genres";
				this.sendQuery(searchQuery);
				break;
			}
			case GESMO.HOMEVIEW: {
				searchQuery.type = "recommendations";
				break;
			}
		}
 	},

 	moveInSection: function(direction, callback){
 		if(!this.isTranslating && !this.isRotating){
 			TWEEN.removeAll();
		 		if(direction == "forward"){
		 			if(this.curZPos < this.maxZPos){
		 				this.isTranslating = true;
		 				var target = this.movableObjects.position.z + 1000;

			 			new TWEEN.Tween(this.movableObjects.position)
			 				.to({ z : target}, 500)
			 				.easing( TWEEN.Easing.Exponential.InOut )
			 				.onComplete(function(){
			 					this.movableObjects.savedPos.copy(this.movableObjects.position);
			 					this.isTranslating = false;
			 					this.curZPos++;
			 					this.movableObjects.savedZPos = this.curZPos;
			 					this.adjustOpacityOnZ();
			 					if(callback != null)
			 						callback();
			 					//this.logger.log("ui, movedInSection, " + this.viewMode + " by 1000 z");
			 				}.bind(this))
			 				.start();
		 			} else {
		 				if(callback != null){
		 					callback.apply();
		 				}
		 			}
		 		} else {
		 			if(this.curZPos > 0){
		 				this.isTranslating = true;
		 				var target = this.movableObjects.position.z - 1000;
			 			new TWEEN.Tween(this.movableObjects.position)
			 				.to({ z : target}, 500)
			 				.easing( TWEEN.Easing.Exponential.InOut )
			 				.onComplete(function(){
			 					this.movableObjects.savedPos.copy(this.movableObjects.position);
			 					this.isTranslating = false;
			 					this.curZPos--;
			 					this.adjustOpacityOnZ();
			 					if(callback != null)
			 						callback();
			 					//this.logger.log("ui, movedInSection, " + this.viewMode + " by -1000 z");
			 				}.bind(this))
			 				.start();
		 			} else {
		 				if(callback != null){
		 					callback.apply();
		 				}
		 			}
		 		}
 		} else {
 			if(callback != null){
 				callback.apply();
 			}
 		}
 	},

 	adjustOpacityOnZ: function(){
 		var p1s = 0;
 		var p2s = this.curZPos*8;
 		var p1e = p2s - 1;
 		var p2e = this.libElements[this.viewMode].length - 1;

 		var opc = 1/4;
 		var dOpc = 4;
 		for(var i = p1e;i >= p1s;i--){
 			this.libElements[this.viewMode][i].material.opacity = opc;
 			this.libElements[this.viewMode][i].children.forEach(function(child){
 				child.material.opacity = opc;
 			}.bind(this));

 			if(i%8 == 0){
 				opc /= dOpc;
 			}
 		}

 		opc = 1;

 		for(var i = p2s;i <= p2e;i++){
 			this.libElements[this.viewMode][i].material.opacity = opc;
 			this.libElements[this.viewMode][i].children.forEach(function(child){
 				child.material.opacity = opc;
 			}.bind(this));

 			if((i+1)%8 == 0){
 				opc /= dOpc;
 			}
 		}
 	},

 	onSongChange: function(index){
		var oldSongIndex = this.curSongIndex;
		this.curSongIndex = index;
		//this.logger.log("ui, songchange, from" + oldSongIndex + " to " + this.curSongIndex);
		if(this.viewMode == GESMO.QUEUEVIEW){ this.highlightCurrentSong(); }
	},

	highlightCurrentSong: function(){
		if(this.libElements[this.viewMode].length == 0)
			return;

			if(this.curSongHiglighter == null){
				this.curSongHiglighter = new THREE.Mesh(new THREE.BoxGeometry(120, 120, 10), new THREE.MeshPhongMaterial({
					color: 0x2194ce,
					wireframe: true
				}))
				this.curSongHiglighter.scale.x = 0.1;
				this.curSongHiglighter.scale.y = 0.1;
				this.curSongHiglighter.scale.z = 0.1;
				this.sections[this.viewMode].add(this.curSongHiglighter);

				new TWEEN.Tween( this.curSongHiglighter.scale )
					.to( { x: 1, y: 1, z: 1 }, Math.random() * 500 + 500 )
						.easing( TWEEN.Easing.Quadratic.InOut )
				.start();	
			}
			var target = this.libElements[this.viewMode][this.curSongIndex];
			new TWEEN.Tween( this.curSongHiglighter.position )
				.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * 500 + 500 )
				.easing( TWEEN.Easing.Quadratic.InOut )
				.start();
	},

	onSongRemove: function(index){
		if(this.viewMode == GESMO.QUEUEVIEW){
			var iToRemove, indextoRemove;
			for(var i = 0;i < this.libElements[this.viewMode].length;i++){
				var item = this.libElements[this.viewMode][i];
				if(item.userData.index == index){
					iToRemove = item;
					indextoRemove = i;
					break;
				}
			}
			this.sections[this.viewMode].remove(iToRemove);
			this.libElements[this.viewMode].splice(indextoRemove, 1);			
			this.assignTargets("queue");
			//this.transform(this.targets, 1000, null, null);
			for(var i = 0;i < this.libElements[this.viewMode].length;i++){
				this.libElements[this.viewMode][i].userData.index = i;
			}
		}
	},

	animate: function(){
 		var delta = this.clock.getDelta();
 		if(this.airplane){
 			this.airplane.updatePlane();
 		}
 		TWEEN.update();
 		this.render();
 	},

 	render: function(){
 		this.renderer.render( this.scene, this.camera );
 	},

	highlightElement: function(element){
		//var imagePlane = element.getObjectByName("image_plane");
		if(element){
			element.currentHex = element.material.emissive.getHex();
			element.material.emissive.setHex(0x2194ce); 
		}
		var flabel = element.getObjectByName("flabel");
		if(flabel){
			flabel.currentHex = flabel.material.color.getHex();
			flabel.material.color.setHex(0x2194ce);
		}

		var backToLabel = element.getObjectByName("backToLabel");
		if(backToLabel){
			backToLabel.currentHex = backToLabel.material.color.getHex();
			backToLabel.material.color.setHex(0x2194ce);
		}
		
	},

	removeHighlight: function(element){
		//var imagePlane = element.getObjectByName("image_plane");
		if(element){
			element.material.emissive.setHex(element.currentHex);
		}
		var flabel = element.getObjectByName("flabel");
		if(flabel){
			flabel.material.color.setHex( flabel.currentHex );
		}
		var backToLabel = element.getObjectByName("backToLabel");
		if(backToLabel){
			backToLabel.material.color.setHex( backToLabel.currentHex );
		}
	},

	queueSong: function(item, callback){
		this.isFetchingData = true;
		var copy = item.clone();
		copy.position.copy(item.position);
		copy.rotation.copy(item.rotation);
		//copy.material.opacity = 0;

		this.sections[this.viewMode].add(copy);

		new TWEEN.Tween(copy.scale)
			.to({ x: 0.1, y: 0.1, z: 0.1}, 500)
			.start();


		new TWEEN.Tween( copy.position )
				.to( { x: 0, y: 200, z: -this.movableObjects.position.z }, 1000 )
				.easing( TWEEN.Easing.Quadratic.InOut )
				.onComplete(function(){
						this.sections[this.viewMode].remove(copy);
						if(callback){
							callback.apply();
						} else {
							// send a call to queue with copy.info.id as argument
							var newEvent = new CustomEvent('gesmo.ui.addtoqueue', {
								detail: {
									type: copy.userData.type,
									id: copy.userData.id
								}
							});

							window.dispatchEvent(newEvent);
						}
						this.isFetchingData = false;
					}.bind(this))
				.start();
	},

	// for mouse interaction---------------------------------------------------------------------------------

	 	onMouseMove: function(event){
 		event.preventDefault();
 		if(!this.appStarted){
 			return;
 		}

		this.mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.mousePos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		this.raycaster.setFromCamera( this.mousePos, this.camera );
		var objectsArray = this.fetchAllPickables();

		var intersects = this.raycaster.intersectObjects( objectsArray );

		if ( intersects.length > 0 ) {
			if ( this.highlighted != intersects[0].object ) {
				if(this.highlighted != null) { this.removeHighlight(this.highlighted); }
				this.highlighted = intersects[0].object;
				this.highlightElement(this.highlighted);
			}
		} else {
			if(this.highlighted != null) { this.removeHighlight(this.highlighted); }
			this.highlighted = null;
		}
 	},

 	onClick: function(event, callback){
 		if(!this.appStarted){
 			if(callback){
 				callback.apply();
 			}
 			var event = new CustomEvent('gesmo.gesture.startdectected');
 			window.dispatchEvent(event);
 			return;
 		}

 		if(event.button == 0 && this.highlighted != null && this.isFetchingData == false){
 			var selectedType = this.highlighted.userData.type;			
			
			var searchQuery = {
					filterName: null,
					filterValue: null
			};

			switch(selectedType){
				case "artists" : {
					this.btns[this.viewMode].getObjectByName("flabel").visible = false;
					this.btns[this.viewMode].getObjectByName("backToLabel").visible = true;
					searchQuery.type = "songs";
					searchQuery.filterName = "artist_id";
					searchQuery.filterValue = this.highlighted.userData.id;
					this.fetchLibrary(searchQuery);	
					break;
				}
				case "albums" : {
					this.btns[this.viewMode].getObjectByName("flabel").visible = false;
					this.btns[this.viewMode].getObjectByName("backToLabel").visible = true;
					searchQuery.type = "songs";
					searchQuery.filterName = "album_id";
					searchQuery.filterValue = this.highlighted.userData.id;
					this.fetchLibrary(searchQuery);
					break;
				}
				case "charts" : {
					this.btns[this.viewMode].getObjectByName("flabel").visible = false;
					this.btns[this.viewMode].getObjectByName("backToLabel").visible = true;
					searchQuery.type = "songs";
					searchQuery.filterName = "chart_id";
					searchQuery.filterValue = this.highlighted.userData.id;
					this.fetchLibrary(searchQuery);
					break;
				}
				case "genres" : {
					this.btns[this.viewMode].getObjectByName("flabel").visible = false;
					this.btns[this.viewMode].getObjectByName("backToLabel").visible = true;
					searchQuery.type = "songs";
					searchQuery.filterName = "genre_id";
					searchQuery.filterValue = this.highlighted.userData.id;
					this.fetchLibrary(searchQuery);
					break;
				}
				case "playlists" : {
					searchQuery.type = "songs";
					searchQuery.filterName = "playlist_id";
					searchQuery.filterValue = this.highlighted.userData.id;
					this.queueSong(this.highlighted, function(){
						this.fetchLibrary(searchQuery);
					}.bind(this));
					break;
				}
				case "queueitem" : {
					var event = new CustomEvent("gesmo.ui.removefromq", {"detail": { "index" : this.highlighted.userData.index}});
					window.dispatchEvent(event);
					break;
				}
				case "back" : {
					this.btns[this.viewMode].getObjectByName("backToLabel").visible = false;
					this.btns[this.viewMode].getObjectByName("flabel").visible = true;
					searchQuery.type = "back";
					this.fetchLibrary(searchQuery);
					break;
				}
				case "songs" : {
					this.queueSong(this.highlighted);
					break;
				}
			}

 			//this.logger.log("ui, clicked, " + selectedType + ": " + this.highlighted.userData.name);
 			if(callback){
 				callback.apply();
 			}
		} else {
			if(callback){
				callback.apply();
			}
		}
 	},

 	goBack: function(callback){
 		var searchQuery = {
			filterName: null,
			filterValue: null
		};

 		this.btns[this.viewMode].getObjectByName("backToLabel").visible = false;
		this.btns[this.viewMode].getObjectByName("flabel").visible = true;
		searchQuery.type = "back";
		this.fetchLibrary(searchQuery);

		if(callback){
			callback.apply();
		}
 	},

 	// ---------------------------------------------------------------------------------------------------------------------------------
 	// for keyboard interaction --------------------------------------------------------------------------------------------------------

 	onKeyPress: function(event){
 		if(!this.appStarted){
 			return;
 		}
 		var key = event.key;
 		switch(key){
 			case GESMO.LEFTBUTTON: {
 				this.moveToSection("left", null);
 				break;
 			}

 			case GESMO.RIGHTBUTTON: {
 				this.moveToSection("right", null);
 				break;
 			}

 			case GESMO.UPBUTTON: {
 				this.moveToSection("up", null);
 				break;
 			}

 			case GESMO.DOWNBUTTON: {
 				this.moveToSection("down", null);
 				break;
 			}

 			case GESMO.FORWARDBUTTON: {
 				this.moveInSection("forward", null);
 				break;
 			}

 			case GESMO.BACKBUTTON: {
 				this.moveInSection("backward", null);
 				break;
 			}
 		}
 	},

 	// ---------------------------------------------------------------------------------------------------------------------------------

 	// for leap motion interaction -----------------------------------------------------------------------------------------------------

 	onHandMove: function(handMesh){
 		var toHighlight = this.checkIntersection(handMesh);
 		if(toHighlight != null){
 			if(this.highlighted != toHighlight){
 				if(this.highlighted != null) { this.removeHighlight(this.highlighted); }
				this.highlighted = toHighlight;
				this.highlightElement(this.highlighted);
 			}
 		} else {
 			if(this.highlighted != null) this.removeHighlight(this.highlighted);
 			this.highlighted = null;
 		}
 	},

 	//--------------------------------------------------------------------------------------------------------------------------------------

	// helper functions --------------------------------------------------------------------------------------------------------------------

	bin2dec: function (bin) {
		return parseInt(bin, 2).toString(10);
	},

	fetchAllPickables: function(){
		var objectsArray = [];
		objectsArray.push(this.buttons[this.viewMode]);
		var start = this.curZPos*8;
		var end = Math.min(this.libElements[this.viewMode].length, (this.curZPos + 1)*8);
		for(var i = start;i < end;i++){
			objectsArray.push(this.libElements[this.viewMode][i]);
		}

		return objectsArray;
	},

	calDistance: function(pos1, pos2){
		return Math.sqrt(Math.pow(pos2.x - pos1.x, 2), Math.pow(pos2.y - pos1.y, 2), Math.pow(pos2.z - pos1.z, 2));
	},

	checkIntersection: function(handMesh){
		var handBox = new THREE.Box3().setFromObject(handMesh);
		var objects = this.fetchAllPickables();
		for(var i = 0;i < objects.length;i++){
			var box3 = new THREE.Box3().setFromObject(objects[i]);
			var collision = box3.intersectsBox(handBox);
			if(collision){
				return objects[i];
			}
		}

		return null;
	}
};