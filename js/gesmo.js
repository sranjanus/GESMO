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
 GESMO.MaxMode = 0;
 GESMO.MinMode = 1;

 // LEAP MOTION STATE CONSTANTS
 GESMO.TranslateXMode = 2;
 GESMO.TranslateYMode = 3;
 GESMO.TranslateZMode = 4;
 GESMO.RotateXMode = 5;
 GESMO.RotateYMode = 6;
 GESMO.RotateZMode = 7;

 // MUSIC PLAYER STATE CONSTANTS
 GESMO.MUSICPLAYING = 8;
 GESMO.MUSICPAUSED = 9;
 GESMO.PLAYLISTEMPTY = 10;