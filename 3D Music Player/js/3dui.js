var camera, scene, renderer;

// only for mouse interaction-------
var raycaster, mouse;
var clock = new THREE.Clock();
//----------------------------------

var libElements = [];
var libObject;
var targets = [];
var searchQueue = [];

var dataController;
var navController;
var clock;

var musicBox;
var musicBoxBack;
var musicBoxQ;
var songQueue = [];

var titleFont, subTitleFont, descFont;

var highlighted;

init();
animate();

function init(){
	// create the scene
	scene = new THREE.Scene();

	// add camera to the scene
	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000);
	camera.position.z = 4800;
	camera.lookAt( scene.position );

	//add the music box to the scene
	var geometry = new THREE.BoxGeometry( 5000, 800, 200 );
	var material = new THREE.MeshLambertMaterial( {color: 0x00ff00} );
	musicBox = new THREE.Mesh( geometry, material );
	scene.add( musicBox );
	musicBox.position.y = 3100;
	var gGeom = new THREE.BoxGeometry( 800, 250, 100);
	var gMat = new THREE.MeshLambertMaterial( { color: 0x0000fff});
	musicBoxQ = new THREE.Mesh(gGeom, gMat);
	musicBox.add(musicBoxQ);
	musicBoxQ.position.z =  musicBox.position.z + 90;
	musicBoxQ.position.y = musicBox.position.y - 3650;
	musicBoxQ.info = {
		type: "queue"
	};

	var bGeom = new THREE.BoxGeometry(400, 400, 10);
	var bMat = new THREE.MeshLambertMaterial({color: 0x00ff00});
	musicBoxBack = new THREE.Mesh( bGeom, bMat);
	scene.add( musicBoxBack );
	musicBoxBack.position.y = -3200;
	musicBoxBack.info = {
		type: "back"
	};

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
	scene.add(libObject);

	// initialize data controller for fetching data 
	dataController = new DataController();

	// initialize navigation controller for navigating the scene
	// for mouse/keyboard interaction---------------------
	navController = new THREE.TrackballControls(camera);
	clock = new THREE.Clock();
	mouse = new THREE.Vector2();
	var radius = 100, theta = 0;
	raycaster = new THREE.Raycaster();
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

	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('click', onDocumentClick, false);

	window.addEventListener('resize', onWindowResize, false);

	//var loader = new THREE.PLYLoader();
	//loader.setPath("http://0.0.0.0:8000/models/");
	// loader.load('http://0.0.0.0:8000/models/Vinyl_01.ply', function(geom, mat){
	// 	console.log(geom);
	// 	console.log(mat);
	// 	// console.log('here 1');
	// 	// createMusicBox(geom);
	// }, function(arg){

	// }, function(arg1, arg2){
	// 	console.log(arg1);
	// 	console.log(arg2);
	// });

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
	console.log(geom);
	var mat = new THREE.MeshLambertMaterial({color: 0x7777ff});
	// loadedMesh.children.forEach(function(child){
	// 	child.material = mat;
	// 	child.geometry.computeFaceNormals();
	// 	child.geometry.computeVertexNormals();
	// });
	// loadedMesh.scale.set(1, 1, 1);
    musicBox = new THREE.Mesh(geom, mat);
    scene.add(musicBox);
    musicBox.position.x = -3000;

    console.log(musicBox);

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

		itemMesh.position.x = musicBox.position.x;
		itemMesh.position.y = musicBox.position.y;
		itemMesh.position.z = musicBox.position.z;

		libElements.push(itemMesh);
		libObject.add(itemMesh);
	}

	//scene.add(libObject);

	assignTargets(type);

	setTimeout(function(){ 
		transform(targets, 2000)
	}, 2000);

	//targets.length = 0;
}

function onLoadFail(){

}

function removeCurrentObjs(){
	console.log('here4');
	//transform(musicBox, 2000);
	for(var i = 0;i < libElements.length;i++){
		libObject.remove(libElements[i]);
	}
	libElements.length = 0;
	console.log('here5');
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

function onWindowResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

// for mouse interaction---------------------------------------------
function onDocumentMouseMove(event){
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera( mouse, camera );
	var objectsArray = [];
	objectsArray.push(musicBoxBack);
	objectsArray.push(musicBoxQ);
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

function onDocumentClick(event){
	event.preventDefault();

	if(highlighted != null){
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
						console.log('here');
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

function queueSong(item){
	var copy = item.clone();
	scene.add(copy);

	TWEEN.removeAll();

	var tween = new TWEEN.Tween( copy.position )
			.to( { x: musicBox.position.x, y: musicBox.position.y, z: musicBox.position.z }, Math.random() * 1000 + 1000 )
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

			itemMesh.position.x = musicBox.position.x;
			itemMesh.position.y = musicBox.position.y;
			itemMesh.position.z = musicBox.position.z;

			libElements.push(itemMesh);
			libObject.add(itemMesh);
		}

		//scene.add(libObject);

		assignTargets("queue");

		setTimeout(function(){ 
			transform(targets, 2000)
		}, 2000);
	}
}

function animate() {
	requestAnimationFrame( animate );
	
	// for mouse interaction-----
	var delta = clock.getDelta();
	navController.update(delta);
	//---------------------------
	
	TWEEN.update();
	render();
}

function highlightElement(element){
	highlighted.currentHex = highlighted.material.emissive.getHex();
	highlighted.material.emissive.setHex(0xff0000);
}

function removeHighlight(element){
	highlighted.material.emissive.setHex( highlighted.currentHex );
}

function render(){
	renderer.render( scene, camera );
}

