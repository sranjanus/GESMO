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
 GESMO.HEIGHT = window.innerHeight;
 GESMO.WIDTH = window.innerWidth;

 // NAVIGATION CONSTANTS
 GESMO.TRANSLATEX = 10;
 GESMO.TRANSLATEY = 11;
 GESMO.TRANSLATEZ = 12;
 GESMO.ROTATEX = 13;
 GESMO.ROTATEY = 14;
 GESMO.ROTATEZ = 15;
 GESMO.NOMOVE = 16;

 // GESTURE CONTROLLER CONSTANTS
 GESMO.TRANSLATEMODE = 20;
 GESMO.ROTATEMODE = 21;
 GESMO.PICKMODE = 22;
 GESMO.NOMODE = 23;
 GESMO.PI_2 = Math.PI * 2;
 GESMO.X_AXIS = new THREE.Vector3(1, 0, 0);
 GESMO.Y_AXIS = new THREE.Vector3(0, 1, 0);
 GESMO.Z_AXIS = new THREE.Vector3(0, 0, 1);

 // MUSIC PLAYER STATE CONSTANTS
 GESMO.PLAYING = 30;
 GESMO.PAUSED = 31;
 GESMO.STOPPED = 32;
 GESMO.PLAYLISTEMPTY = 34;
 GESMO.PLAYLISTNOTEMPTY = 35;

 //UI CONSTANTS
GESMO.TOPCHARTSVIEW = 0;
GESMO.NEWRELEASESVIEW = 1;
GESMO.MUSICVIDSVIEW = 2;
GESMO.PLAYLISTSVIEW = 3;
GESMO.HOMEVIEW = 4;
GESMO.FAVORITESVIEW = 5;
GESMO.ARTISTSVIEW = 6;
GESMO.QUEUEVIEW = 7;
GESMO.GENRESVIEW = 8;

GESMO.Colors = [
	0x69a5c4,
	0x59c1bd,
	0xc5d06a,
	0xfecc2f,
	0xf9a228,
	0xf6621f,
	0xdb3838,
	0xee657a,
	0xa363d9,
	0x4477b2
];
GESMO.VIEWDISTANCE = -400;

 // MOUSE CONSTANTS
 GESMO.LEFTBUTTON = "s";
 GESMO.RIGHTBUTTON = "f";
 GESMO.UPBUTTON = "r";
 GESMO.DOWNBUTTON = "c";
 GESMO.FORWARDBUTTON = "e";
 GESMO.BACKBUTTON = "x";



