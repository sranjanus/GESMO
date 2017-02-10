var camera, scene, renderer;
var clock = new THREE.Clock();

var controller;
var controls;

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };

var posSphere;

init();

function init(){
	console.log(table);
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 5000);
	camera.position.z = 1800;

	for(var i = 0;i < table.length;i++){

		var itemGeom = new THREE.PlaneGeometry(100, 100);
		var itemMat = new THREE.MeshNormalMaterial();
		itemMat.side = THREE.DoubleSide;
		var itemMesh = new THREE.Mesh(itemGeom, itemMat);

		itemMesh.position.x = Math.random() * 4000 - 2000;
		itemMesh.position.y = Math.random() * 4000 - 2000;
		itemMesh.position.z = Math.random() * 4000 - 2000;

		objects.push( itemMesh );
		scene.add(itemMesh);

	}

	// table

	for ( var i = 0; i < table.length; i ++ ) {

		var item = table[ i ];

		var itemGeom = new THREE.PlaneGeometry(100, 100);
		var itemMat = new THREE.MeshNormalMaterial();
		var itemMesh = new THREE.Mesh(itemGeom, itemMat);

		itemMesh.position.x = ( item[ 3 ] * 160 ) - 1540;
		itemMesh.position.y = - ( item[ 4 ] * 200 ) + 1100;

		targets.table.push( itemMesh );

	}

	// sphere

	var vector = new THREE.Vector3();

	for ( var i = 0, l = objects.length; i < l; i ++ ) {

		var object = objects[ i ];

					var phi = Math.acos( -1 + ( 2 * i ) / l );
					var theta = Math.sqrt( l * Math.PI ) * phi;

					var itemGeom = new THREE.PlaneGeometry(100, 100);
					var itemMat = new THREE.MeshNormalMaterial();
					var itemMesh = new THREE.Mesh(itemGeom, itemMat);

					itemMesh.position.x = 1000 * Math.cos( theta ) * Math.sin( phi );
					itemMesh.position.y = 1000 * Math.sin( theta ) * Math.sin( phi );
					itemMesh.position.z = 1000 * Math.cos( phi );

					vector.copy( itemMesh.position ).multiplyScalar( 2 );

					itemMesh.lookAt( vector );

					targets.sphere.push( itemMesh );

				}

				// helix

				var vector = new THREE.Vector3();

				for ( var i = 0, l = objects.length; i < l; i ++ ) {

					var object = objects[ i ];

					var phi = i * 0.175 + Math.PI;

					var itemGeom = new THREE.PlaneGeometry(100, 100);
					var itemMat = new THREE.MeshNormalMaterial();
					var itemMesh = new THREE.Mesh(itemGeom, itemMat);

					itemMesh.position.x = 1100 * Math.sin( phi );
					itemMesh.position.y = - ( i * 8 ) + 450;
					itemMesh.position.z = 1100 * Math.cos( phi );

					vector.copy( itemMesh.position );
					vector.x *= 2;
					vector.z *= 2;

					itemMesh.lookAt( vector );

					targets.helix.push( itemMesh );

				}

				// grid

				for ( var i = 0; i < objects.length; i ++ ) {

					var object = objects[ i ];

					var itemGeom = new THREE.PlaneGeometry(100, 100);
					var itemMat = new THREE.MeshNormalMaterial();
					var itemMesh = new THREE.Mesh(itemGeom, itemMat);

					itemMesh.position.x = ( ( i % 5 ) * 400 ) - 800;
					itemMesh.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
					itemMesh.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

					targets.grid.push( itemMesh );

				}

				posSphere = new THREE.Mesh(new THREE.SphereGeometry(10), new THREE.MeshBasicMaterial(0x0000ff));
                scene.add(posSphere);

				renderer = new THREE.WebGLRenderer( { alpha: 1, antialias: true, clearColor: 0x000000 } );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.domElement.style.position = 'absolute';
				renderer.domElement.style.top = 0;
				document.getElementById( 'container' ).appendChild( renderer.domElement );

				controller = new Leap.Controller()
				.use('transform', {
					position: new THREE.Vector3(0, 0, -400),
					effectiveParent: camera
				})
				.use('riggedHand', {
				    parent: scene,
				    renderer: renderer,
				    //offset: new THREE.Vector3(0, 0, -400),
				    //positionScale: 2,
				    renderFn: function() {
				      renderer.render(scene, camera);
				      TWEEN.update();
				      return controls.update();
				    },
				    camera: camera,
				    checkWebGL: true
				});

				controller.connect();

				controls = new THREE.GesmoControls( camera, controller, scene, posSphere);
				controls.translationSpeed   = 10;
				controls.translationDecay   = 0.3;
				controls.scaleDecay         = 0.5;
				controls.rotationSlerp      = 0.8;
				controls.rotationSpeed      = 4;
				controls.pinchThreshold     = 0.75;
				controls.transSmoothing     = 0.1;
				controls.rotationSmoothing  = 0.2;

				var button = document.getElementById( 'table' );
				button.addEventListener( 'click', function ( event ) {

					transform( targets.table, 2000 );

				}, false );

				var button = document.getElementById( 'sphere' );
				button.addEventListener( 'click', function ( event ) {

					transform( targets.sphere, 2000 );

				}, false );

				var button = document.getElementById( 'helix' );
				button.addEventListener( 'click', function ( event ) {

					transform( targets.helix, 2000 );

				}, false );

				var button = document.getElementById( 'grid' );
				button.addEventListener( 'click', function ( event ) {

					transform( targets.grid, 2000 );

				}, false );

				transform( targets.sphere, 5000 );


				window.addEventListener('resize', onWindowResize, false);
			}

			function transform( targets, duration ) {

				TWEEN.removeAll();

				for ( var i = 0; i < objects.length; i ++ ) {

					var object = objects[ i ];
					var target = targets[ i ];

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

			}

			function onWindowResize(){
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize(window.innerWidth, window.innerHeight);
			}

			function animate() {

				requestAnimationFrame( animate );
				//render();
				controls.update();
				TWEEN.update();
				renderer.render( scene, camera );
			}

			function update(){
				var delta = clock.getDelta();
				var moveDistance = 200 * delta; // 200 pixels per second
				var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
				
				// local transformations

				// move forwards/backwards/left/right
				if ( keyboard.pressed("W") )
					hand.translateZ( -moveDistance );
				if ( keyboard.pressed("S") )
					hand.translateZ(  moveDistance );
				if ( keyboard.pressed("Q") )
					hand.translateX( -moveDistance );
				if ( keyboard.pressed("E") )
					hand.translateX(  moveDistance );	

				// rotate left/right/up/down
				var rotation_matrix = new THREE.Matrix4().identity();
				if ( keyboard.pressed("A") )
					hand.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
				if ( keyboard.pressed("D") )
					hand.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
				if ( keyboard.pressed("R") )
					hand.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
				if ( keyboard.pressed("F") )
					hand.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
				
				if ( keyboard.pressed("Z") )
				{
					hand.position.set(0,0,1800);
					hand.rotation.set(0,0,0);
				}
				
				var relativeCameraOffset = new THREE.Vector3(0,50,200);

				var cameraOffset = relativeCameraOffset.applyMatrix4( hand.matrixWorld );

				camera.position.x = cameraOffset.x;
				camera.position.y = cameraOffset.y;
				camera.position.z = cameraOffset.z;
				camera.lookAt( hand.position );
				
				camera.updateMatrix();
				camera.updateProjectionMatrix();
						
				stats.update();
			}

			function render() {

				renderer.render( scene, camera );

			}