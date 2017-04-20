/*
 * GESMO Leap Motion Controls
 * Author: @Siddhesh, @Shashank
 */

 GESMO.GestureController = function(controller, ui, player, logger){
 	this.controller = controller;
 	this.anchorDelta = 1;

 	this.ui = ui;
 	this.player = player;
 	this.logger = logger;

 	this.grabThreshold = 1;
 	this.pinchThreshold = 0.9;
 	
 	this.gesInProgress = false;

 	this.startGesture = false;
 	this.swipeCount = 0;
 };

 GESMO.GestureController.prototype = {
 	update: function(){

 		if(this.gesInProgress){
 			return;
 		}

 		var self = this;
 		var frame = this.controller.frame();
 		var anchorFrame = this.controller.frame(this.anchorDelta);
 		var anchorFrame1 = this.controller.frame(7);
 		var anchorFrame2 = this.controller.frame(2);

 		if(!frame || !frame.valid || !anchorFrame || !anchorFrame.valid || !anchorFrame1 || !anchorFrame1.valid
 			|| !anchorFrame2 || !anchorFrame2.valid){
 			return;
 		}

 		var rawHands = frame.hands;
 		var rawAnchorHands = anchorFrame.hands;
 		var rawAnchorHands1 = anchorFrame1.hands;
 		var rawAnchorHands2 = anchorFrame2.hands;

 		var hands = [];
 		var anchorHands = [];
 		var anchorHands1 = [];
 		var anchorHands2 = [];

 		rawHands.forEach(function(hand, hIdx){
 			var anchorHand = anchorFrame.hand(hand.id);
 			if(anchorHand.valid){
 				if(hand.data('riggedHand.mesh').scale.x != 0.1){
 					hand.data('riggedHand.mesh').scale.set(5, 5, 5);
 				}
 				hands.push(hand);
 				anchorHands.push(anchorHand);
 			}

 			var anchorHand1 = anchorFrame1.hand(hand.id);
 			if(anchorHand1.valid){
 				anchorHands1.push(anchorHand1);
 			}

 			var anchorHand2 = anchorFrame2.hand(hand.id);
 			if(anchorHand2.valid){
 				anchorHands2.push(anchorHand2);
 			}
 		});

 		if(hands.length == 0){
 			return;
 		} else if(hands.length == 1){
 			if(this.startGesture){
 				var tipPos = new THREE.Vector3();
 				handMesh = hands[0].data('riggedHand.mesh')
    			handMesh.scenePosition(hands[0].indexFinger.tipPosition, tipPos);
    			
    			ui.onHandMove(handMesh);

    			if(/* && this.pinchGesture(hands[0])*/ ui.highlighted != null && this.shouldPick(anchorHands2[0], hands[0])){
    				this.gesInProgress = true;
    				this.logger.log("gesture, pinch, made");
					if(ui.viewMode == GESMO.QUEUEVIEW){
						if(hands[0].type=="right"){
							var eventObj = {
								button: 0
							};
							ui.onClick(eventObj, function(){
								this.gesInProgress = false;
							}.bind(this));
						}
						else{
								
						}
					}
					else{
						var eventObj = {
							button: 0
						};
						ui.onClick(eventObj, function(){
							this.gesInProgress = false;
						}.bind(this));
					}
	 			} else if(this.grabGesture(hands[0]) && this.shouldTranslate(anchorHands[0], hands[0])){
 					this.applyTranslation(anchorHands[0], hands[0]);
 				} else{
					frame.gestures.forEach(function(gesture){
						switch(gesture.type){
							case "circle" : {
								if(!this.isEngaged(hands[0]) && gesture.state == "stop" && this.fingerCount(hands[0]) && this.fingerCount(anchorHands[0])){
									this.gesInProgress = true;
									var pointableID = gesture.pointableIds;
									var direction = frame.pointable(pointableID).direction;
									var dotProduct = Leap.vec3.dot(direction, gesture.normal);
									var pos = parseFloat(document.getElementById('progress').style.width)*0.01;
									if(dotProduct < 0){							 
										ui.goBack(function(){
											this.gesInProgress = false;
										}.bind(this));
									} else {
										this.gesInProgress = false;
									}
								}
								break;
							}

							case "swipe" : {
								if(this.openCount(hands[0]) && this.openCount(anchorHands2[0]) && gesture.state == "stop"){
									var pointableID = gesture.pointableIds[0];
									var direction = frame.pointable(pointableID).direction;
									var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
									if(isHorizontal){
										if(this.gesInProgress){
											return;
										}
										this.gesInProgress = true;
										var distance = Math.abs(gesture.position[0] - gesture.startPosition[0]);
										if(distance > 175){
											this.logger.log("gesture, swipe, made for previous or next");
										}
										if(distance > 200){
											if(gesture.direction[0] > 0){
												player.skip("next");
												$(nextBtn).fadeIn(400, "swing", function(){
													$(nextBtn).fadeOut(400, "swing", function(){
														setTimeout(function(){
															this.gesInProgress = false;
														}.bind(this), 400);
													}.bind(this));
												}.bind(this));
											} else {
												if(distance > 200){
													player.skip("prev");
													$(prevBtn).fadeIn(400, "swing", function(){
														$(prevBtn).fadeOut(400, "swing", function(){
															setTimeout(function(){
																this.gesInProgress = false;
															}.bind(this), 400);
														}.bind(this));
													}.bind(this));
												}
											}
										} else {
											this.gesInProgress = false;
										}
									} 
									else {
										if(this.gesInProgress){
											return;
										}
										this.gesInProgress = true;
										var distance = Math.abs(gesture.position[1] - gesture.startPosition[1]);
										if(distance > 125){
											this.logger.log("gesture, swipe, made to change volume");
										}
										if(distance > 150){
											var a = Howler._volume;
											if(gesture.direction[1] > 0){
												if(a < 1){
													a = a + 0.1;
												}
											} else {
												if(distance > 150){
													if(a > 0.1){
														a = a-0.1;
													}
												}
											}

											player.volume(a, function(){
												this.gesInProgress = false;
											}.bind(this));
										} else {
											this.gesInProgress = false;
										}
									}
								}
								break;
							}
						}
					}.bind(this));
				}
 			} 
 		} else {			
 			if(this.shouldTogglePlay(anchorHands1, hands)){
 				this.gesInProgress = true;
 				if(!this.startGesture){
 					this.startGesture = true;
 					$("#playerContainer").fadeIn(function(){
						$("#userMap").fadeIn("fast", function(){
							ui.hideTitle(function(){
 								this.gesInProgress = false;
							}.bind(this));
						}.bind(this));
					}.bind(this));
 					this.logger.log("gesture, grab, made to start application");
 				} else {

 					this.logger.log("gesture, grab, made to play or pause");

 					if(this.player.state != GESMO.PLAYING 
 					&& this.player.checkPlaylistState != GESMO.PLAYLISTEMPTY){
 						this.player.play(this.player.index);
 						$(playBtn).fadeIn(400, "swing", function(){
 							$(playBtn).fadeOut(400, "swing", function(){
 								this.gesInProgress = false;
 							}.bind(this));
 						}.bind(this));
 						return;
	 				} else if(this.player.state == GESMO.PLAYING){
	 					this.player.pause();
	 					$(pauseBtn).fadeIn(400, "swing", function(){
 							$(pauseBtn).fadeOut(400, "swing", function(){
 								this.gesInProgress = false;
 							}.bind(this));
 						}.bind(this));
	 					return;
	 				} else {
	 					this.gesInProgress = false;
	 				}
 				}
 			}
 		}
 	},

 	shouldTranslate: function(anchorHand, hand){
 		return this.isEngaged(anchorHand) && this.isEngaged(hand);
 	},

 	applyTranslation: function(anchorHand, hand){

 		this.gesInProgress = true;

 		var translation = this.getTranslation(anchorHand, hand);

 		var axis = this.getAxisOfTranslation(translation);

 		if(axis == 0){
 			if(Math.abs(translation[0]) > 10){
 				this.logger.log("gesture, grab and pull, made to moveToSection: left or right");
 			}
	 		if(Math.abs(translation[0]) > 20){
	 			if(translation[0] > 0){
	 				ui.moveToSection("left", function(){;
	 					this.gesInProgress = false;
	 				}.bind(this));
	 			} else {
	 				ui.moveToSection("right", function(){
	 					this.gesInProgress = false;
	 				}.bind(this));
	 			}
	 		} else {
	 			this.gesInProgress = false;
	 		}
 		} else if(axis == 1){
 			if(Math.abs(translation[1]) > 10){
 				this.logger.log("gesture, grab and pull, made to moveInSection: up or down");
 			}
	 		if(Math.abs(translation[1]) > 20){
	 			if(translation[1] < 0){
	 				ui.moveToSection("up", function(){
	 					this.gesInProgress = false;
	 				}.bind(this));
	 			} else {
	 				ui.moveToSection("down", function(){
	 					this.gesInProgress = false;
	 				}.bind(this));
	 			}
	 		} else {
	 			this.gesInProgress = false;
	 		}
 		} else {
 			if(Math.abs(translation[2]) > 10){
 				this.logger.log("gesture, grab and pull, made to moveInSection: forward or backward");
 			}
	 		if(Math.abs(translation[2]) > 20){
	 			if(translation[2] > 0){
	 				ui.moveInSection("forward", function(){
	 					this.gesInProgress = false;
	 				}.bind(this));
	 			} else {
	 				ui.moveInSection("backward", function(){
	 					this.gesInProgress = false;
	 				}.bind(this));
	 			}
	 		} else {
	 			this.gesInProgress = false;
	 		}
 		}
 	},

 	getTranslation: function(anchorHand, hand){
 		var centerAnchor = anchorHand.palmPosition;
 		var centerCurrent = hand.palmPosition;

 		var xTrans = centerCurrent[0] - centerAnchor[0];
 		var yTrans = centerCurrent[1] - centerAnchor[1];
 		var zTrans = centerCurrent[2] - centerAnchor[2];

 		return [
 				xTrans,
 				yTrans,
 				zTrans
 			];
 	},

 	shouldPick: function(anchorHand, hand){
 		return (this.isPinched(anchorHand)) && (!this.isPinched(hand));
 	},
	
 	shouldTogglePlay: function(anchorHands, hands){
 		return (this.isEngaged(anchorHands[0]) && this.isEngaged(anchorHands[1]) && !this.isEngaged(hands[0]) && !this.isEngaged(hands[1]));
 	},

 	isEngaged: function(h){ 		
 		return h && (h.grabStrength == this.grabThreshold)/* && (this.extendedCount)*/;
 	},

 	isPinched: function(h){
 		if(h)
 		console.log(h.pinchStrength);
 		return h && (h.pinchStrength > this.pinchThreshold) && (h.grabStrength < this.grabThreshold);
 	},

 	fingerCount: function(hand){
 		if(hand){
 			if(!hand.thumb.extended && !hand.middleFinger.extended && !hand.ringFinger.extended && !hand.pinky.extended && hand.indexFinger.extended){
 				return true;
 			}
 			return false;
 		} else {
 			return false;
 		}
 	},

 	openCount: function(hand){
 		if(hand){
 			if((hand.thumb.extended || hand.middleFinger.extended || hand.ringFinger.extended || hand.pinky.extended) && hand.indexFinger.extended){
 				return true;
 			}
 			return false;
 		} else {
 			return false;
 		}
 	},

 	extendedCount: function(hand){
 		if(hand){
 			if(!hand.thumb.extended && !hand.indexFinger.extended && !hand.middleFinger.extended && !hand.ringFinger.extended && !hand.pinky.extended)
 				return true;
 		} else {
 			return false;
 		}
 	},

 	setStartGesture: function(){
 		this.startGesture = true;
 	}, 

 	calDistance: function(arr1, arr2) {
 		return Math.sqrt(Math.pow(arr2[0]-arr1[0], 2), Math.pow(arr2[1]-arr1[1], 2), Math.pow(arr2[2]-arr1[2], 2));
 	},
	
	thumbsPoking: function(hand){
		return hand.thumb.extended;
	},
	
	pinchGesture: function(hand){
		var x = (!hand.indexFinger.extended && !hand.thumb.extended && hand.pinky.extended && hand.ringFinger.extended && hand.middleFinger.extended); 
		return x;
	},
	
	grabGesture: function(hand){
		var x = !hand.indexFinger.extended && !hand.thumb.extended && !hand.pinky.extended && !hand.ringFinger.extended && !hand.middleFinger.extended; 
		return x;
	},

	getAxisOfTranslation: function(vector){
		var x = Math.abs(vector[0]);
		var y = Math.abs(vector[1]);
		var z = Math.abs(vector[2]);

		if(x > y && x > z){
			return 0;
		} else if(y > x && y > z){
			return 1;
		} else {
			return 2;
		}
	}
 };

