/*
 * GESMO UI Controller
 * Author: @Shashank
 */

 GESMO.GesmoUI = function(container){
 	this.container = container;

 	this.scene = new THREE.Scene();

 	var aspectratio = GESMO.WIDTH/GESMO.HEIGHT;
 	fieldOfView = 40;
 	nearPlane = 1;
 	farPlane = 10000;
 	this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectratio,
 												nearPlane, farPlane);

 	this.camera.position.z = 3000;

 	this.renderer = new THREE.CSS3DRenderer();
 	this.renderer.setSize(GESMO.WIDTH, GESMO.HEIGHT);
 	this.renderer.domElement.style.position = 'absolute';
 	this.container.appendChild(this.renderer.domElement);

 	this.libElements = [];
 	this.targets = [];
 	this.view = null;
 	this.viewMode = null;
 };

 GESMO.GesmoUI.prototype = {
 	constructor: GESMO.GesmoUI,

 	destroyView: function(){
 		if(this.view != null){
 			this.view.destroy();
 			delete this.view;
 			this.view = null;
 		}
 	},

 	createView: function(newViewMode){
 		this.viewMode = newViewMode;
 		switch(newViewMode){
 			case GESMO.HOMEVIEW : {
 				this.view = new GESMO.HomeView(this.scene)
 				break;
 			}
 		}
 	},

 	animate: function(){
 		TWEEN.update();
 		this.render();
 	},

 	render: function(){
 		this.renderer.render(this.scene, this.camera);
 	}
 };