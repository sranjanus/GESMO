var table = [
				[ "H", "Hydrogen", "1.00794", 1, 1 ],
				[ "He", "Helium", "4.002602", 18, 1 ],
				[ "Li", "Lithium", "6.941", 1, 2 ],
				[ "Be", "Beryllium", "9.012182", 2, 2 ],
				[ "B", "Boron", "10.811", 13, 2 ],
				[ "C", "Carbon", "12.0107", 14, 2 ],
				[ "N", "Nitrogen", "14.0067", 15, 2 ],
				[ "O", "Oxygen", "15.9994", 16, 2 ],
				[ "F", "Fluorine", "18.9984032", 17, 2 ],
				[ "Ne", "Neon", "20.1797", 18, 2 ],
				[ "Na", "Sodium", "22.98976...", 1, 3 ],
				[ "Mg", "Magnesium", "24.305", 2, 3 ],
				[ "Al", "Aluminium", "26.9815386", 13, 3 ],
				[ "Si", "Silicon", "28.0855", 14, 3 ],
				[ "P", "Phosphorus", "30.973762", 15, 3 ],
				[ "S", "Sulfur", "32.065", 16, 3 ],
				[ "Cl", "Chlorine", "35.453", 17, 3 ],
				[ "Ar", "Argon", "39.948", 18, 3 ],
				[ "K", "Potassium", "39.948", 1, 4 ],
				[ "Ca", "Calcium", "40.078", 2, 4 ],
				[ "Sc", "Scandium", "44.955912", 3, 4 ],
				[ "Ti", "Titanium", "47.867", 4, 4 ],
				[ "V", "Vanadium", "50.9415", 5, 4 ],
				[ "Cr", "Chromium", "51.9961", 6, 4 ],
				[ "Mn", "Manganese", "54.938045", 7, 4 ],
				[ "Fe", "Iron", "55.845", 8, 4 ],
				[ "Co", "Cobalt", "58.933195", 9, 4 ],
				[ "Ni", "Nickel", "58.6934", 10, 4 ],
				[ "Cu", "Copper", "63.546", 11, 4 ],
				[ "Zn", "Zinc", "65.38", 12, 4 ],
				[ "Ga", "Gallium", "69.723", 13, 4 ],
				[ "Ge", "Germanium", "72.63", 14, 4 ],
				[ "As", "Arsenic", "74.9216", 15, 4 ],
				[ "Se", "Selenium", "78.96", 16, 4 ],
				[ "Br", "Bromine", "79.904", 17, 4 ],
				[ "Kr", "Krypton", "83.798", 18, 4 ],
				[ "Rb", "Rubidium", "85.4678", 1, 5 ],
				[ "Sr", "Strontium", "87.62", 2, 5 ],
				[ "Y", "Yttrium", "88.90585", 3, 5 ],
				[ "Zr", "Zirconium", "91.224", 4, 5 ],
				[ "Nb", "Niobium", "92.90628", 5, 5 ],
				[ "Mo", "Molybdenum", "95.96", 6, 5 ],
				[ "Tc", "Technetium", "(98)", 7, 5 ],
				[ "Ru", "Ruthenium", "101.07", 8, 5 ],
				[ "Rh", "Rhodium", "102.9055", 9, 5 ],
				[ "Pd", "Palladium", "106.42", 10, 5 ],
				[ "Ag", "Silver", "107.8682", 11, 5 ],
				[ "Cd", "Cadmium", "112.411", 12, 5 ],
				[ "In", "Indium", "114.818", 13, 5 ],
				[ "Sn", "Tin", "118.71", 14, 5 ],
				[ "Sb", "Antimony", "121.76", 15, 5 ],
				[ "Te", "Tellurium", "127.6", 16, 5 ],
				[ "I", "Iodine", "126.90447", 17, 5 ],
				[ "Xe", "Xenon", "131.293", 18, 5 ],
				[ "Cs", "Caesium", "132.9054", 1, 6 ],
				[ "Ba", "Barium", "132.9054", 2, 6 ],
				[ "La", "Lanthanum", "138.90547", 4, 9 ],
				[ "Ce", "Cerium", "140.116", 5, 9 ],
				[ "Pr", "Praseodymium", "140.90765", 6, 9 ],
				[ "Nd", "Neodymium", "144.242", 7, 9 ],
				[ "Pm", "Promethium", "(145)", 8, 9 ],
				[ "Sm", "Samarium", "150.36", 9, 9 ],
				[ "Eu", "Europium", "151.964", 10, 9 ],
				[ "Gd", "Gadolinium", "157.25", 11, 9 ],
				[ "Tb", "Terbium", "158.92535", 12, 9 ],
				[ "Dy", "Dysprosium", "162.5", 13, 9 ],
				[ "Ho", "Holmium", "164.93032", 14, 9 ],
				[ "Er", "Erbium", "167.259", 15, 9 ],
				[ "Tm", "Thulium", "168.93421", 16, 9 ],
				[ "Yb", "Ytterbium", "173.054", 17, 9 ],
				[ "Lu", "Lutetium", "174.9668", 18, 9 ],
				[ "Hf", "Hafnium", "178.49", 4, 6 ],
				[ "Ta", "Tantalum", "180.94788", 5, 6 ],
				[ "W", "Tungsten", "183.84", 6, 6 ],
				[ "Re", "Rhenium", "186.207", 7, 6 ],
				[ "Os", "Osmium", "190.23", 8, 6 ],
				[ "Ir", "Iridium", "192.217", 9, 6 ],
				[ "Pt", "Platinum", "195.084", 10, 6 ],
				[ "Au", "Gold", "196.966569", 11, 6 ],
				[ "Hg", "Mercury", "200.59", 12, 6 ],
				[ "Tl", "Thallium", "204.3833", 13, 6 ],
				[ "Pb", "Lead", "207.2", 14, 6 ],
				[ "Bi", "Bismuth", "208.9804", 15, 6 ],
				[ "Po", "Polonium", "(209)", 16, 6 ],
				[ "At", "Astatine", "(210)", 17, 6 ],
				[ "Rn", "Radon", "(222)", 18, 6 ],
				[ "Fr", "Francium", "(223)", 1, 7 ],
				[ "Ra", "Radium", "(226)", 2, 7 ],
				[ "Ac", "Actinium", "(227)", 4, 10 ],
				[ "Th", "Thorium", "232.03806", 5, 10 ],
				[ "Pa", "Protactinium", "231.0588", 6, 10 ],
				[ "U", "Uranium", "238.02891", 7, 10 ],
				[ "Np", "Neptunium", "(237)", 8, 10 ],
				[ "Pu", "Plutonium", "(244)", 9, 10 ],
				[ "Am", "Americium", "(243)", 10, 10 ],
				[ "Cm", "Curium", "(247)", 11, 10 ],
				[ "Bk", "Berkelium", "(247)", 12, 10 ],
				[ "Cf", "Californium", "(251)", 13, 10 ],
				[ "Es", "Einstenium", "(252)", 14, 10 ],
				[ "Fm", "Fermium", "(257)", 15, 10 ],
				[ "Md", "Mendelevium", "(258)", 16, 10 ],
				[ "No", "Nobelium", "(259)", 17, 10 ],
				[ "Lr", "Lawrencium", "(262)", 18, 10 ],
				[ "Rf", "Rutherfordium", "(267)", 4, 7 ],
				[ "Db", "Dubnium", "(268)", 5, 7 ],
				[ "Sg", "Seaborgium", "(271)", 6, 7 ],
				[ "Bh", "Bohrium", "(272)", 7, 7 ],
				[ "Hs", "Hassium", "(270)", 8, 7 ],
				[ "Mt", "Meitnerium", "(276)", 9, 7 ],
				[ "Ds", "Darmstadium", "(281)", 10, 7 ],
				[ "Rg", "Roentgenium", "(280)", 11, 7 ],
				[ "Cn", "Copernicium", "(285)", 12, 7 ],
				[ "Uut", "Unutrium", "(284)", 13, 7 ],
				[ "Fl", "Flerovium", "(289)", 14, 7 ],
				[ "Uup", "Ununpentium", "(288)", 15, 7 ],
				[ "Lv", "Livermorium", "(293)", 16, 7 ],
				[ "Uus", "Ununseptium", "(294)", 17, 7 ],
				[ "Uuo", "Ununoctium", "(294)", 18, 7 ]
			];

			var camera, scene, renderer;
			var geometry, material, mesh;
			var keyboard = new THREEx.KeyboardState();
			var clock = new THREE.Clock();

			var controls;

			var objects = [];
			var targets = { table: [], sphere: [], helix: [], grid: [] };

			var hand;

			init();
			animate();


			function init(){
				stats = new Stats();
				stats.domElement.style.cssText = 'position: absolute; right: 0; top: 0; z-index: 100;';
				document.body.appendChild( stats.domElement );

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 5000);
				camera.position.z = 1800;

				var handGeom = new THREE.BoxGeometry(10, 10, 10);
				var handMat = new THREE.MeshNormalMaterial();
				handMat.side = THREE.DoubleSide;
				hand = new THREE.Mesh(handGeom, handMat);
				hand.position.set(0, 0, 1000);
				scene.add(hand);

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

				renderer = new THREE.WebGLRenderer( { alpha: 1, antialias: true, clearColor: 0x000000 } );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.domElement.style.position = 'absolute';
				renderer.domElement.style.top = 0;
				document.getElementById( 'container' ).appendChild( renderer.domElement );

				controls = new THREE.TrackballControls( camera, renderer.domElement );
				controls.rotateSpeed = 0.5;
				controls.addEventListener( 'change', render );

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

				transform( targets.table, 5000 );


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
				render();
				update();
				TWEEN.update();
				controls.update();

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