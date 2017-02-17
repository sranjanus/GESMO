/*
 * GESMO Namespace
 * @author Shashank Ranjan
 *
 */

 var GESMO = { REVISION: '1' };

 if( typeof module === 'object' ){
 	module.exports = GESMO;
 }

 // WINDOW STATE CONSTANTS
 GESMO.MAXMODE = 0;
 GESMO.MINMODE = 1;

 // GESTURE CONTROLLER CONSTANTS
 GESMO.TRANSLATEMODE = 10;
 GESMO.ROTATEMODE = 11;
 GESMO.PICKMODE = 12;
 GESMO.NOMODE = 13;
 GESMO.PI_2 = Math.PI * 2;
 GESMO.X_AXIS = new THREE.Vector3(1, 0, 0);
 GESMO.Y_AXIS = new THREE.Vector3(0, 1, 0);
 GESMO.Z_AXIS = new THREE.Vector3(0, 0, 1);

 // MUSIC PLAYER STATE CONSTANTS
 GESMO.MUSICPLAYING = 20;
 GESMO.MUSICPAUSED = 21;
 GESMO.PLAYLISTEMPTY = 22;

 //UI CONSTANTS
 GESMO.ARTISTSVIEW = 23;
 GESMO.SONGSVIEW = 24;
 GESMO.QUEUEVIEW = 25;
 GESMO.SONGSSEARCHVIEW = 26;
 GESMO.SONGSBROWSEVIEW = 27;



