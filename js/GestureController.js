/*
 * GESMO Leap Motion Controls
 * Author: @Siddhesh, @Shashank
 */

 GESMO.GestureController = function(controller, objectToTranslate, objectToRotate, objectsToPick){
 	this.controller = controller;
 	this.anchorDelta = 1;

 	this.objectToTranslate = objectToTranslate;
 	this.objectToRotate = objectToRotate;
 	this.objectsToPick = objectsToPick;

 	this.mode = GESMO.NOMODE;

 	this.translationSpeed = 20;
 	this.translationDecay = 0.3;
 	this.transSmoothing = 0.5;
 	this.rotationSmoothing = 0.5;

 	this.rotationSlerp = 0.8;
 	this.rotationSpeed = 4;

 	this.pinchThreshold = 0.5;

 	this.vector = new THREE.Vector3();
 	this.vector2 = new THREE.Vector3();
 	this.matrix = new THREE.Quaternion();
 	this.translationMomentum = new THREE.Vector3();
 	this.rotationMomentum = this.objectToRotate.quaternion.clone();

 	this.transLP = [
 		new LowPassFilter(this.transSmoothing),
 		new LowPassFilter(this.transSmoothing),
 		new LowPassFilter(this.transSmoothing)
 	];

 	this.rotLP = [
 		new LowPassFilter(this.rotationSmoothing),
 		new LowPassFilter(this.rotationSmoothing),
 		new LowPassFilter(this.rotationSmoothing)
 	];
 };

 GESMO.GestureController.prototype = {
 	update: function(){
 		var self = this;
 		var frame = this.controller.frame();
 		var anchorFrame = this.controller.frame(this.anchorDelta);

 		if(!frame || !frame.valid || !anchorFrame || !anchorFrame.valid){
 			return;
 		}

 		var rawHands = frame.hands;
 		var rawAnchorHands = anchorFrame.hands;

 		var hands = [];
 		var anchorHands = [];

 		rawHands.forEach(function(hand, hIdx){
 			var anchorHand = anchorFrame.hand(hand.id);
 			if(anchorHand.valid){
 				hands.push(hand);
 				anchorHands.push(anchorHand);
 			}
 		});

 		if(hands.length == 1){
 			if(hands[0].type == "right" && anchorHands[0].type == "right"){
 				if(this.shouldTranslate(anchorHands[0], hands[0])){
 					this.applyTranslation(anchorHands[0], hands[0]);
 				}

 				// if(this.shouldTouch(anchorHands[0], hands[0])){

 				// }
 			} else {
 				
 			}
 		} else if(hands.length == 2){
 			if(this.shouldRotate(anchorHands, hands)){
 				this.applyRotation(anchorHands, hands);
	 		}
 		}
 	},

 	shouldTranslate: function(anchorHand, hand){
 		return this.isEngaged(anchorHand) && this.isEngaged(hand);
 	},

 	applyTranslation: function(anchorHand, hand){
 		var translation = this.getTranslation(anchorHand, hand);
 		if(translation[0] > 0) translation[0] = this.transLP[0].sample(translation[0]);
 		if(translation[1] > 0) translation[1] = this.transLP[1].sample(translation[1]);
 		if(translation[2] > 0) translation[2] = this.transLP[2].sample(translation[2]);

 		this.vector.fromArray(translation);
 		this.vector.multiplyScalar(this.translationSpeed);
 		this.vector.applyQuaternion(this.objectToTranslate.quaternion);
 		this.translationMomentum.add(this.vector);

 		this.objectToTranslate.position.add(this.translationMomentum);
 		this.translationMomentum.multiplyScalar(this.translationDecay);
 	},

 	getTranslation: function(anchorHand, hand){
 		var centerAnchor = anchorHand.palmPosition;
 		var centerCurrent = hand.palmPosition;

 		var xTrans = centerCurrent[0] - centerAnchor[0];
 		var yTrans = centerCurrent[1] - centerAnchor[1];
 		var zTrans = centerCurrent[2] - centerAnchor[2];

 		var absX = Math.abs(xTrans);
 		var absY = Math.abs(yTrans);
 		var absZ = Math.abs(zTrans);

 		if(absX >= absY && absY >= absZ){
 			return [
 				xTrans,
 				0,
 				0
 			];
 		} else if(absX < absY && absY >= absZ){
 			return [
 				0,
 				yTrans,
 				0
 			];
 		} else {	
 			return [
 				0,
 				0,
 				zTrans
 			];	
 		}
 	},

 	shouldRotate: function(anchorHands, hands){
 		var leftAnchorHand = this.findHand(anchorHands, "left");
 		var rightAnchorHand = this.findHand(anchorHands, "right");
 		var leftHand = this.findHand(hands, "left");
 		var rightHand = this.findHand(hands, "right");

 		return (leftAnchorHand != null) && (rightAnchorHand != null) 
 					&& (leftHand != null) && (rightHand != null)
 						&& this.isEngaged(leftAnchorHand) && this.isEngaged(leftHand);
 	},

 	applyRotation: function(anchorHands, hands){
 		console.log('here');
 		console.log(anchorHands);
 		console.log(hands);
 	},

 	isEngaged: function(h){
 		return h && (h.pinchStrength > this.pinchThreshold);
 	},

 	findHand: function(hands, type){
 		for(var i = 0;i < hands.length;i++){
 			if(hands[i].type == type){
 				return hands[i];
 			}
 		}
 		return null;
 	}
 };

 function LowPassFilter(cutoff){
 		var accumulator = 0;
 		this.setCutOff = function(value){
 			cutoff = value;
 		}

 		this.sample = function(sample){
 			accumulator += (sample - accumulator)*cutoff;
 			return accumulator;
 		}
 }