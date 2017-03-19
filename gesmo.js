			var camera, scene, renderer;
			var clock = new THREE.Clock();

			var controller;
			var controls;

			var objects = [];
			var mTargets = [];
			var targets = [];

			var posSphere;
			var musicBox;

			init();
			//animate();


			function init(){
				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 5000);
				camera.position.z = 1800;

				var geometry = new THREE.BoxGeometry( 400, 400, 400 );
				var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
				musicBox = new THREE.Mesh( geometry, material );

				scene.add( musicBox );

				for(var i = 0;i < artists.length;i++){

					var item = artists[ i ];

					var itemGeom = new THREE.PlaneGeometry(100, 100);
					var itemMat = new THREE.MeshNormalMaterial();
					itemMat.side = THREE.DoubleSide;
					var itemMesh = new THREE.Mesh(itemGeom, itemMat);

					var itemGeom1 = new THREE.PlaneGeometry(100, 100);
					var itemMat1 = new THREE.MeshNormalMaterial();
					var itemMesh1 = new THREE.Mesh(itemGeom, itemMat);


					itemMesh.position.x = itemMesh1.position.x = musicBox.position.x;
					itemMesh.position.y = itemMesh1.position.y = musicBox.position.y;
					itemMesh.position.z = itemMesh1.position.z = musicBox.position.z;

					objects.push( itemMesh );
					musicBox.add(itemMesh);
					mTargets.push(itemMesh1);

				}

				// artist
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

					targets.push( itemMesh );

				}

				posSphere = new THREE.Mesh(new THREE.SphereGeometry(10), new THREE.MeshBasicMaterial(0x0000ff));
                scene.add(posSphere);

				renderer = new THREE.WebGLRenderer( { alpha: 1, antialias: true, clearColor: 0x000000 } );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.domElement.style.position = 'absolute';
				renderer.domElement.style.top = 0;
				document.getElementById( 'container' ).appendChild( renderer.domElement );

				controller = new Leap.Controller({enableGestures: true})
				.use('transform', {
					position: new THREE.Vector3(0, 0, -400),
					effectiveParent: camera
				})
				.use('riggedHand', {
				    parent: scene,
				    renderer: renderer,
				    renderFn: function() {
				      renderer.render(scene, camera);
				      TWEEN.update();
				      return controls.update();
				    },
				    camera: camera,
				    checkWebGL: true
				});

				controller.connect();

				controls = new THREE.GesmoControls( musicBox, controller, false, posSphere);
				controls.translationSpeed   = 10;
				controls.translationDecay   = 0.3;
				controls.scaleDecay         = 0.5;
				controls.rotationSlerp      = 0.8;
				controls.rotationSpeed      = 4;
				controls.pinchThreshold     = 0.9;
				controls.transSmoothing     = 0.1;
				controls.rotationSmoothing  = 0.2;

				var button = document.getElementById( 'artists' );
				button.addEventListener( 'click', function ( event ) {
					//transform( mTargets, 2000);
					
					removeObjects();

					objects.length = 0;
					targets.length = 0;
					mTargets.length = 0;

					for(var i = 0;i < artists.length;i++){

						var item = artists[ i ];

						var itemGeom = new THREE.PlaneGeometry(100, 100);
						var itemMat = new THREE.MeshNormalMaterial();
						itemMat.side = THREE.DoubleSide;
						var itemMesh = new THREE.Mesh(itemGeom, itemMat);

						var itemGeom1 = new THREE.PlaneGeometry(100, 100);
						var itemMat1 = new THREE.MeshNormalMaterial();
						var itemMesh1 = new THREE.Mesh(itemGeom, itemMat);


						itemMesh.position.x = itemMesh1.position.x = musicBox.position.x;
						itemMesh.position.y = itemMesh1.position.y = musicBox.position.y;
						itemMesh.position.z = itemMesh1.position.z = musicBox.position.z;

						objects.push( itemMesh );
						musicBox.add(itemMesh);
						mTargets.push(itemMesh1);

					}

					// artist
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

						targets.push( itemMesh );

					}

					transform( targets, 2000 );
				}, false );

				var button = document.getElementById( 'albums' );
				button.addEventListener( 'click', function ( event ) {
					//transform( mTargets, 2000);
					
					removeObjects();

					objects.length = 0;
					targets.length = 0;
					mTargets.length = 0;
					
					for(var i = 0;i < albums.length;i++){

						var item = albums[ i ];

						var itemGeom = new THREE.PlaneGeometry(100, 100);
						var itemMat = new THREE.MeshNormalMaterial();
						itemMat.side = THREE.DoubleSide;
						var itemMesh = new THREE.Mesh(itemGeom, itemMat);

						var itemGeom1 = new THREE.PlaneGeometry(100, 100);
						var itemMat1 = new THREE.MeshNormalMaterial();
						var itemMesh1 = new THREE.Mesh(itemGeom, itemMat);


						itemMesh.position.x = itemMesh1.position.x = musicBox.position.x;
						itemMesh.position.y = itemMesh1.position.y = musicBox.position.y;
						itemMesh.position.z = itemMesh1.position.z = musicBox.position.z;

						objects.push( itemMesh );
						musicBox.add(itemMesh);
						mTargets.push(itemMesh1);

					}

					// albums

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

						targets.push( itemMesh );

					}

					transform( targets, 2000 );

				}, false );

				var button = document.getElementById( 'songs' );
				button.addEventListener( 'click', function ( event ) {
					//transform( mTargets, 2000);
					
					removeObjects();

					objects.length = 0;
					targets.length = 0;
					mTargets.length = 0;
					
					for(var i = 0;i < songs.length;i++){

						var item = songs[ i ];

						var itemGeom = new THREE.PlaneGeometry(100, 100);
						var itemMat = new THREE.MeshNormalMaterial();
						itemMat.side = THREE.DoubleSide;
						var itemMesh = new THREE.Mesh(itemGeom, itemMat);

						var itemGeom1 = new THREE.PlaneGeometry(100, 100);
						var itemMat1 = new THREE.MeshNormalMaterial();
						var itemMesh1 = new THREE.Mesh(itemGeom, itemMat);


						itemMesh.position.x = itemMesh1.position.x = musicBox.position.x;
						itemMesh.position.y = itemMesh1.position.y = musicBox.position.y;
						itemMesh.position.z = itemMesh1.position.z = musicBox.position.z;

						objects.push( itemMesh );
						musicBox.add(itemMesh);
						mTargets.push(itemMesh1);

					}

					// songs

					for ( var i = 0; i < objects.length; i ++ ) {

						var object = objects[ i ];

						var itemGeom = new THREE.PlaneGeometry(100, 100);
						var itemMat = new THREE.MeshNormalMaterial();
						var itemMesh = new THREE.Mesh(itemGeom, itemMat);

						itemMesh.position.x = ( ( i % 5 ) * 400 ) - 800;
						itemMesh.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
						itemMesh.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

						targets.push( itemMesh );

					}

					transform( targets, 2000 );

				}, false );

				var button = document.getElementById( 'queue' );
				button.addEventListener( 'click', function ( event ) {
					//transform( mTargets, 2000);
					
					removeObjects();

					objects.length = 0;
					targets.length = 0;
					mTargets.length = 0;
					
					for(var i = 0;i < queue.length;i++){

						var item = queue[ i ];

						var itemGeom = new THREE.PlaneGeometry(100, 100);
						var itemMat = new THREE.MeshNormalMaterial();
						itemMat.side = THREE.DoubleSide;
						var itemMesh = new THREE.Mesh(itemGeom, itemMat);

						var itemGeom1 = new THREE.PlaneGeometry(100, 100);
						var itemMat1 = new THREE.MeshNormalMaterial();
						var itemMesh1 = new THREE.Mesh(itemGeom, itemMat);


						itemMesh.position.x = itemMesh1.position.x = musicBox.position.x;
						itemMesh.position.y = itemMesh1.position.y = musicBox.position.y;
						itemMesh.position.z = itemMesh1.position.z = musicBox.position.z;

						objects.push( itemMesh );
						musicBox.add(itemMesh);
						mTargets.push(itemMesh1);

					}

					// queue

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

						targets.push( itemMesh );
					}


					transform( targets, 2000 );

				}, false );

				transform( targets, 5000 );

				window.addEventListener('resize', onWindowResize, false);
				window.addEventListener('gesmo.controls.pick', onTryPick, false);
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


					return this;
			}

			function onWindowResize(){
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize(window.innerWidth, window.innerHeight);
			}

			function onTryPick(e){
				objects.forEach(function(obj){
					var point = e.detail.position;
					if(obj.geometry.boundingSphere.containsPoint(point)){
						//console.log(obj);
					}
				});
			}

			function animate() {

				requestAnimationFrame( animate );
				controls.update();
				TWEEN.update();
				render();
			}

			function render(){
				renderer.render( scene, camera );
			}

			function removeObjects(){
				for ( var i = 0; i < objects.length; i ++ ) {
						musicBox.remove(objects[i]);
				}
			}