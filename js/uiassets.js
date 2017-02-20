GESMO.Island = function(topRadius, botRadius, height) {
	this.mesh = new THREE.Object3D();
	this.mesh.name = "island";

	var geom = new THREE.CylinderGeometry(topRadius, botRadius, height, 10, 5);
	geom.mergeVertices();
	var l = geom.vertices.length;
	for(var i = l/2;i < l;i++){
		var vert = geom.vertices[i];
		vert.x += 500 + Math.random()*900;
		vert.z += -500 - Math.random()*900;
	}
	var mat = new THREE.MeshLambertMaterial({
		color: 0x23190f,
		shading: THREE.FlatShading
	});
	var trunk = new THREE.Mesh(geom, mat);
	this.mesh.add(trunk);
	
	var nProtrusions = 3 + Math.random()*6;
	for(var i = 0; i < nProtrusions;i++){
		var pGeom = new THREE.CylinderGeometry(Math.random()*(topRadius - 3000) + 1500, Math.random()*(botRadius - 100) + 100, height/Math.floor(Math.random()*2 + 1), 10, 5);
		var portrusion = new THREE.Mesh(pGeom, mat);
		portrusion.position.x += 200 + Math.random()*400;
		portrusion.position.y -= 200 + Math.random()*400;
		//portrusion.rotation.z = -Math.random()*Math.PI/16;
		this.mesh.add(portrusion);
	}

	this.mesh.receiveShadow = true;
};

GESMO.Water = function(radius){
	var geom = new THREE.CylinderGeometry(radius, radius, 150, 10, 5);
	geom.mergeVertices();
	this.waves = [];
	for(var i = 0;i < geom.vertices.length;i++){
		var v = geom.vertices[i];
		this.waves.push({y: v.y,
 						 x: v.x,
 						 z: v.z,
 						 ang: Math.random()*Math.PI*2,
 						 amp: 5 + Math.random()*50,
 						 speed: 0.016 + Math.random()*0.032
 						});
	}

	this.mesh = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({
		color: 0x6092c1,
		shading: THREE.FlatShading,
		transparent: true,
		opacity: 0.9,
		side: THREE.DoubleSide
	}));

	//this.mesh.rotation.x = -Math.PI/2;
	//this.mesh.position.y = 0;
	this.mesh.receiveShadow = true;
	this.mesh.name = "water";

	this.moveWaves = function(){
 		var verts = this.mesh.geometry.vertices;
 		var l = verts.length;
 		for(var i = 0;i < l;i++){
 			var v = verts[i];

 			var vprops = this.waves[i];

 			v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
 			v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;

 			vprops.ang += vprops.speed;
 		}

 		this.mesh.geometry.verticesNeedUpdate = true;
 	}
}

GESMO.GrassyTerrain = function(radius){
	var geom = new THREE.CylinderGeometry(radius, radius, 150, 10, 20);
	geom.mergeVertices();
	for (var i = 0; i < geom.vertices.length; i++) {
	    var vertex = geom.vertices[i];

	    var theta = Math.random()*Math.PI/8;

	    vertex.z += 100*Math.sin(theta);
	    vertex.x += 100*Math.cos(theta);
	}

	  geom.computeFaceNormals();
	  geom.computeVertexNormals();
	  this.mesh = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({
	    color: GESMO.Colors.greenDark,
	    shading: THREE.FlatShading,
	    side: THREE.DoubleSide
	  }));
	  //this.mesh.rotation.x = -Math.PI / 2;
	  //this.mesh.position.y = -14;
	  this.mesh.receiveShadow = true;
	  this.mesh.castShadow = true;
	  this.mesh.name = "grass"
}

GESMO.Pilot =function(){
 	this.mesh = new THREE.Object3D();
 	this.mesh.name = "pilot";

 	this.angleHairs = 0;

 	// Create the body
 	var bodyGeom = new THREE.BoxGeometry(15, 15, 15);
 	var bodyMat = new THREE.MeshPhongMaterial({ color: GESMO.Colors.brown, shading:THREE.FlatShading});
 	var body = new THREE.Mesh(bodyGeom, bodyMat);
 	body.position.set(2, -12, 0);
 	this.mesh.add(body);

 	// Create the face
 	var faceGeom = new THREE.BoxGeometry(10, 10, 10);
 	var faceMat = new THREE.MeshLambertMaterial({color: GESMO.Colors.pink});
 	var face = new THREE.Mesh(faceGeom, faceMat);
 	this.mesh.add(face);

 	// Create the hair
 	var hairGeom = new THREE.BoxGeometry(4, 4, 4);
 	var hairMat = new THREE.MeshLambertMaterial({color: GESMO.Colors.brown});
 	var hair = new THREE.Mesh(hairGeom, hairMat);

 	hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0));
 	
 	var hairs = new THREE.Object3D();
 	this.hairsTop = new THREE.Object3D();
 	for(var i = 0;i < 12;i++){
 		var h = hair.clone();
 		var col = i%3;
 		var row = Math.floor(i/3);
 		var startPosZ = -4;
 		var startPosX = -4;
 		h.position.set(startPosX + row*4, 0, startPosZ + col*4);
 		this.hairsTop.add(h);
 	}
 	hairs.add(this.hairsTop);

 	var hairSideGeom = new THREE.BoxGeometry(12, 4, 2);
 	hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6, 0, 0));
 	var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
 	var hairSideL = hairSideR.clone();
 	hairSideR.position.set(8, -2, 6);
 	hairSideL.position.set(8, -2, -6);
 	hairs.add(hairSideR);
 	hairs.add(hairSideL);

 	var hairBackGeom = new THREE.BoxGeometry(2, 8, 10);
 	var hairBack = new THREE.Mesh(hairBackGeom, hairMat);
 	hairBack.position.set(-1, -4, 0);
 	hairs.add(hairBack);
 	hairs.position.set(-5, 5, 0);

 	this.mesh.add(hairs);

 	var glassGeom = new THREE.BoxGeometry(5, 5, 5);
 	var glassMat = new THREE.MeshLambertMaterial({ color: GESMO.Colors.brown});
 	var glassR = new THREE.Mesh(glassGeom, glassMat);
 	glassR.position.set(6, 0, 3);
 	var glassL = glassR.clone();
 	glassL.position.z = -glassR.position.z;

 	var glassAGeom = new THREE.BoxGeometry(11, 1, 11);
 	var glassA = new THREE.Mesh(glassAGeom, glassMat);
 	this.mesh.add(glassR);
 	this.mesh.add(glassL);
 	this.mesh.add(glassA);

 	var camPointGeom = new THREE.BoxGeometry(1, 1, 1);
 	this.camPoint = new THREE.Mesh(camPointGeom, glassMat);
 	this.camPoint.position.set(6, 0, 0);
 	this.mesh.add(this.camPoint);

 	var earGeom = new THREE.BoxGeometry(2, 3, 2);
 	var earL = new THREE.Mesh(earGeom, faceMat);
 	earL.position.set(0, 0, -6);
 	var earR = earL.clone();
 	earR.position.set(0, 0, 6);
 	this.mesh.add(earL);
 	this.mesh.add(earR);

 	var hmdGeom = new THREE.BoxGeometry(1,2,10, 1, 1, 1);
 	var hmdMat = new THREE.MeshPhongMaterial({color: GESMO.Colors.white, transparent: true, opacity:0.8, shading:THREE.FlatShading});
 	this.hmd = new THREE.Mesh(hmdGeom, hmdMat);
 	this.hmd.position.set(15, 4, 0);
 	this.hmd.castShadow = true;
 	this.hmd.receiveShadow = true;
 	this.hmd.scale.x = 0.1;
 	this.mesh.add(this.hmd);


 	this.updateHairs = function(){
 		var hairs = this.hairsTop.children;
 		var l = hairs.length;
 		for(var i = 0;i < l;i++){
 			var h = hairs[i];
 			h.scale.y = 0.75 + Math.cos(this.angleHairs+i/3)*0.25;
 		}

 		this.angleHairs += 0.16;
 	}
 };

 GESMO.Airplane = function(){
 	this.mesh = new THREE.Object3D();
 	this.mesh.name = "airplane";

 	//Create the cabin
 	var geomCockpit = new THREE.BoxGeometry(60, 40, 30, 1, 1, 1);
 	var matCockpit = new THREE.MeshPhongMaterial({color: GESMO.Colors.red, shading: THREE.FlatShading});
 	
 	geomCockpit.vertices[4].y -= 10;
 	geomCockpit.vertices[4].z += 20;
 	geomCockpit.vertices[5].y -= 10;
 	geomCockpit.vertices[5].z -= 20;
 	geomCockpit.vertices[6].y += 30;
 	geomCockpit.vertices[6].z += 20;
 	geomCockpit.vertices[7].y += 30;
 	geomCockpit.vertices[7].z -= 20;

 	var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
 	cockpit.castShadow = true;
 	cockpit.receiveShadow = true;
 	this.mesh.add(cockpit);

 	// Create the engine
 	var geomEngine = new THREE.BoxGeometry(20, 40, 30, 1, 1, 1);
 	
 	geomEngine.vertices[0].y -= 10;
 	geomEngine.vertices[0].z -= 10;
 	geomEngine.vertices[1].y -= 10;
 	geomEngine.vertices[1].z += 10;
 	geomEngine.vertices[2].y += 10;
 	geomEngine.vertices[2].z -= 10;
 	geomEngine.vertices[3].y += 10;
 	geomEngine.vertices[3].z += 10;

 	var matEngine = new THREE.MeshPhongMaterial({ color: GESMO.Colors.white, shading: THREE.FlatShading});
 	var engine = new THREE.Mesh(geomEngine, matEngine);
 	engine.position.x = 40;
 	engine.castShadow = true;
 	engine.receiveShadow = true;
 	this.mesh.add(engine);

 	// Create the tail
 	var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
 	var matTailPlane = new THREE.MeshPhongMaterial({color: GESMO.Colors.red, shading: THREE.FlatShading});
 	var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
 	tailPlane.position.set(-40, 20, 0);
 	tailPlane.castShadow = true;
 	tailPlane.receiveShadow = true;
 	this.mesh.add(tailPlane);

 	// Create the wing
 	var geomSideWing = new THREE.BoxGeometry(30, 5, 120, 1, 1, 1);
 	var matSideWing = new THREE.MeshPhongMaterial({color: GESMO.Colors.red, shading: THREE.FlatShading});
 	var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
 	sideWing.position.set(0, 15, 0);
 	sideWing.castShadow = true;
 	sideWing.receiveShadow = true;
 	this.mesh.add(sideWing);

 	var geomWindshield = new THREE.BoxGeometry(1,20,20, 1, 1, 1);
 	var matWindshield = new THREE.MeshPhongMaterial({color: GESMO.Colors.white, transparent: true, opacity:0.3, shading:THREE.FlatShading});

 	// Create the propeller
 	var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
 	geomPropeller.vertices[4].y -= 5;
 	geomPropeller.vertices[4].z += 5;
 	geomPropeller.vertices[5].y -= 5;
 	geomPropeller.vertices[5].z -= 5;
 	geomPropeller.vertices[6].y += 5;
 	geomPropeller.vertices[6].z += 5;
 	geomPropeller.vertices[7].y += 5;
 	geomPropeller.vertices[7].z -= 5; 
 	var matPropeller = new THREE.MeshPhongMaterial({color: GESMO.Colors.brown, shading: THREE.FlatShading});
 	this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
 	this.propeller.castShadow = true;
 	this.propeller.receiveShadow = true;

 	// Create the blades
 	var geomBlade = new THREE.BoxGeometry(1, 80, 10, 1, 1, 1)
 	var matBlade = new THREE.MeshPhongMaterial({color: GESMO.Colors.brownDark, shading: THREE.FlatShading});
 	
 	this.blade1 = new THREE.Mesh(geomBlade, matBlade);
 	this.blade1.position.set(8, 0, 0);
 	this.blade1.castShadow = true;
 	this.blade1.receiveShadow = true;

 	this.blade2 = this.blade1.clone();
 	this.blade2.rotation.x = Math.PI/2;
 	this.blade2.castShadow = true;
 	this.blade2.receiveShadow = true;

 	// Add the blades to propeller
 	this.propeller.add(this.blade1);
 	this.propeller.add(this.blade2);
 	this.propeller.position.set(60, 0, 0);
 	this.mesh.add(this.propeller);

 	// Create the wheels
 	var wheelProtecGeom = new THREE.BoxGeometry(30, 15, 10, 1, 1, 1);
 	var wheelProtecMat = new THREE.MeshPhongMaterial({color: GESMO.Colors.red, shading:THREE.FlatShading});
	var wheelProtecR = new THREE.Mesh(wheelProtecGeom, wheelProtecMat);
	wheelProtecR.position.set(25, -20, 25);
	this.mesh.add(wheelProtecR);

	var wheelTireGeom = new THREE.BoxGeometry(24, 24, 4);
	var wheelTireMat = new THREE.MeshPhongMaterial({color: GESMO.Colors.brownDark, shading:THREE.FlatShading});
	var wheelTireR = new THREE.Mesh(wheelTireGeom, wheelTireMat);
	wheelTireR.position.set(25, -28, 25);

	var wheelAxisGeom = new THREE.BoxGeometry(10, 10, 6);
	var wheelAxisMat = new THREE.MeshPhongMaterial({color: GESMO.Colors.brown, shading: THREE.FlatShading});
	var wheelAxis = new THREE.Mesh(wheelAxisGeom, wheelAxisMat);
	wheelTireR.add(wheelAxis); 	

	this.mesh.add(wheelTireR);

	var wheelProtecL = wheelProtecR.clone();
	wheelProtecL.position.z = -wheelProtecR.position.z;
	this.mesh.add(wheelProtecL);

	var wheelTireL = wheelTireR.clone();
	wheelTireL.position.z = -wheelTireR.position.z;
	this.mesh.add(wheelTireL);

	var wheelTireB = wheelTireR.clone();
	wheelTireB.scale.set(0.5, 0.5, 0.5);
	wheelTireB.position.set(-35, -5, 0);
	this.mesh.add(wheelTireB);

	var suspensionGeom = new THREE.BoxGeometry(4, 20, 4);
	suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 10, 0));
	var suspensionMat = new THREE.MeshPhongMaterial({color: GESMO.Colors.red, shading: THREE.FlatShading});
	var suspension = new THREE.Mesh(suspensionGeom, suspensionMat);
	suspension.position.set(-35, -5, 0);
	suspension.rotation.z = -0.3;
	this.mesh.add(suspension);

	this.mesh.castShadow = true;
	this.mesh.receiveShadow = true;

	this.buttons = {};
	var btnGeom = new THREE.BoxGeometry(2, 3, 1);
 	var btnMat = new THREE.MeshPhongMaterial({color: GESMO.Colors.white, transparent: true, opacity:0.3, shading:THREE.FlatShading});
 	var btn =  new THREE.Mesh(geomWindshield, matWindshield);
 	btn.position.set(28, 20, -10);
 	btn.scale.set(0.1, 0.1, 0.1);
 	btn.rotation.z = -Math.PI/2;
 	this.buttons.back = btn;
 	this.mesh.add(btn);

 	var btn1 = btn.clone();
 	btn1.position.set(28, 20, -6);
 	this.buttons.home = btn1;
 	this.mesh.add(btn1);

 	var btn2 = btn.clone();
 	btn2.position.set(28, 20, -2);
 	this.buttons.queue = btn2;
 	this.mesh.add(btn2);

 	var slotcoveringGeom = new THREE.BoxGeometry(3, 1, 2);
 	var slotcoveringMat = new THREE.MeshPhongMaterial({
 		color: GESMO.Colors.brownDark,
 		shading: THREE.FlatShading
 	});
 	var slotcovering = new THREE.Mesh(slotcoveringGeom, slotcoveringMat);
 	slotcovering.position.set(28, 20, 2);
 	slotcovering.scale.y = 0.3;
 	this.mesh.add(slotcovering);

 	var slotGeom = new THREE.BoxGeometry(3, 1, 1);
 	var slotMat = new THREE.MeshPhongMaterial({
 		color: GESMO.Colors.red,
 		shading: THREE.FlatShading
 	});
 	this.slot = new THREE.Mesh(slotGeom, slotMat);
 	this.slot.position.set(28, 20, 2);
 	this.slot.scale.x = 0.8;
 	this.slot.scale.y = 0.4;
 	this.mesh.add(this.slot);

 	var btn4 = btn.clone();
 	btn4.position.set(28, 20, 6);
 	this.buttons.fly = btn4;
 	this.mesh.add(btn4);

 	var btn5 = btn.clone();
 	btn5.position.set(28, 20, 10);
 	this.buttons.land = btn5;
 	this.mesh.add(btn5);

	this.movePropeller = false;
	this.blade1.scale.set(0.1, 0.1, 0.1);
	this.blade2.scale.set(0.1, 0.1, 0.1);
	
	this.startAirplane = function(){
		new TWEEN.Tween(this.blade1.scale)
			.to({ x: 1, y:1, z:1}, 100)
			.easing(TWEEN.Easing.Exponential.InOut)
			.start();

		new TWEEN.Tween(this.blade2.scale)
			.to({ x: 1, y:1, z:1}, 100)
			.easing(TWEEN.Easing.Exponential.InOut)
			.start();
		this.movePropeller = true;
	}

	this.stopAirplane = function(){
		this.movePropeller = false;
		new TWEEN.Tween(this.blade1.scale)
			.to({ x: 0.1, y:0.1, z:0.1}, 100)
			.easing(TWEEN.Easing.Exponential.InOut)
			.start();

		new TWEEN.Tween(this.blade2.scale)
			.to({ x: 0.1, y:0.1, z:0.1}, 100)
			.easing(TWEEN.Easing.Exponential.InOut)
			.start();
	},

	this.updatePlane= function(){
	 	if(this.airplane.movePropeller){
	 		this.airplane.propeller.rotation.x += 0.3;
	 	}
	}
 };

 GESMO.SpaceDebris= function(env){
	this.nClouds = 40;
 	var stepAngle = Math.PI/this.nClouds*2;
 	this.clouds = [];

	var geom = new THREE.BoxGeometry(50, 50, 5);

 	for (var j = 0;j < this.nClouds;j++){
 		var b = stepAngle*j;
 		var t = 5250 + Math.random()*1000;
	 	for(var i = 0;i < this.nClouds;i++){
	 		var a = stepAngle*i;
		 	var h = 5250 + Math.random()*1000;
	 		for(var k = 0;k < 3;k++){
	 			var mat = new THREE.MeshPhongMaterial({
						color: Math.random() * 0xffffff - 0x110000,
						shading: THREE.FlatShading
				});
			 	var m = new THREE.Mesh(geom.clone(), mat);
			 	var s = 0.1 + Math.random()*0.4;
	 			m.scale.set(s, s, s);

	 			m.castShadow = true;
	 			m.receiveShadow = true;
		 		
		 		m.position.y = Math.sin(a)*h*Math.sin(b)*(i+1);
		 		m.position.x = Math.cos(a)*h*Math.sin(b)*(i+1);

		 		/*note: rotating cloud according to its position*/
		 		m.rotation.z = a + Math.PI/2;
		 		/*note: placing clouds at random depth inside the cave*/
		 		m.position.z = t*Math.cos(b)*(i+1);

		 		this.clouds.push(m);
		 		env.add(m);
	 		}
	 	}
	 }
 };