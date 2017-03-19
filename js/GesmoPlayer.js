/*
 * GESMO MUSIC PLAYER
 * Authors: @Shashank, @Bahar
 */

var elms = ['track', 'timer', 'duration', 'playBtn', 
'pauseBtn', 'prevBtn', 'nextBtn', 'volumeBtn', 'progress', 'bar', 'wave', 
'loading', 'playlist', 'list', 'volume', 'barEmpty', 'barFull', 'sliderBtn'];

GESMO.GesmoPlayer = function(songList/*, elmList*/){
	this.playlist = songList;
	this.index = 0;

	if(this.playlist.length)
		track.innerHTML = '1. ' + this.playlist[0].name;

	elms.forEach(function(elm) {
	  window[elm] = document.getElementById(elm);
	});

	this.wave = new SiriWave({
	    container: window.waveform,
	    width: window.innerWidth,
	    height: window.innerHeight * 0.3,
	    cover: true,
	    speed: 0.03,
	    amplitude: 0.7,
	    frequency: 2
	});
	this.wave.start();
	this.state = GESMO.STOPPED;
};

GESMO.GesmoPlayer.prototype = {
	play: function(index){
		var self = this;
		var sound;

		index = typeof index === 'number' ? index : self.index;
		var data = self.playlist[index];

		if(data.howl){
			sound = data.howl;
		} else {
			console.log(data.path);
			sound = data.howl = new Howl({
				src: data.path,
				onplay: function(){
					// for UI
					duration.innerHTML = self.formatTime(Math.round(sound.duration()));
					// --

					requestAnimationFrame(self.step.bind(self));

					// for UI
					this.wave.container.style.display = 'block';
					bar.style.display = 'none';
					pauseBtn.style.display = 'block';
					// --
				}.bind(this),
				onload: function(){
					// for UI
					this.wave.container.style.display = 'block';
					bar.style.display = 'none';
					loading.style.display = 'none';
				}.bind(this),
				onend: function(){
					// for UI
					this.wave.container.style.display = 'none';
					bar.style.display = 'block';
					//---
					self.skip('right');
				}.bind(this),
				onpause: function(){
					// for UI
					this.wave.container.style.display = 'none';
					bar.style.display = 'block';
					pauseBtn.style.display = "none";
					//--
				}.bind(this),
				onstop: function() {
		          // Stop the wave animation.
		          this.wave.container.style.display = 'none';
		          bar.style.display = 'block';
		        }.bind(this)
			});
		}

		sound.play();

		// for UI
		track.innerHTML = (index + 1) + '. ' + data.name;

		if(sound.state() === 'loaded') {
			// for UI
			playBtn.style.display = 'none';
			pauseBtn.style.display = 'block';
		} else {
			// for UI
			loading.style.display = 'block';
			playBtn.style.display = 'none';
			pauseBtn.style.display = 'none';
		}

		self.index = index;
		this.state = GESMO.PLAYING;
		var event = new CustomEvent('gesmo.player.newsong', {
			detail: {
				index: self.index
			}
		});
		window.dispatchEvent(event);
	},

	pause: function(){
		var self = this;

		var sound = self.playlist[self.index].howl;

		sound.pause();
		// for UI
		playBtn.style.display = 'block';
		pauseBtn.style.display = 'none';

		this.state = GESMO.PAUSED;
	},

	skip: function(direction){
		var self = this;

		var index = 0;
	    if (direction === 'prev') {
	      index = self.index - 1;
	      if (index < 0) {
	        index = self.playlist.length - 1;
	      }
	    } else {
	      index = self.index + 1;
	      if (index >= self.playlist.length) {
	        index = 0;
	      }
	    }

	    self.skipTo(index);
	},

	skipTo: function(index) {
	    var self = this;

	    // Stop the current track.
	    if (self.playlist[self.index].howl) {
	      self.playlist[self.index].howl.stop();
	    }

	    // for UI
	    // Reset progress.
	    progress.style.width = '0%';

	    // Play the new track.
	    self.play(index);
	},

	volume: function(val) {
	    var self = this;

	    // Update the global volume (affecting all Howls).
	    Howler.volume(val);

	    // for UI
	    // Update the display on the slider.
	    var barWidth = (val * 90) / 100;
	    barFull.style.width = (barWidth * 100) + '%';
	    sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
	 },

	seek: function(per) {
	    var self = this;

	    // Get the Howl we want to manipulate.
	    var sound = self.playlist[self.index].howl;

	    // Convert the percent into a seek position.
	    if (sound.playing()) {
	      sound.seek(sound.duration() * per);
	    }
	},

	step: function() {
	    var self = this;

	    // Get the Howl we want to manipulate.
	    var sound = self.playlist[self.index].howl;

	    // for UI
	    // Determine our current seek position.
	    var seek = sound.seek() || 0;
	    timer.innerHTML = self.formatTime(Math.round(seek));
	    progress.style.width = (((seek / sound.duration()) * 100) || 0) + '%';

	    // If the sound is still playing, continue stepping.
	    if (sound.playing()) {
	      requestAnimationFrame(self.step.bind(self));
	    }
	},

	 /**
	   * Toggle the volume display on/off.
	   */
	  toggleVolume: function() {
	    var self = this;
	    var display = (volume.style.display === 'block') ? 'none' : 'block';

	    setTimeout(function() {
	      volume.style.display = display;
	    }, (display === 'block') ? 0 : 500);
	    volume.className = (display === 'block') ? 'fadein' : 'fadeout';
	  },

	formatTime: function(secs) {
	    var minutes = Math.floor(secs / 60) || 0;
	    var seconds = (secs - minutes * 60) || 0;

	    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
	},

	setSliderDown: function(value){
		window.sliderDown = value;
	},

	move: function(event){
		if(window.sliderDown){
			var x = event.clientX || event.touches[0].clientX;
    		var startX = window.innerWidth * 0.05;
    		var layerX = x - startX;
    		var per = Math.min(1, Math.max(0, layerX / parseFloat(barEmpty.scrollWidth)));
    		player.volume(per);
		}
	},

	addToPlaylist: function(data){
		this.playlist.push(data);
	},

	checkPlaylistState: function(){
		if(this.playlist.length == 1){
			return GESMO.PLAYLISTEMPTY;
		} else {
			return GESMO.PLAYLISTNOTEMPTY; 
		}
	},

	resize: function(){
	  var height = window.innerHeight * 0.3;
	  var width = window.innerWidth;
	  wave.height = height;
	  wave.height_2 = height / 2;
	  wave.MAX = wave.height_2 - 4;
	  wave.width = width;
	  wave.width_2 = width / 2;
	  wave.width_4 = width / 4;
	  wave.canvas.height = height;
	  wave.canvas.width = width;
	  wave.container.style.margin = -(height / 2) + 'px auto';

	  // Update the position of the slider.
	  var sound = player.playlist[player.index].howl;
	  if (sound) {
	    var vol = sound.volume();
	    var barWidth = (vol * 0.9);
	    sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
	  }
	}
};

