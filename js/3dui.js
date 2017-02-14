var camera, scene, renderer;

// only for mouse interaction-------
var raycaster, mouse;
var clock = new THREE.Clock();
var isLeftDragging = false;
var isRightDragging = false;
var previousMousePosition = {
	x: 0,
	y: 0
};
var tsOffset;
//----------------------------------
var dataController;
var searchQueue = [];

var navController;
var clock;
var leapController;
var gesmoController;

var ui_musicBox;
var ui_musicPlayer;
var ui_musicBoxBack;
var ui_musicBoxQ;
var libObject;
var libElements = [];
var targets = [];

var songQueue = [];

var titleFont, subTitleFont, descFont;

var highlighted;

var posSphere;

init();
//animate();

function init(){
	// create the scene
	scene = new THREE.Scene();

	// add camera to the scene
	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000);
	camera.position.z = 4800;
	camera.lookAt( scene.position );

	//add the music box and it's elements to the scene
	ui_musicBox = new THREE.Object3D();
	scene.add(ui_musicBox);

	//music box element - the player
	var geometry = new THREE.BoxGeometry( 5000, 800, 200 );
	var material = new THREE.MeshLambertMaterial( {color: 0x00ff00} );
	ui_musicPlayer = new THREE.Mesh( geometry, material );
	ui_musicBox.add( ui_musicPlayer );
	ui_musicPlayer.position.y = 3100;

	var gGeom = new THREE.BoxGeometry( 800, 250, 100);
	var gMat = new THREE.MeshLambertMaterial( { color: 0x0000fff});
	ui_musicBoxQ = new THREE.Mesh(gGeom, gMat);
	ui_musicPlayer.add(ui_musicBoxQ);
	ui_musicBoxQ.position.z =  ui_musicPlayer.position.z + 90;
	ui_musicBoxQ.position.y = ui_musicPlayer.position.y - 3650;
	ui_musicBoxQ.info = {
		type: "queue"
	};

	var bGeom = new THREE.BoxGeometry(400, 400, 10);
	var bMat = new THREE.MeshLambertMaterial({color: 0x00ff00});
	ui_musicBoxBack = new THREE.Mesh( bGeom, bMat);
	ui_musicBox.add( ui_musicBoxBack );
	ui_musicBoxBack.position.y = -3200;
	ui_musicBoxBack.info = {
		type: "back"
	};

	posSphere = new THREE.Mesh(new THREE.SphereGeometry(10), new THREE.MeshBasicMaterial(0x0000ff));
    scene.add(posSphere);

	var ambientLight = new THREE.AmbientLight( 0x555555 );
	scene.add(ambientLight);

	var lights = [];
	lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
	lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
	lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

	lights[ 0 ].position.set( 0, 0, 0 );
	//lights[ 1 ].position.set( 100, 200, 100 );
	//lights[ 2 ].position.set( - 100, - 200, - 100 );

	scene.add( lights[ 0 ] );
	//scene.add( lights[ 1 ] );
	//scene.add( lights[ 2 ] );

	//load the library to the scene
	libObject = new THREE.Object3D();
	ui_musicBox.add(libObject);

	// initialize data controller for fetching data 
	dataController = new DataController();

	// initialize navigation controller for navigating the scene
	// for mouse/keyboard interaction---------------------
	navController = new THREE.TrackballControls(camera);
	navController.noRotate = true;
	navController.noPan = true;
	clock = new THREE.Clock();
	mouse = new THREE.Vector2();
	var radius = 100, theta = 0;
	raycaster = new THREE.Raycaster();
	tsOffset = new THREE.Vector3();
	//----------------------------------------------------

	//load fonts
	highlighted = null;
	// fontLoader.load("fonts/LDFComicSans_Medium.json", function(font){
	// 	subTitleFont = font;
	// });

	// fontLoader.load("fonts/LDFComicSansLight_Light.json", function(font){
	// 	descFont = font;
	// });

	// create the renderer and attach it to html
	renderer = new THREE.WebGLRenderer( { alpha: 1, antialias: true, clearColor: 0x000000 } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.sortObjects = false;
	document.getElementById( 'container' ).appendChild( renderer.domElement );

	leapController = new Leap.Controller({ enableGestures: true })
		.use('transform', {
			position: new THREE.Vector3(0, 0, -400),
			effectiveParent: camera	
		})
		.use('riggedHand', {
			parent: scene,
			renderer: renderer,
			camera: camera,
			renderFn: function(){
				// for mouse interaction-----
				var delta = clock.getDelta();
				navController.update(delta);
				//---------------------------

				gesmoController.update();
				
				TWEEN.update();
				render();
			}
		}).connect();

	gesmoController = new THREE.GesmoControls(ui_musicBox, leapController, false, posSphere);	

	// window event listener
	window.addEventListener('resize', onWindowResize, false);

	// document event listeners for mouse events
	document.addEventListener('mousedown', onDocumentMouseDown, false);
	document.addEventListener('mouseup', onDocumentMouseUp, false);
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('click', onDocumentClick, false);
	
	// leap controller event listeners
	//leapController.on('frame', onFrame);
	//leapController.on('gesture', onGesture);

	var fontLoader = new THREE.FontLoader();
	fontLoader.load("fonts/helvetiker_bold.typeface.json", function(font){
		initFont("title", font);
		var searchQuery = {
			type: "artists",
			filterName: null,
			filterValue: null
		};
		fetchLibrary(searchQuery);
	});
}

function initFont(type, font){
	switch(type){
		case "title" : titleFont = font;
			break;
		case "subTitle" : subTitle = font;
			break;
		case "desc" : descFont = font;
			break;
	}
}

// function to load the music box
function createMusicBox(geom){
	var mat = new THREE.MeshLambertMaterial({color: 0x7777ff});
	// loadedMesh.children.forEach(function(child){
	// 	child.material = mat;
	// 	child.geometry.computeFaceNormals();
	// 	child.geometry.computeVertexNormals();
	// });
	// loadedMesh.scale.set(1, 1, 1);
    ui_musicPlayer = new THREE.Mesh(geom, mat);
    ui_musicBox.add(ui_musicPlayer);
    ui_musicPlayer.position.x = -3000;

    var fontLoader = new THREE.FontLoader();
	fontLoader.load("fonts/helvetiker_bold.typeface.json", function(font){
		initFont("title", font);
		var searchQuery = {
			type: "artists",
			filterName: null,
			filterValue: null
		};
		fetchLibrary(searchQuery);
	});
}

// function to load songlist ui
function fetchLibrary(searchQuery){
	if(libElements.length > 0){
		removeCurrentObjs();
	}

	searchQueue.push(searchQuery);
	dataController.fetchData(searchQuery, loadLibrary, onLoadFail);
}

function loadLibrary(type, data){
	for(var i = 0;i < data.length;i++){
		var itemMesh = createLibraryElements(data[i], type);

		itemMesh.position.x = ui_musicPlayer.position.x;
		itemMesh.position.y = ui_musicPlayer.position.y;
		itemMesh.position.z = ui_musicPlayer.position.z;

		libElements.push(itemMesh);
		libObject.add(itemMesh);
	}

	//scene.add(libObject);

	assignTargets(type);

	setTimeout(function(){ 
		transform(targets, 2000)
	}, 2000);
}

function onLoadFail(){

}

function removeCurrentObjs(){
	//transform(musicBox, 2000);
	for(var i = 0;i < libElements.length;i++){
		libObject.remove(libElements[i]);
	}
	libElements.length = 0;
}

function createLibraryElements(data, type){
	var itemGeom = new THREE.BoxGeometry(400, 400, 10);
	var itemMat = new THREE.MeshPhongMaterial({
		color: Math.random() * 0xffffff,
		specular : 0x111111,
		shininess: 30,
		side: THREE.DoubleSide
		// envMaps : envMapKeys,
		// map : textureMapKeys,
		// lightMap : textureMapKeys,
		// specularMap : textureMapKeys,
		// alphaMap : textureMapKeys
	});

	var itemMesh = new THREE.Mesh(itemGeom, itemMat);

	itemMesh.info = data;
	itemMesh.info.type = type;

	addLabels(itemMesh);
	return itemMesh;
}

function addLabels(mesh){
	var nameMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
	var nameGeometry = new THREE.TextGeometry(mesh.info.name + " " + mesh.info.id, {
		size: 40,
		height: 0,
		bevelEnabled: false,
		font: titleFont,
		weigth: "normal"
	});

	var nameLabel = new THREE.Mesh(nameGeometry, nameMaterial);
	mesh.add(nameLabel);

	var box = new THREE.Box3().setFromObject( nameLabel );
	//console.log( box.min, box.max, box.getSize() );
	
	nameLabel.position.x = nameLabel.position.x - 50;
	nameLabel.position.z = nameLabel.position.z + 10;
}

function assignTargets(type){
	targets.length = 0;
	var vector = new THREE.Vector3();
	switch(type){
		case "artists":{
			for ( var i = 0, l = libElements.length; i < l; i ++ ) {

				var object = libElements[ i ];

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

				targets.push( itemMesh );

			}
			break;
		}

		case "queue":{

			for ( var i = 0, l = libElements.length; i < l; i ++ ) {

				var object = libElements[ i ];

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

				targets.push( itemMesh );

			}
			break;
		}

		case "songs":{

			for ( var i = 0; i < libElements.length; i ++ ) {

				var object = libElements[ i ];

				var itemGeom = new THREE.PlaneGeometry(1, 1);
				var itemMat = new THREE.MeshNormalMaterial();
				var itemMesh = new THREE.Mesh(itemGeom, itemMat);

				itemMesh.position.x = ( ( i % 5 ) * 800 ) - 1600;
				itemMesh.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 800 ) + 1200;
				itemMesh.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

				targets.push( itemMesh );

			}
			break;
		}
	}
}

function transform( targets, duration ) {

	TWEEN.removeAll();

	for ( var i = 0; i < libElements.length; i ++ ) {

		var object = libElements[ i ];
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
		.onUpdate( render )
		.start();


	return this;
}

function highlightElement(element){
	highlighted.currentHex = highlighted.material.emissive.getHex();
	highlighted.material.emissive.setHex(0xff0000);
}

function removeHighlight(element){
	highlighted.material.emissive.setHex( highlighted.currentHex );
}

function queueSong(item){
	var copy = item.clone();
	scene.add(copy);

	TWEEN.removeAll();

	var tween = new TWEEN.Tween( copy.position )
			.to( { x: ui_musicPlayer.position.x, y: ui_musicPlayer.position.y, z: ui_musicPlayer.position.z }, Math.random() * 1000 + 1000 )
			.easing( TWEEN.Easing.Exponential.InOut )
			.onComplete(function(){
				scene.remove(copy);
				songQueue.push(copy);
			}.bind(this))
			.start();
}

function showQueue(){
	searchQueue.push({
		type: "queue",
		filterName: null,
		filterValue: null
	});
	if(songQueue.length > 0){
		if(libElements.length > 0){
		removeCurrentObjs();
		}

		for(var i = 0;i < songQueue.length;i++){
			var itemMesh = songQueue[i];

			itemMesh.position.x = ui_musicPlayer.position.x;
			itemMesh.position.y = ui_musicPlayer.position.y;
			itemMesh.position.z = ui_musicPlayer.position.z;

			libElements.push(itemMesh);
			libObject.add(itemMesh);
		}

		assignTargets("queue");

		setTimeout(function(){ 
			transform(targets, 2000)
		}, 2000);
	}
}

function onWindowResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

// for mouse interaction---------------------------------------------
function onDocumentMouseDown(event){
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		raycaster.setFromCamera( mouse, camera );
	
	if(event.button == 0){
		var objectsArray = [];
		objectsArray.push(ui_musicBoxBack);
		objectsArray.push(ui_musicBoxQ);
		for(var i = 0;i < libElements.length;i++){
			objectsArray.push(libElements[i]);
		}

		var intersects = raycaster.intersectObjects( objectsArray );

		if(intersects.length == 0){
			isLeftDragging = true;
		}	
	} else if(event.button == 2){
		var plane = new THREE.Plane();
		plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(plane.normal), ui_musicBox.position);

		var intersection = new THREE.Vector3();

		raycaster.ray.intersectPlane(plane, intersection);

		tsOffset.copy(intersection);

		isRightDragging = true;
	}
}

function onDocumentMouseMove(e){
	event.preventDefault();

	if(isLeftDragging){
		var deltaMove = {
			x: e.offsetX - previousMousePosition.x,
			y: e.offsetY - previousMousePosition.y
		}; 
		rotateLib(deltaMove);
	} else if(isRightDragging) {
		mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

		raycaster.setFromCamera( mouse, camera );

		var plane = new THREE.Plane();
		plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(plane.normal), ui_musicBox.position);

		var intersection = new THREE.Vector3();

		raycaster.ray.intersectPlane(plane, intersection);

		var delta = intersection.sub(tsOffset);
		tsOffset.copy(intersection);
	} else {
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		raycaster.setFromCamera( mouse, camera );
		var objectsArray = [];
		objectsArray.push(ui_musicBoxBack);
		objectsArray.push(ui_musicBoxQ);
		for(var i = 0;i < libElements.length;i++){
			objectsArray.push(libElements[i]);
		}

		var intersects = raycaster.intersectObjects( objectsArray );

		if ( intersects.length > 0 ) {

			if ( highlighted != intersects[0].object ) {

				if(highlighted != null) { removeHighlight(highlighted); }
				highlighted = intersects[0].object;
				highlightElement(highlighted);

			}
		} else {
			if(highlighted != null) { removeHighlight(highlighted); }
			highlighted = null;
		}
	}

	previousMousePosition = {
		x: e.offsetX,
		y: e.offsetY
	};
}

function onDocumentMouseUp(event){
	isLeftDragging = false;
	isRightDragging = false;
}

function onDocumentClick(event){
	//event.preventDefault();

	if(event.button == 0 && highlighted != null){
		if(highlighted.info.type == "queue"){
			showQueue();
		} else if(highlighted.info.type == "back"){
			if(searchQueue.length > 1){
				searchQueue.pop();
				fetchLibrary(searchQueue.pop());
			}
		} else {
			var selectedType = highlighted.info.type;
			var searchQuery = {
					filterName: null,
					filterValue: null
			};

			switch(selectedType){
				case "artists" : {
						searchQuery.type = "songs";
						fetchLibrary(searchQuery);
						break;
					}
				case "albums" : {
						searchQuery.type = "songs";
						fetchLibrary(searchQuery);
						break;
					}
				case "songs" : queueSong(highlighted);
					break;
			}
		}
	}
}
//-------------------------------------------------------------------

//for leap motion interaction----------------------------------------

function onFrame(frame){
	// console.log("Frame");
	// console.log(frame);
}

function onGesture(gesture){
	switch(gesture.type){
		case "swipe" : {
			var swipeDirec = gesture.direction;
			var deltaMove = {
				x: swipeDirec[0]*gesture.speed,
				y: swipeDirec[1]*gesture.speed
			};
			rotateLib(deltaMove);
			break;
		}
	}
}

//-------------------------------------------------------------------

function animate() {
	requestAnimationFrame( animate );
	
	// for mouse interaction-----
	var delta = clock.getDelta();
	navController.update(delta);
	//---------------------------
	
	TWEEN.update();
	render();
}

function render(){
	renderer.render( scene, camera );
}

// navigation functions - deltaMove is a vector
// comment - here we are using Vector2 but it can be Vector3 also
function rotateLib(deltaMove){
	var deltaRotationQuaternion = new THREE.Quaternion()
			.setFromEuler(new THREE.Euler(
				toRadians(deltaMove.y * 1),
				toRadians(deltaMove.x * 1),
				0,
				'XYZ'
			));

	libObject.quaternion.multiplyQuaternions(deltaRotationQuaternion, libObject.quaternion);
}

function translateMusicBox(deltaMove){
	// var speed = 0.3;
	// ui_musicBox.position.x += 0.1*deltaMove.x;
	// ui_musicBox.position.y += 0.1*deltaMove.y;
	// ui_musicBox.position.set(deltaMove);
}

function zoomMusicBox(deltaMove){
	ui_musicBox.position.z = ui_musicBox.position.z + deltaMove;
}

// helper functions --------------------------------------
function toRadians(angle) {
	return angle * (Math.PI / 180);
}

function toDegrees(angle) {
	return angle * (180 / Math.PI);
}
