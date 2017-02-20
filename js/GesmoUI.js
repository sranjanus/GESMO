/*
 * GESMO 3D UI
 * Author: @Shashank
 */

 GESMO.GesmoUI = function(container){

 	this.container = container;

 	// Create the scene and add fog effect
 	this.scene = new THREE.Scene();
 	//this.scene.fog = new THREE.Fog(0xf7d9aa, 10000, 95000);

 	// Create the camera
 	var aspectratio = GESMO.WIDTH/GESMO.HEIGHT;
 	fieldOfView = 75;
 	nearPlane = 0.1;
 	farPlane = 100000;
 	this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectratio,
 												nearPlane, farPlane);
 	this.camera.position.x = 3;
 	this.camera.position.z = 0; //10000;
 	this.camera.position.y = 0; //3000
 	//this.camera.lookAt(new THREE.Vector3(0,0,0));

 	// Create the renderer
 	this.renderer = new THREE.WebGLRenderer( { alpha: 1, antialias: true, clearColor: 0x000000 });
	this.renderer.setPixelRatio( window.devicePixelRatio );
	this.renderer.setSize( window.innerWidth, window.innerHeight );
	this.renderer.sortObjects = false;
	this.renderer.shadowMap.enabled = true;
	this.container.appendChild( this.renderer.domElement );

	this.movableObjects = new THREE.Object3D();
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

 	// Create the scene
 	// Create the Island
 	this.island = new GESMO.Island(10000, 500, 9000);
 	this.movableObjects.add(this.island.mesh);
 	this.island.mesh.position.y = -4600;

 	this.grass = new GESMO.GrassyTerrain(10000);
 	this.grass.mesh.position.y = 4500;
 	this.island.mesh.add(this.grass.mesh);

 	this.airplane = new GESMO.Airplane();
 	//this.airplane.mesh.scale.set(0.25, 0.25, 0.25);
 	this.scene.add(this.airplane.mesh);

 	this.pilot = new GESMO.Pilot();
 	this.pilot.mesh.position.set(8, 27, 0);
 	this.airplane.mesh.add(this.pilot.mesh);

 	this.pilot.camPoint.add(this.camera);
 	this.camera.lookAt(this.airplane.propeller.position);

 	this.spaceDebris = new GESMO.SpaceDebris(this.movableObjects);

	//create the music box and it's elements
	this.musicBox = new THREE.Object3D();
	this.movableObjects.add(this.musicBox);

	this.musicLibrary = new THREE.Object3D();
	this.musicBox.add( this.musicLibrary );

	this.libElements = [];
	this.targets = [];
	this.viewMode = GESMO.ARTISTSVIEW;
	this.songviewMode = GESMO.SONGSSEARCHVIEW;
	this.curSongIndex = 0;
	var slotGeom = new THREE.BoxGeometry(2.5, 1, 1);
	var slotOMat = new THREE.MeshPhongMaterial({
 		color: 0x000000,
 		shading: THREE.FlatShading
 	});
 	this.slotO = new THREE.Mesh(slotGeom, slotOMat);
 	this.slotO.position.set(21, 24.5, 0.75);
 	this.slotO.scale.x = 0.2;
 	this.slotO.scale.y = 0.05;
 	this.slotO.scale.z = 0.12;
 	this.scene.add(this.slotO);

	// this.trackballControls = new THREE.TrackballControls(this.camera);
	// this.trackballControls.noRotate = true;
	// this.trackballControls.noPan = true;
	this.clock = new THREE.Clock();

	this.mousePos = new THREE.Vector2();
	this.clock = new THREE.Clock(); 
	this.raycaster = new THREE.Raycaster();
	this.tsOffset = new THREE.Vector3();
	this.isLeftDragging = false;
	this.previousMousePosition = {
		x: 0,
		y: 0,
	};
	this.isRightDragging = false;

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

	this.mainList = [
		'artistsList',
		'topCharts',
		'newReleases',
		'musicLibrary',
		'stations'
	];

	//this.createHome();

	var fontLoader = new THREE.FontLoader();
		fontLoader.load("fonts/helvetiker_bold.typeface.json", function(font){
		this.titleFont = font;
		var newEvent = new CustomEvent('gesmo.ui.setupcomplete');
		window.dispatchEvent(newEvent);
	}.bind(this));
 };

GESMO.GesmoUI.prototype = {

 	constructor: GESMO.GesmoUI,

 	createHome: function(){
 		var t = Math.floor(this.mainList.length/2);
 		var start, end, incr;
 		if(t % 2 == 0){
 			start = -t*Math.PI/8;
 			end = t*Math.PI/8;
 			incr =  Math.PI/8;
 		} else {
 			start = -t*Math.PI/6;
 			end = t*Math.PI/6;
 			incr =  Math.PI/6;
 		}

 		for(var theta = start, i = 0;theta <= end; theta += incr, i++){
 			var geom = new THREE.BoxGeometry(50, 100, 10);
 			var mat = new THREE.MeshPhongMaterial({
 				color: Math.random() * 0xffffff - 0x110000,
 				shading: THREE.FlatShading
 			});

 			var box = new THREE.Mesh(geom, mat);
 			box.position.set(GESMO.LIBRARYRADIUS * Math.cos(theta), 50, GESMO.LIBRARYRADIUS * Math.sin(theta));
 			box.lookAt(new THREE.Vector3(0, 0, 0));
 			box.castShadow = true;
 			box.receiveShadow = true;
 			box.userData.type = this.mainList[i];
 			this.libElements.push(box);
 			this.musicLibrary.add(box);
 		}

 		this.viewMode = GESMO.HOMEVIEW;
 		
 	},

 	fetchLibrary: function(searchQuery){
 		if(this.libElements.length > 0){
 			this.destroyLibrary(this.sendQuery.bind(this), searchQuery);
 		}
 	},

 	sendQuery: function(query){
 		var newEvent = new CustomEvent('gesmo.ui.fetchlibrary', {
 			'detail': {
 				query: query
 			}
 		});

 		window.dispatchEvent(newEvent);
 	},

 	destroyLibrary: function(callback, callbackargs){

 		while(this.libElements.length > 0){
 			var libMesh = this.libElements.pop();
 			if(this.viewMode != GESMO.HOMEVIEW){
 				//this.musicLibrary.remove(libMesh);
 				var flabel = libMesh.getObjectByName("flabel");
 				libMesh.remove(flabel);
 				var llabel = libMesh.getObjectByName("llabel");
 				libMesh.remove(llabel);
 				
 				var targetPos = libMesh.userData.position;
 				var targetRot = libMesh.userData.rotation;
 				var targetSca =libMesh.userData.scale;

 				new TWEEN.Tween(libMesh.position)
 					.to({ x: targetPos.x, y:targetPos.y, z: targetPos.z}, 4000)
 					.easing(TWEEN.Easing.Exponential.InOut)
 					.start();

 				new TWEEN.Tween(libMesh.rotation)
 					.to({ x: targetRot.x, y:targetRot.y, z: targetRot.z}, 4000)
 					.easing(TWEEN.Easing.Exponential.InOut)
 					.start();

 				new TWEEN.Tween(libMesh.scale)
 					.to({ x: targetSca.x, y:targetSca.y, z: targetSca.z}, 4000)
 					.easing(TWEEN.Easing.Exponential.InOut)
 					.start();

 			} else {
 				this.musicLibrary.remove(libMesh);
 			}
 		}
 		//this.movableObjects.rotation.set(new THREE.Vector3(0, 0, 0));
 		//this.movableObjects.position.set(new THREE.Vector3(0, 0, 0));

 		//this.animate();
 		var args = [];
 		args.push(callbackargs);
 		callback.apply(this, args);
 	},

 	showLibrary: function(type, data){
 		if(type == "artists"){
 			this.viewMode = GESMO.ARTISTSVIEW;
 		} else if(type == "songs"){
 			this.viewMode = GESMO.SONGSVIEW;
 		} else {
 			this.viewMode = GESMO.QUEUEVIEW;
 		}

 		var k = 0;
 		var sIndex = Math.floor(Math.random()*(this.spaceDebris.clouds.length - 1) + 1);
 		while(this.spaceDebris.clouds.length - sIndex <= data.length){
 			sIndex = Math.floor(Math.random()*(this.spaceDebris.clouds.length - 1) + 1);
 		}

 		//this.scene.updateMatrixWorld();
 		for(var i = 0;i < data.length;i++){
 			var itemMesh = this.spaceDebris.clouds[sIndex + i];
 			itemMesh.userData = data[i];
 			itemMesh.userData.type = type;
 			itemMesh.userData.position = itemMesh.position.clone();
 			itemMesh.userData.rotation = itemMesh.rotation.clone();
 			itemMesh.userData.scale = itemMesh.scale.clone();

			//this.addLabels(itemMesh);

			this.libElements.push(itemMesh);
			this.musicLibrary.add(itemMesh);
 		}

 		this.assignTargets(type);
 		this.transform(this.targets, 2000);
 	},

 	addLabels: function(mesh){
 		var mbox = new THREE.Box3().setFromObject(mesh);
		var bSize = mbox.getSize().x;

		var nameMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
		var names = mesh.userData.name.split(" ");
		var fnameGeometry = new THREE.TextGeometry(names[0], {
			size: 7,
			height: 0,
			bevelEnabled: false,
			font: this.titleFont,
			weigth: "normal"
		});

		var fnameLabel = new THREE.Mesh(fnameGeometry, nameMaterial);
		fnameLabel.name = "flabel";
		mesh.add(fnameLabel);
		//console.log(mesh.lookAt());

		var fbox = new THREE.Box3().setFromObject(fnameLabel);
		var fSize = fbox.getSize().x;

		var halfDiff = (bSize - fSize);

		fnameLabel.position.x = -halfDiff/2;
		fnameLabel.position.z = 5;
		fnameLabel.position.y = 5;

		if(names.length == 2){
			var lnameGeometry = new THREE.TextGeometry(names[1], {
				size: 7,
				height: 0,
				bevelEnabled: false,
				font: this.titleFont,
				weigth: "normal"
			});

			var lnameLabel = new THREE.Mesh(lnameGeometry, nameMaterial);
			lnameLabel.name = "llabel";
			mesh.add(lnameLabel);

			var lbox = new THREE.Box3().setFromObject(lnameLabel);
			var lSize = lbox.getSize().x;

			halfDiff = (bSize - lSize);

			lnameLabel.position.x = -halfDiff/2;
			lnameLabel.position.z = 5;
			lnameLabel.position.y = -5;
		}
	},

	assignTargets: function(type){
		this.targets.length = 0;
		var vector = new THREE.Vector3();
		switch(type){
			case "artists":{
				var curChar = this.libElements[0].userData.name.toUpperCase().charAt(0);
				for ( var i = 0,theta = Math.PI; i < this.libElements.length; i += 3, theta += 2*Math.PI/36) {
					for(var j = 0;j < 3 && i+j <this.libElements.length;j++){
						var itemGeom = new THREE.PlaneGeometry(1, 1);
						var itemMat = new THREE.MeshNormalMaterial();
						var itemMesh = new THREE.Mesh(itemGeom, itemMat);

						itemMesh.position.y = j*80;
						itemMesh.position.x = 500 * Math.sin( theta );
						itemMesh.position.z = 500 * Math.cos( theta );
						//itemMesh.position.set(70, 1, 0);

						vector.y = j*80;
						vector.x = 0;
						vector.z = 0;

						itemMesh.lookAt( vector );
						this.targets.push( itemMesh );

						if(i+j+1 < this.libElements.length){
							var eleName = this.libElements[i+j+1].userData.name.toUpperCase();
							if(eleName.charAt(0) != curChar){
								curChar = eleName.charAt(0);
								i = i+j+1 - 3;
								break;	
							}
						}
					}
				}
				break;
			}

			case "songs":{
				if(this.songviewMode == GESMO.SONGSSEARCHVIEW){
					var curChar = this.libElements[0].userData.name.toUpperCase().charAt(0);
					var k = 1;
					var j = 0;
					var i = 0;
					var l = 0;
					var theta = 0;
					do {
						var itemGeom = new THREE.PlaneGeometry(1, 1);
						var itemMat = new THREE.MeshNormalMaterial();
						var itemMesh = new THREE.Mesh(itemGeom, itemMat);

						itemMesh.position.y = j*80;
						itemMesh.position.x = k*500 * Math.sin( theta);
						itemMesh.position.z = k*500 * Math.cos( theta);
						vector.y = j*80;
						vector.x = 0;
						vector.z = 0;

						itemMesh.lookAt( vector );
						this.targets.push( itemMesh );
						i++;
						j++;
						if(j%3 == 0){
							k++;
							j = 0;
						}

						if(i < this.libElements.length && this.libElements[i].userData.name.toUpperCase().charAt(0) != curChar){
							k = 1;
							j = 0;
							curChar = this.libElements[i].userData.name.toUpperCase().charAt(0);
							l++
							if(l%2 == 0){
								theta += 2*Math.PI/30;
							} else{
								theta += 2*Math.PI/48;
							}
						}
					} while(i < this.libElements.length);
				} else {
					for ( var i = 0, k = 0; i < this.libElements.length; i += 3,k++) {
						var theta = Math.PI;
						for(var j = 0;j < 3 && i+j <this.libElements.length;j++){
							var itemGeom = new THREE.PlaneGeometry(1, 1);
							var itemMat = new THREE.MeshNormalMaterial();
							var itemMesh = new THREE.Mesh(itemGeom, itemMat);

							itemMesh.position.x = -300 + k*80;
							itemMesh.position.y = 500 * Math.sin( theta ) + 60;
							itemMesh.position.z = 500 * Math.cos( theta );

							vector.copy( itemMesh.position );

							itemMesh.lookAt( vector );
							this.targets.push( itemMesh );
							theta += 2*Math.PI/36;
						}
					}
				}
				break;
			}

			case "queue":{


				for ( var i = -this.curSongIndex, l = this.libElements.length - this.curSongIndex; i < l; i++ ) {

					var itemGeom = new THREE.PlaneGeometry(1, 1);
					var itemMat = new THREE.MeshNormalMaterial();
					var itemMesh = new THREE.Mesh(itemGeom, itemMat);

					itemMesh.position.z = -50*i*i - 250;
					itemMesh.position.x = i*100;

					vector.copy( itemMesh.position );
					vector.x *= -2;
					vector.z *= -2;

					itemMesh.lookAt( vector );

					this.targets.push( itemMesh );

				}
				break;
			}
		}
	},

	transform: function( targets, duration ) {
		for ( var i = 0; i < this.libElements.length; i ++ ) {
			var object = this.libElements[ i ];
			var target = (targets.length) ? targets[i] : targets;

			new TWEEN.Tween( object.position )
				.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();

			new TWEEN.Tween( object.scale )
				.to({x: 1, y: 1, z: 1}, Math.random() * duration + duration)
				.onComplete(function(){
					this.addLabels(object);
				}.bind(this))
				.start();

			new TWEEN.Tween( object.rotation )
				.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();
		}

		new TWEEN.Tween( this )
			.to( {}, duration * 2 )
			.onUpdate( this.render )
			.start();


		return this;
	},

 	// onWindowResize: function(){
 	// 	this.camera.aspect = window.innerWidth/window.innerHeight;
 	// 	this.camera.updateProjectionMatrix();

 	// 	this.renderer.setSize(window.innerWidth, window.innerHeight);
 	// },

 	// for mouse interaction----------------------------------------------------------------------------------

 	onMouseDown: function(event){
 		this.mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.mousePos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		this.raycaster.setFromCamera( this.mousePos, this.camera );
	
		if(event.button == 0){
			var objectsArray = [];
			if(this.viewMode == GESMO.HOMEVIEW){
				this.musicLibrary.children
			}
			for(var i = 0;i < this.libElements.length;i++){
				objectsArray.push(this.libElements[i]);
			}

			var intersects = this.raycaster.intersectObjects( objectsArray );

			if(intersects.length == 0){
				this.isLeftDragging = true;
			}	
		} else if(event.button == 2){
			var plane = new THREE.Plane();
			plane.setFromNormalAndCoplanarPoint(this.camera.getWorldDirection(plane.normal), this.musicBox.position);

			var intersection = new THREE.Vector3();

			this.raycaster.ray.intersectPlane(plane, intersection);

			this.tsOffset.copy(intersection);

			this.isRightDragging = true;
		}
		this.previousMousePosition = {
			x: event.offsetX,
			y: event.offsetY
		};
 	},

 	onMouseMove: function(event){
 		event.preventDefault();

		if(this.isLeftDragging){
			var deltaMove = {
				x: event.offsetX - this.previousMousePosition.x,
				y: event.offsetY - this.previousMousePosition.y
			}; 

			if((this.viewMode == GESMO.ARTISTSVIEW || this.viewMode == GESMO.HOMEVIEW || (this.viewMode == GESMO.SONGSVIEW && this.songviewMode == GESMO.SONGSSEARCHVIEW )) && (Math.abs(deltaMove.x) > Math.abs(deltaMove.y))){
				this.rotateLibY(deltaMove.x);
			}

			if(this.viewMode == GESMO.HOMEVIEW && Math.abs(deltaMove.x) < Math.abs(deltaMove.y)){
				deltaMove.x = 0;
				this.translateLibX(deltaMove.y);
			}

			if(this.viewMode == GESMO.SONGSVIEW){
				if(this.songviewMode == GESMO.SONGSBROWSEVIEW){
					deltaMove.y = 0;
					this.translateLibZ(deltaMove.x);
				} else if( Math.abs(deltaMove.x) <  Math.abs(deltaMove.y)){
					deltaMove.x  = 0;
					this.translateLibX(deltaMove.y);
				}
			}
		} else if(this.isRightDragging) {
			this.mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			this.mousePos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			this.raycaster.setFromCamera( this.mousePos, this.camera );

			var plane = new THREE.Plane();
			plane.setFromNormalAndCoplanarPoint(this.camera.getWorldDirection(plane.normal), this.musicBox.position);

			var intersection = new THREE.Vector3();

			this.raycaster.ray.intersectPlane(plane, intersection);

			var delta = intersection.sub(this.tsOffset);
			this.tsOffset.copy(intersection);

			// tranlate call
		} else {
			this.mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			this.mousePos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			this.raycaster.setFromCamera( this.mousePos, this.camera );
			var objectsArray = [];
			for(var i = 0;i < this.libElements.length;i++){
				objectsArray.push(this.libElements[i]);
			}

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
		}

		this.previousMousePosition = {
			x: event.offsetX,
			y: event.offsetY
		};
 	},

 	onMouseUp: function(event){
 		this.isLeftDragging = false;
 		this.isRightDragging = false;
 	},

 	onClick: function(event){
 		if(event.button == 0 && this.highlighted != null){
			var selectedType = this.highlighted.userData.type;
			var searchQuery = {
					filterName: null,
					filterValue: null
			};

			switch(selectedType){
				case "artistsList" : {
					searchQuery.type = "artists";
					this.fetchLibrary(searchQuery);
					break;
				}
				case "topCharts" : {
					// searchQuery.type = "songs";
					// searchQuery.filterName = "maxRank";
					// searchQuery.filterValue = 20;
					break;
				}
				case "newReleases" : {
					// searchQuery.type = "albums";
					// searchQuery.filterName = "maxRank";
					// searchQuery.filterValue = 20;
					break;
				}
				case "musicLibrary" : {
					break;
				}
				case "stations" : {
					break;
				}
				case "artists" : {
					searchQuery.type = "songs";
					searchQuery.filterName = "artist_id";
					searchQuery.filterValue = this.highlighted.userData.id;
					this.fetchLibrary(searchQuery);	
					break;
				}
				case "albums" : {
					searchQuery.type = "songs";
					this.fetchLibrary(searchQuery);
					break;
				}
				case "queue" : {
					searchQuery.type = "queue";
					this.fetchLibrary(searchQuery);
					break;
				}
				case "back" : {
					searchQuery.type = "back";
					this.fetchLibrary(searchQuery);
					break;
				}
				case "songs" : {
					this.queueSong(this.highlighted);
					break;
				}
				case "play" : {
					var event = new CustomEvent("gesmo.actions.play");
					window.dispatchEvent(event);
					break;
				}
				case "pause" : {
					var event = new CustomEvent("gesmo.actions.pause");
					window.dispatchEvent(event);
					break;
				}
				case "prev" : {
					var event = new CustomEvent("gesmo.actions.prev");
					window.dispatchEvent(event);
					break;
				}
				case "next" : {
					var event = new CustomEvent("gesmo.actions.next");
					window.dispatchEvent(event);
					break;
				}
			}
		}
 	},

 	// -------------------------------------------------------------------------------------------------------

 	// for leap motion interaction ---------------------------------------------------------------------------

 	onHandMove: function(tipPosition){
 		var toHighlight = this.checkIntersection(tipPosition);
 		if(toHighlight != null){
 			if(this.highlighted != toHighlight){
 				if(this.highlighted != null) { this.removeHighlight(this.highlighted); }
				this.highlighted = toHighlight;
				this.highlightElement(this.highlighted);
 			}
 		} else {
 			if(this.highlighted != null) this.removeHighlight(this.highlighted);
 		}
 	},

 	//--------------------------------------------------------------------------------------------------------

 	animate: function(){
 		//requestAnimationFrame(this.animate);
 		var delta = this.clock.getDelta();
 		//this.trackballControls.update(delta);
 		//this.water.moveWaves();
 		TWEEN.update();
 		this.render();
 	},

 	render: function(){
 		this.renderer.render( this.scene, this.camera );
 	},

	highlightElement: function(element){
		element.currentHex = element.material.emissive.getHex();
		element.material.emissive.setHex(0xff0000);
	},

	removeHighlight: function(element){
		element.material.emissive.setHex( element.currentHex );
	},

	queueSong: function(item){
		var copy = item.clone();
		copy.position.copy(item.position);
		copy.rotation.copy(item.rotation);

		this.musicLibrary.add(copy);

		new TWEEN.Tween(copy.scale)
			.to({ x: 0.005, y: 0.005, z: 0.005}, Math.random() * 500 + 500)
			.start();

		new TWEEN.Tween(copy.rotation)
			.to({x: 0, y: 0, z: 0}, Math.random() * 500 + 500)
			.start();


		new TWEEN.Tween( copy.position )
				.to( { x: this.slotO.position.x, y: this.slotO.position.y, z: this.slotO.position.z }, Math.random() * 1500 + 1500 )
				.easing( TWEEN.Easing.Quadratic.InOut )
				.onComplete(function(){
						this.musicLibrary.remove(copy);
						// send a call to queue with copy.info.id as argument
						var newEvent = new CustomEvent('gesmo.ui.addtoqueue', {
							detail: {
								type: copy.userData.type,
								id: copy.userData.id
							}
						});

						window.dispatchEvent(newEvent);
					}.bind(this))
				.start();

		// var tween2 = new TWEEN.Tween(copy.position)
		// 			.to( { x: this.slotO.position.x, y: this.slotO.position.y - 1, z: this.slotO.position.z }, Math.random() * 500 + 500 ) 
		// 			.easing( TWEEN.Easing.Quadratic.InOut )
		// 			.onComplete(function(){
		// 				// this.musicLibrary.remove(copy);
		// 				// // send a call to queue with copy.info.id as argument
		// 				// var newEvent = new CustomEvent('gesmo.ui.addtoqueue', {
		// 				// 	detail: {
		// 				// 		type: copy.userData.type,
		// 				// 		id: copy.userData.id
		// 				// 	}
		// 				// });

		// 				// window.dispatchEvent(newEvent);
		// 			}.bind(this));
		// tween1.chain(tween2);
	},

	rotateLib: function(deltaMove){
		var deltaRotationQuaternion = new THREE.Quaternion()
				.setFromEuler(new THREE.Euler(
					0, //this.toRadians(deltaMove.y * 1),
					this.toRadians(deltaMove.x * 1),
					0,
					'XYZ'
				));

		this.movableObjects.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.movableObjects.quaternion);
	},

	translateLibX: function(delta){
		this.movableObjects.translateX(delta*10);
	},

	translateLibY: function(delta){
		this.movableObjects.translateY(delta*10);
	},

	translateLibZ: function(delta){
		this.movableObjects.translateZ(delta*10);
	},

	rotateLibX: function(delta){
		var deltaRotationQuaternion = new THREE.Quaternion()
				.setFromEuler(new THREE.Euler(
					this.toRadians(delta * 1),
					0,
					0,
					'XYZ'
				));

		this.movableObjects.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.movableObjects.quaternion);
	},

	rotateLibY: function(delta){
		var deltaRotationQuaternion = new THREE.Quaternion()
				.setFromEuler(new THREE.Euler(
					0,
					this.toRadians(delta * 1),
					0,
					'XYZ'
				));

		this.movableObjects.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.movableObjects.quaternion);
	}, 

	rotateLibZ: function(delta){
		var deltaRotationQuaternion = new THREE.Quaternion()
				.setFromEuler(new THREE.Euler(
					0,
					0,
					this.toRadians(delta * 1),
					'XYZ'
				));

		this.movableObjects.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.movableObjects.quaternion);
	},

	// helper functions --------------------------------------
	toRadians: function(angle) {
		return angle * (Math.PI / 180);
	},

	toDegrees: function(angle) {
		return angle * (180 / Math.PI);
	},

	fetchAllPickables: function(){
		var objectsArray = [];
		objectsArray.push(this.musicBoxBack);
		objectsArray.push(this.musicBoxQ);
		objectsArray.push(this.musicBoxPlay);
		objectsArray.push(this.musicBoxPause);
		objectsArray.push(this.musicBoxPrev);
		objectsArray.push(this.musicBoxNext);
		for(var i = 0;i < this.libElements.length;i++){
			objectsArray.push(this.libElements[i]);
		}

		return objectsArray;
	},

	checkIntersection: function(point){
		var dist = 5;
		var objects = this.fetchAllPickables();
		var collisions = [];
		for(var i = 0;i < this.rays.length;i++){
			this.raycaster.set(point, this.rays[i]);
			collisions = collisions.concat(this.raycaster.intersectObjects(objects));
		}

		if(collisions.length > 0){
			collisions.sort(function(a, b){
				return a.distance - b.distance;
			});

			if(collisions[0].distance <= 50){
				return collisions[0].object;
			} else {
				return null;
			}
		} else {
			return null;
		}
	},

	onSongChange: function(index){
		this.curSongIndex = index;
		if(this.viewMode == GESMO.QUEUEVIEW){
			this.assignTargets("queue");
			this.transform(this.targets, 2000);
		}
	}
};