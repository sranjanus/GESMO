/*
 * GESMO Leap Motion Controls
 * Author: @Siddhesh, @Shashank
 */

 GESMO.GestureController = function(controller, ui, player){
 	this.controller = controller;
 	this.anchorDelta = 1;

 	this.ui = ui;
 	this.player = player;

 	this.translationSpeed = 1;
 	this.translationDecay = 0.3;
 	this.transSmoothing = 0.5;
 	this.rotationSmoothing = 0.5;

 	this.rotationSlerp = 0.8;
 	this.rotationSpeed = 1;

 	this.grabThreshold = 1;
 	this.pinchThreshold = 0.85;

 	this.vector = new THREE.Vector3();
 	this.vector2 = new THREE.Vector3();
 	this.matrix = new THREE.Quaternion();
 	this.quaternion = new THREE.Quaternion();
 	this.translationMomentum = new THREE.Vector3();
 	this.rotationMomentum = ui.movableObjects.quaternion.clone();

 	this.scaleSetLeft = false;
 	this.scaleSetRight = false;

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

 	this.startApplication = true;
 	this.startGesture = false;
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
 				if(hand.data('riggedHand.mesh').scale.x != 0.1){
 					hand.data('riggedHand.mesh').scale.set(5, 5, 5);
 				}
 				hands.push(hand);
 				anchorHands.push(anchorHand);
 			}
 		});

 		if(hands.length == 1 && this.startGesture){
 			if(hands[0].type == "right" && anchorHands[0].type == "right"){
 				
 				var tipPos = new THREE.Vector3();
 				handMesh = hands[0].data('riggedHand.mesh')
    			handMesh.scenePosition(hands[0].indexFinger.tipPosition, tipPos);
    			
    			ui.onHandMove(tipPos);

 				if(this.shouldTranslate(anchorHands[0], hands[0])){
 					this.applyTranslation(anchorHands[0], hands[0]);
 					return;
 				}

 				// if(this.shouldRotate(anchorHands[0], hands[0])){
 				// 	this.applyRotation(anchorHands[0], hands[0]);
 				// 	return;
	 			// }

	 			if(this.shouldPick(anchorHands[0], hands[0])){
	 				var eventObj = {
	 					button: 0
	 				};
	 				ui.onClick(eventObj);
	 				return;
	 			}

	 			frame.gestures.forEach(function(gesture){

		 			switch(gesture.type){
		 				// case "circle" : {
		 				// 	if(!this.isEngaged(hands[0]) && gesture.state == "update" && this.fingerCount(hands[0]) && this.fingerCount(anchorHands[0])){
		 				// 		var pointableID = gesture.pointableIds;
		 				// 		var direction = frame.pointable(pointableID).direction;
		 				// 		var dotProduct = Leap.vec3.dot(direction, gesture.normal);
		 				// 		var pos = parseFloat(document.getElementById('progress').style.width)*0.01;
		 				// 		if(dotProduct > 0){							 
		 				// 			pos = pos + 0.002;
		 				// 			player.seek(pos);
		 				// 		} else {
		 				// 			pos = pos - 0.002;
		 				// 			player.seek(pos);
		 				// 		}
		 				// 	}
		 				// 	break;
		 				// }

		 				case "swipe" : {
		 					if(gesture.state == "stop" && this.fingerCount(hands[0]) && this.fingerCount(anchorHands[0])){
		 						var pointableID = gesture.pointableIds[0];
		 						var direction = frame.pointable(pointableID).direction;
		 						var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
		 						if(isHorizontal){
		 							var distance = Math.abs(gesture.position[0] - gesture.startPosition[0]);
		 							if(gesture.direction[0] > 0 && distance > 200){
		 								player.skip("next");
		 							} else {
		 								if(distance > 200){
		 									player.skip("prev");
		 								}
		 							}
		 						} else {
		 							var distance = Math.abs(gesture.position[1] - gesture.startPosition[1]);
		 							var a = Howler._volume;
		 							document.getElementById("volume").style.display = "block";
		 							if(gesture.direction[1] > 0 && distance > 150){
		 								if(a < 1){
		 									a = a + 0.1;
		 								}
		 								player.volume(a);
		 							} else {
		 								if(distance > 150){
		 									if(a > 0.1){
		 										a = a-0.1;
		 									}
		 									player.volume(a);
		 								}
		 							}
		 							setTimeout(function(){
		 								document.getElementById("volume").style.display = "none";
		 							}.bind(this), 1000);
		 						}
		 					}
		 					break;
		 				}
		 			}
		 		}.bind(this));

 			} else {
 				// if(this.shouldRotate(anchorHands[0], hands[0])){
 				// 	this.applyRotation(anchorHands[0], hands[0]);
 				// 	return;
	 			// }
 			}
 		} else if(hands.length == 2){
 			if(this.shouldTogglePlay(anchorHands, hands)){
 				if(this.startApplication){
 					var event = new CustomEvent('gesmo.gesture.startdectected');
 					window.dispatchEvent(event);
 					this.startApplication = false;
 					return;
 				} else {
 					if(this.player.state != GESMO.PLAYING 
 					&& this.player.checkPlaylistState != GESMO.PLAYLISTEMPTY && this.startGesture){
 						this.player.play(this.player.index);
 						return;
	 				}

	 				if(this.player.state == GESMO.PLAYING && this.startGesture){
	 					this.player.pause();
	 					return;
	 				}
 				}
 				
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

 		translation[1] = 0;

 		this.vector.fromArray(translation);
 		this.vector.multiplyScalar(this.translationSpeed);
 		this.vector.applyQuaternion(ui.movableObjects.quaternion);
 		this.translationMomentum.add(this.vector);

 		this.ui.movableObjects.position.add(this.translationMomentum);
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

 		return [
 				xTrans,
 				yTrans,
 				zTrans
 			];
 	},

 	shouldRotate: function(anchorHand, hand){
 		return this.isEngaged(anchorHand) && this.isEngaged(hand);
 	},

 	applyRotation: function(anchorHand, hand){
 		var translation = this.getTranslationForRotation(anchorHand, hand);

   		if(translation[0] > 0) translation[0] = this.transLP[0].sample(translation[0]);
 		if(translation[1] > 0) translation[1] = this.transLP[1].sample(translation[1]);
 		if(translation[2] > 0) translation[2] = this.transLP[2].sample(translation[2]);

 		if(translation[1] != 0){
 			var angle = this.rotationSpeed*translation[1]/450;
 			ui.movableObjects.rotateOnAxis(GESMO.Z_AXIS, angle);
 		}

 		if(translation[0] != 0){
 			var angle = this.rotationSpeed*translation[0]/450
 			ui.movableObjects.rotateOnAxis(GESMO.Y_AXIS, angle);
 		}

 		if(translation[2] != 0){
 			var angle = this.rotationSpeed*translation[2]/450;
 			ui.movableObjects.rotateOnAxis(GESMO.Y_AXIS, angle);
 		}
 	},

 	getTranslationForRotation: function(anchorHand, hand){
 		var centerAnchor = anchorHand.palmPosition;
 		var centerCurrent = hand.palmPosition;

 		var xTrans = centerCurrent[0] - centerAnchor[0];
 		var yTrans = centerCurrent[1] - centerAnchor[1];
 		var zTrans = centerCurrent[2] - centerAnchor[2];

 		var absX = Math.abs(xTrans);
 		var absY = Math.abs(yTrans);
 		var absZ = Math.abs(zTrans);

 		var max = Math.max(absY, absZ);

	 	if(max == absX){
	 		return [
	 			xTrans,
	 			0,
	 			0
	 		];
	 	} else if(max == absY){
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

 	getRotation: function(anchorHand, hand){
          var am = this.getAxisMag(hand);
          if (am[3] < 6000) {
            return [0, 0, 0];
          }
          var mi = 1 / am[3];
          am[0]*=mi;
          am[1]*=mi;
          am[2]*=mi;
        
          var anchorAngles = this.getAngles(anchorHand);
          var angles = this.getAngles(hand);
        
          var dx = angles[0] - anchorAngles[0];
          var dy = angles[1] - anchorAngles[1];
          var dz = angles[2] - anchorAngles[2];
        
          if (dx > Math.PI) dx = dx - Math.PI*2;
          else if (dx < -Math.PI) dx = dx + Math.PI*2;
          if (dy > Math.PI) dy = dy - Math.PI*2;
          else if (dy < -Math.PI) dy = dy + Math.PI*2;
          if (dz > Math.PI) dz = dz - Math.PI*2;
          else if (dz < -Math.PI) dz = dz + Math.PI*2;

          return [dx * am[0], dy * am[1], dz * am[2]];
 	},

 	getAngles: function(hand) {
          var pos1 = hand.frame.interactionBox.center;
        
          var pos2 = hand.palmPosition;
        
          var dx = pos2[0] - pos1[0];
          var dy = pos2[1] - pos1[1];
          var dz = pos2[2] - pos1[2];

          var ax = Math.atan2(dy, dz);
          var ay = Math.atan2(dx, dz);
          var az = Math.atan2(dy, dx);
          return [ax, ay, az];
    },

 	getAxisMag: function(hand) {
          var pos1 = hand.frame.interactionBox.center;
          var pos2 = hand.palmPosition;
        
          var dx = pos2[0] - pos1[0];
          var dy = pos2[1] - pos1[1];
          var dz = pos2[2] - pos1[2];
          var mag = dx * dx + dy * dy + dz * dz;
        
          var ax = dy * dy + dz * dz;
          var ay = dx * dx + dz * dz;
          var az = dy * dy + dx * dx;
        
          return [ax, ay, az, mag];
    },

 	shouldPick: function(anchorHand, hand){
 		return (this.isPinched(anchorHand)) && (!this.isPinched(hand));
 	},

 	shouldTogglePlay: function(anchorHands, hands){
 		return (!this.isEngaged(anchorHands[0]) && !this.isEngaged(anchorHands[1]) && this.isEngaged(hands[0]) && this.isEngaged(hands[1]))
 				|| (this.isEngaged(anchorHands[0]) && this.isEngaged(anchorHands[1]) && !this.isEngaged(hands[0]) && !this.isEngaged(hands[1]));
 	},

 	isEngaged: function(h){
 		return h && (h.grabStrength == this.grabThreshold);
 	},

 	isPinched: function(h){
 		return h && (h.pinchStrength > this.pinchThreshold) && (h.grabStrength < this.grabThreshold);
 	},

 	findHand: function(hands, type){
 		for(var i = 0;i < hands.length;i++){
 			if(hands[i].type == type){
 				return hands[i];
 			}
 		}
 		return null;
 	},

 	fingerCount: function(hand){
 		if(hand){
 			if(!(hand.thumb.extended || hand.middleFinger.extended || hand.ringFinger.extended || hand.pinky.extended) && hand.indexFinger.extended){
 				return true;
 			}
 			return false;
 		} else {
 			return false;
 		}
 	},

 	setStartGesture: function(){
 		this.startGesture = true;
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