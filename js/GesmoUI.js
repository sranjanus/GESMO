/*
 * GESMO 3D UI
 * Author: @Shashank
 */

 GESMO.GesmoUI = (function(){
 	var GesmoUI = function(container){

 		this.container = container;

 		this.scene = new THREE.Scene();
 		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000);
 		this.camera.position.z = 4800;
		this.camera.lookAt( this.scene.position );

		//create the music box and it's elements
		this.musicBox = new THREE.Object3D();
		this.scene.add(this.musicBox);

		this.musicPlayer = new THREE.Mesh( new THREE.BoxGeometry( 5000, 800, 200 ), new THREE.MeshLambertMaterial( {color: 0x00ff00} ) );
		this.musicBox.add( ui_musicPlayer );
		this.musicPlayer.position.y = 3100;

		this.musicBoxQ = new THREE.Mesh(new THREE.BoxGeometry( 800, 250, 100), new THREE.MeshLambertMaterial( { color: 0x0000fff}));
		this.musicPlayer.add(this.musicBoxQ);
		this.musicBoxQ.position.z = this.musicPlayer.position.z + 90;
		this.musicBoxQ.position.y = this.musicPlayer.position.y - 3650;
		this.musicBoxQ.info = {
			type: "queue"
		};

		this.musicBoxBack = new THREE.Mesh( new THREE.BoxGeometry(400, 400, 10), new THREE.MeshLambertMaterial({color: 0x00ff00}));
		this.musicBox.add( ui_musicBoxBack );
		this.musicBoxBack.position.y = -3200;
		this.musicBoxBack.info = {
			type: "back"
		};

		this.musicLibrary = new THREE.Object3D();
		this.musicBox.add(musicLibrary);

		this.elementMeshPool = [];
		this.libElements = [];
		this.targets = [];
		this.addToMeshPool(50);

		// create and add lights to the scene
		this.ambientLight = new THREE.AmbientLight( 0x555555 );
		this.scene.add(ambientLight);

		this.lights = [];
		this.lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
		this.lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
		this.lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

		this.lights[ 0 ].position.set( 0, 0, 0 );
		//lights[ 1 ].position.set( 100, 200, 100 );
		//lights[ 2 ].position.set( - 100, - 200, - 100 );

		this.scene.add( this.lights[ 0 ] );

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

		this.renderer = new THREE.WebGLRenderer( { alpha: 1, antialias: true, clearColor: 0x000000 });
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.sortObjects = false;
		this.container.appendChild( this.renderer.domElement );

		var fontLoader = new THREE.FontLoader();
		fontLoader.load("fonts/helvetiker_bold.typeface.json", function(font){
			this.titleFont = font;
		}.bind(this));
 	}

 	GesmoUI.prototype.fetchLibrary = function(searchQuery){
 		if(this.libElements.length > 0){
 			this.destroyLibrary();
 		}

 		var newEvent = new CustomEvent('gesmo.ui.fetchlibrary', {
 			'detail': {
 				query: searchQuery;
 			}
 		});

 		window.dispatchEvent(newEvent);
 	}

 	GesmoUI.prototype.createLibraryElements = function(){
 			var itemGeom = new THREE.BoxGeometry(400, 400, 10);
			var itemMat = new THREE.MeshPhongMaterial({
				color: Math.random() * 0xffffff,
				specular : 0x111111,
				shininess: 30,
				side: THREE.DoubleSide
			});

			var itemMesh = new THREE.Mesh(itemGeom, itemMat);
			itemMesh.info = {};
 			itemMesh.info.type = "";
			return itemMesh;
 	}

 	GesmoUI.prototype.addToMeshPool = function(value){
 		for(var i = 0;i < value;i++){
			this.elementMeshPool.push(createLibraryElements);
		}
 	}

 	GesmoUI.prototype.destroyLibrary = function(){
 		while(libElements.length > 0){
 			var libMesh = libElements.pop();
 			this.musicLibrary.remove(libMesh);
 			var label = libMesh.getObjectByName("label");
 			libMesh.remove(label);
 			libMesh.info = {};
 			libMesh.info.type = "";
 			this.elementMeshPool.push(libMesh);
 		}
 	}

 	GesmoUI.prototype.showLibrary = function(type, data){
 		if(data.length > this.elementMeshPool.length){
 			this.addToMeshPool(data.length - this.elementMeshPool.length);
 		}

 		for(var i = 0;i < data.length;i++){
 			var itemMesh = this.elementMeshPool.pop();
 			itemMesh.position.x = ui_musicPlayer.position.x;
			itemMesh.position.y = ui_musicPlayer.position.y;
			itemMesh.position.z = ui_musicPlayer.position.z;

			itemMesh.info = data;
			itemMesh.info.type = type;

			this.libElements.push(itemMesh);
			this.musicLibrary.add(itemMesh);
 		}

 		this.assignTargets(type);
 		this.transform(targets, 2000);
 	}

 	GesmoUI.prototype.onWindowResize = function(){
 		this.camera.aspect = window.innerWidth/window.innerHeight;
 		this.camera.updateProjectionMatrix();

 		this.renderer.setSize(window.innerWidth, window.innerHeight);
 	}

 	// for mouse interaction----------------------------------------------------------------------------------

 	GesmoUI.prototype.onMouseDown = function(event){
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
 	}

 	GesmoUI.prototype.onMouseMove = function(event){
 		event.preventDefault();

		if(this.isLeftDragging){
			var deltaMove = {
				x: event.offsetX - this.previousMousePosition.x,
				y: event.offsetY - this.previousMousePosition.y
			}; 
			this.rotateLib(deltaMove);
		} else if(isRightDragging) {
			this.mousePos.x = ( e.clientX / window.innerWidth ) * 2 - 1;
			this.mousePos.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

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

			this.raycaster.setFromCamera( mouse, camera );
			var objectsArray = [];
			objectsArray.push(this.musicBoxBack);
			objectsArray.push(this.musicBoxQ);
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
 	}

 	GesmoUI.prototype.onMouseUp = function(event){
 		this.isLeftDragging = false;
 		this.isRightDragging = false;
 	}

 	GesmoUI.prototype.onClick = function(event){
 		if(event.button == 0 && this.highlighted != null){
			var selectedType = this.highlighted.info.type;
			var searchQuery = {
					filterName: null,
					filterValue: null
			};

			switch(selectedType){
				case "artists" : {
					searchQuery.type = "songs";
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
			}
		}
 	}

 	// -------------------------------------------------------------------------------------------------------

 	GesmoUI.prototype.animate = function(){
 		//requestAnimationFrame(this.animate);
 		TWEEN.update();
 		this.render();
 	}

 	GesmoUI.prototype.render = function(){
 		this.renderer.render( this.scene, this.camera );
 	}

 	GesmoUI.prototype.addLabels = function(mesh){
		var nameMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
		var nameGeometry = new THREE.TextGeometry(mesh.info.name + " " + mesh.info.id, {
			size: 40,
			height: 0,
			bevelEnabled: false,
			font: titleFont,
			weigth: "normal"
		});

		var nameLabel = new THREE.Mesh(nameGeometry, nameMaterial);
		nameLabel.name = "label";
		mesh.add(nameLabel);

		nameLabel.position.x = nameLabel.position.x - 50;
		nameLabel.position.z = nameLabel.position.z + 10;
	}

	GesmoUI.prototype.assignTargets = function(type){
		this.targets.length = 0;
		var vector = new THREE.Vector3();
		switch(type){
			case "artists":{
				for ( var i = 0, l = this.libElements.length; i < l; i ++ ) {

					var object = this.libElements[ i ];

					var phi = Math.acos( -1 + ( 2 * i ) / l );
					var theta = Math.sqrt( l * Math.PI ) * phi;

					var itemGeom = new THREE.PlaneGeometry(1, 1);
					var itemMat = new THREE.MeshNormalMaterial();
					var itemMesh = new THREE.Mesh(itemGeom, itemMat);

					itemMesh.position.x = 2000 * Math.cos( theta ) * Math.sin( phi );
					itemMesh.position.y = 2000 * Math.sin( theta ) * Math.sin( phi );
					itemMesh.position.z = 2000 * Math.cos( phi );

					vector.copy( itemMesh.position ).multiplyScalar( 2 );

					itemMesh.lookAt( vector );

					this.targets.push( itemMesh );

				}
				break;
			}

			case "queue":{

				for ( var i = 0, l = this.libElements.length; i < l; i ++ ) {

					var object = this.libElements[ i ];

					var phi = i * 0.35 + Math.PI;

					var itemGeom = new THREE.PlaneGeometry(1, 1);
					var itemMat = new THREE.MeshNormalMaterial();
					var itemMesh = new THREE.Mesh(itemGeom, itemMat);

					itemMesh.position.x = 2000 * Math.sin( phi );
					itemMesh.position.y = - ( i * 64 ) + 2000;
					itemMesh.position.z = 2000 * Math.cos( phi );

					vector.copy( itemMesh.position );
					vector.x *= 2;
					vector.z *= 2;

					itemMesh.lookAt( vector );

					this.targets.push( itemMesh );

				}
				break;
			}

			case "songs":{

				for ( var i = 0; i < this.libElements.length; i ++ ) {

					var object = this.libElements[ i ];

					var itemGeom = new THREE.PlaneGeometry(1, 1);
					var itemMat = new THREE.MeshNormalMaterial();
					var itemMesh = new THREE.Mesh(itemGeom, itemMat);

					itemMesh.position.x = ( ( i % 5 ) * 800 ) - 1600;
					itemMesh.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 800 ) + 1200;
					itemMesh.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

					this.targets.push( itemMesh );

				}
				break;
			}
		}
	}

	GesmoUI.prototype.transform = function( targets, duration ) {

		TWEEN.removeAll();

		for ( var i = 0; i < this.libElements.length; i ++ ) {

			var object = this.libElements[ i ];
			var target = (targets.length) ? targets[i] : targets;

			new TWEEN.Tween( object.position )
				.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
				.easing( TWEEN.Easing.Exponential.InOut )
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
	}

	GesmoUI.prototype.highlightElement = function(element){
		element.currentHex = element.material.emissive.getHex();
		element.material.emissive.setHex(0xff0000);
	}

	GesmoUI.prototype.removeHighlight = function(element){
		element.material.emissive.setHex( element.currentHex );
	}

	GesmoUI.prototype.queueSong = function(item){
		var copy = item.clone();
		scene.add(copy);

		TWEEN.removeAll();

		var tween = new TWEEN.Tween( copy.position )
				.to( { x: ui_musicPlayer.position.x, y: ui_musicPlayer.position.y, z: ui_musicPlayer.position.z }, Math.random() * 1000 + 1000 )
				.easing( TWEEN.Easing.Exponential.InOut )
				.onComplete(function(){
					this.scene.remove(copy);
					// send a call to queue with copy.info.id as argument
				}.bind(this))
				.start();
	}

	GesmoUI.prototype.rotateLib = function(deltaMove){
		var deltaRotationQuaternion = new THREE.Quaternion()
				.setFromEuler(new THREE.Euler(
					toRadians(deltaMove.y * 1),
					toRadians(deltaMove.x * 1),
					0,
					'XYZ'
				));

		this.musicLibrary.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.musicLibrary.quaternion);
	}

	GesmoUI.prototype.translateMusicBox = function(deltaMove){
		// var speed = 0.3;
		// ui_musicBox.position.x += 0.1*deltaMove.x;
		// ui_musicBox.position.y += 0.1*deltaMove.y;
		// ui_musicBox.position.set(deltaMove);
	}

	GesmoUI.prototype.zoomMusicBox = function(deltaMove){
		this.musicBox.position.z = this.musicBox.position.z + deltaMove;
	}

	// helper functions --------------------------------------
	function toRadians(angle) {
		return angle * (Math.PI / 180);
	}

	function toDegrees(angle) {
		return angle * (180 / Math.PI);
	}
 }());