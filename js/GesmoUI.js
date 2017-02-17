/*
 * GESMO 3D UI
 * Author: @Shashank
 */

 GESMO.GesmoUI = function(container){

 		this.container = container;

 		this.scene = new THREE.Scene();
 		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 10000);
 		this.camera.position.z = 0;
		this.camera.lookAt( this.scene.position );

		//create the music box and it's elements
		this.musicBox = new THREE.Object3D();
		this.scene.add(this.musicBox);

		this.musicPlayer = new THREE.Object3D();
		this.musicBox.add( this.musicPlayer );

		var geometry1 = new THREE.CylinderBufferGeometry( 20, 20, 20, 32);
		var material1 = new THREE.MeshLambertMaterial( {color: 0xffff00,
			side: THREE.DoubleSide
		} );
		var m1 = new THREE.Mesh( geometry1, material1 );

		var geometry2 = new THREE.TorusBufferGeometry(20, 5, 16, 100);
		var material2 = new THREE.MeshLambertMaterial( {color: 0xffff00,
			side: THREE.DoubleSide
		} );
		m2 = new THREE.Mesh( geometry2, material2 );
		m2.rotation.x = Math.PI/2;
		m2.position.y = -10;
		this.mPLeftPanel = new THREE.Object3D();
		this.mPLeftPanel.add(m1);
		this.mPLeftPanel.add(m2);
		this.mPLeftPanel.position.x = 0;
		this.mPLeftPanel.position.y = 40;
		this.mPLeftPanel.position.z = -100;
		this.musicPlayer.add(this.mPLeftPanel);

		this.musicBoxQ = new THREE.Mesh(new THREE.BoxGeometry( 10, 10, 10), new THREE.MeshLambertMaterial( { color: 0x0000ff}));
		this.musicBox.add(this.musicBoxQ);
		this.musicBoxQ.position.z = -100;
		this.musicBoxQ.position.x = 20;
		this.musicBoxQ.position.y = 30;
		this.musicBoxQ.userData = {
			type: "queue"
		};

		this.musicBoxPlay = new THREE.Mesh(new THREE.BoxGeometry( 10, 5, 5), new THREE.MeshLambertMaterial( { color: 0xff0000}));
		this.musicBox.add(this.musicBoxPlay);
		this.musicBoxPlay.position.z = -100;
		this.musicBoxPlay.position.x = -5;
		this.musicBoxPlay.position.y = -35;
		this.musicBoxPlay.userData = {
				type: "play"
		};

		this.musicBoxPause = new THREE.Mesh(new THREE.BoxGeometry( 10, 5, 5), new THREE.MeshLambertMaterial( { color: 0x00ffff}));
		this.musicBox.add(this.musicBoxPause);
		this.musicBoxPause.position.z = -100;
		this.musicBoxPause.position.x = 5;
		this.musicBoxPause.position.y = -35;
		this.musicBoxPause.userData = {
				type: "pause"
		};

		this.musicBoxPrev = new THREE.Mesh(new THREE.BoxGeometry( 10, 5, 5), new THREE.MeshLambertMaterial( { color: 0xffff00}));
		this.musicBox.add(this.musicBoxPrev);
		this.musicBoxPrev.position.z = -100;
		this.musicBoxPrev.position.x = -15;
		this.musicBoxPrev.position.y = -35;
		this.musicBoxPrev.userData = {
				type: "prev"
		};

		this.musicBoxNext = new THREE.Mesh(new THREE.BoxGeometry( 10, 5, 5), new THREE.MeshLambertMaterial( { color: 0xff00ff}));
		this.musicBox.add(this.musicBoxNext);
		this.musicBoxNext.position.z = -100;
		this.musicBoxNext.position.x = 15;
		this.musicBoxNext.position.y = -35;
		this.musicBoxNext.userData = {
				type: "next"
		};

		this.musicBoxBack = new THREE.Mesh( new THREE.BoxGeometry(10, 10, 10), new THREE.MeshLambertMaterial({color: 0x00ff00}));
		this.musicBox.add( this.musicBoxBack );
		this.musicBoxBack.position.z = -100;
		this.musicBoxBack.position.x = -20;
		this.musicBoxBack.position.y = 30;
		this.musicBoxBack.userData = {
			type: "back"
		};

		this.musicLibrary = new THREE.Object3D();
		this.musicBox.add(this.musicLibrary);

		this.elementMeshPool = [];
		this.libElements = [];
		this.libExtraInfo = {};
		this.targets = [];
		this.addToMeshPool(50);
		this.viewMode = GESMO.ARTISTSVIEW;
		this.songviewMode = GESMO.SONGSBROWSEVIEW;
		this.curSongIndex = 0;

		// create and add lights to the scene
		this.ambientLight = new THREE.AmbientLight( 0x555555 );
		this.scene.add(this.ambientLight);

		this.lights = [];
		this.lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
		this.lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
		this.lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

		this.lights[ 0 ].position.set( 0, 0, 0 );
		//lights[ 1 ].position.set( 100, 200, 100 );
		//lights[ 2 ].position.set( - 100, - 200, - 100 );

		this.musicLibrary.add( this.lights[ 0 ] );

		this.trackballControls = new THREE.TrackballControls(this.camera);
		this.trackballControls.noRotate = true;
		this.trackballControls.noPan = true;
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

		this.renderer = new THREE.WebGLRenderer( { alpha: 1, antialias: true, clearColor: 0x000000 });
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.sortObjects = false;
		this.container.appendChild( this.renderer.domElement );

		var fontLoader = new THREE.FontLoader();
		fontLoader.load("fonts/helvetiker_bold.typeface.json", function(font){
			this.titleFont = font;
			var newEvent = new CustomEvent('gesmo.ui.setupcomplete');
			window.dispatchEvent(newEvent);
		}.bind(this));
 	};

GESMO.GesmoUI.prototype = {

 	constructor: GESMO.GesmoUI,

 	createLibraryElements: function(){
 		var itemGeom = new THREE.BoxGeometry(60, 60, 10);
		var itemMat = new THREE.MeshLambertMaterial({
			color: Math.random() * 0xffffff - 0x110000,
			side: THREE.DoubleSide
		});

		var itemMesh = new THREE.Mesh(itemGeom, itemMat);
		return itemMesh;
 	},

 	addToMeshPool: function(value){
 		for(var i = 0;i < value;i++){
			this.elementMeshPool.push(this.createLibraryElements());
		}
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
 		this.libExtraInfo = {};
 		while(this.libElements.length > 0){
 			var libMesh = this.libElements.pop();
 			this.musicLibrary.remove(libMesh);
 			var flabel = libMesh.getObjectByName("flabel");
 			libMesh.remove(flabel);
 			var llabel = libMesh.getObjectByName("llabel");
 			libMesh.remove(llabel);
 			libMesh.userData = {};
 			this.elementMeshPool.push(libMesh);
 		}
 		this.musicLibrary.rotation.set(0, 0, 0);
 		//this.musicLibrary.position.set(this.musicLibrary.userData.position);
 		this.animate();
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

 		if(data.length > this.elementMeshPool.length){
 			this.addToMeshPool(data.length - this.elementMeshPool.length);
 		}

 		for(var i = 0;i < data.length;i++){
 			var itemMesh = this.elementMeshPool.pop();
 			itemMesh.position.x = this.musicBoxBack.position.x;
			itemMesh.position.y = this.musicBoxBack.position.y;
			itemMesh.position.z = this.musicBoxBack.position.z;

			itemMesh.scale.x = 0.1;
			itemMesh.scale.y = 0.1;
			itemMesh.scale.z = 0.1;

			itemMesh.userData = data[i];
			itemMesh.userData.type = type;

			this.addLabels(itemMesh);

			this.libElements.push(itemMesh);
			this.musicLibrary.add(itemMesh);
 		}

 		this.assignTargets(type);
 		this.transform(this.targets, 2000);
 	},

 	onWindowResize: function(){
 		this.camera.aspect = window.innerWidth/window.innerHeight;
 		this.camera.updateProjectionMatrix();

 		this.renderer.setSize(window.innerWidth, window.innerHeight);
 	},

 	// for mouse interaction----------------------------------------------------------------------------------

 	onMouseDown: function(event){
 		this.mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.mousePos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		this.raycaster.setFromCamera( this.mousePos, this.camera );
	
		if(event.button == 0){
			var objectsArray = [];
			objectsArray.push(this.musicBoxBack);
			objectsArray.push(this.musicBoxQ);
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
 	},

 	onMouseMove: function(event){
 		event.preventDefault();

		if(this.isLeftDragging){
			var deltaMove = {
				x: event.offsetX - this.previousMousePosition.x,
				y: event.offsetY - this.previousMousePosition.y
			}; 

			if(this.viewMode == GESMO.ARTISTSVIEW || this.viewMode == GESMO.SONGSVIEW){
				this.rotateLib(deltaMove);
			}

			// if(this.viewMode == GESMO.SONGSVIEW){
			// 	this.translateLib(deltaMove);
			// }
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
			objectsArray.push(this.musicBoxBack);
			objectsArray.push(this.musicBoxQ);
			objectsArray.push(this.musicBoxPlay);
			objectsArray.push(this.musicBoxPause);
			objectsArray.push(this.musicBoxPrev);
			objectsArray.push(this.musicBoxNext);
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
 		//console.log(this.highlighted);
 		if(event.button == 0 && this.highlighted != null){
			var selectedType = this.highlighted.userData.type;
			var searchQuery = {
					filterName: null,
					filterValue: null
			};

			switch(selectedType){
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
 		this.trackballControls.update(delta);
 		TWEEN.update();
 		this.render();
 	},

 	render: function(){
 		this.renderer.render( this.scene, this.camera );
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

						itemMesh.position.y = -100 + j*80;
						itemMesh.position.x = 500 * Math.sin( theta );
						itemMesh.position.z = 500 * Math.cos( theta );

						vector.y = -200 + j*80;
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
					var theta = Math.PI;
					do {
						var itemGeom = new THREE.PlaneGeometry(1, 1);
						var itemMat = new THREE.MeshNormalMaterial();
						var itemMesh = new THREE.Mesh(itemGeom, itemMat);

						itemMesh.position.y = -100 + j*80;
						itemMesh.position.x = k*500 * Math.sin( theta);
						itemMesh.position.z = k*500 * Math.cos( theta);
						vector.y = -100 + j*80;
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

		TWEEN.removeAll();

		for ( var i = 0; i < this.libElements.length; i ++ ) {

			var object = this.libElements[ i ];
			var target = (targets.length) ? targets[i] : targets;

			new TWEEN.Tween( object.position )
				.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();

			new TWEEN.Tween( object.scale )
				.to({x: 1, y: 1, z: 1}, Math.random() * duration + duration)
				.start();

			new TWEEN.Tween( object.rotation )
				.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();
		}

		new TWEEN.Tween( this )
			.to( {}, duration * 2 )
			.onUpdate( this.render )
			.onComplete(function(){
				this.musicLibrary.userData = {
					rotation: this.musicLibrary.rotation,
					position: this.musicLibrary.position 
				};
			}.bind(this))
			.start();


		return this;
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
			.to({ x: 0.1, y: 0.1, z: 0.1}, Math.random() * 200 + 200)
			.start();

		new TWEEN.Tween( copy.position )
				.to( { x: this.musicBoxQ.position.x, y: this.musicBoxQ.position.y, z: this.musicBoxQ.position.z }, Math.random() * 500 + 500 )
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
	},

	rotateLib: function(deltaMove){
		var deltaRotationQuaternion = new THREE.Quaternion()
				.setFromEuler(new THREE.Euler(
					0, //this.toRadians(deltaMove.y * 1),
					this.toRadians(deltaMove.x * 1),
					0,
					'XYZ'
				));

		this.musicLibrary.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.musicLibrary.quaternion);
	},

	translateLib: function(deltaMove){
		//var speed = 0.3;
		// this.musicBox.position.x += 0.1*deltaMove.x;
		// this.musicBox.position.y += 0.1*deltaMove.y;
		// this.musicBox.position.set(deltaMove);
		if(deltaMove.x > deltaMove.y){
			this.musicLibrary.translateX(deltaMove.x);
		} else {
			this.musicLibrary.translateZ(deltaMove.y);
		}
	},

	zoomMusicBox: function(deltaMove){
		this.musicBox.position.z = this.musicBox.position.z + deltaMove;
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