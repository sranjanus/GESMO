/*
 * GESMO MUSIC PLAYER
 * Authors: @Shashank, @Bahar
 */

//var elms = ['track', 'timer', 'duration', 'playBtn', 
//'pauseBtn', 'prevBtn', 'nextBtn', 'volumeBtn', 'progress', 'bar', 'wave', 
//'loading', 'playlist', 'list', 'volume', 'barEmpty', 'barFull', 'sliderBtn'];

GESMO.GesmoPlayer = function(songList/*, elmList*/){
	this.playlist = songList;
	this.index = 0;

	// for UI
	//this.elementList = elmList;
	//this.elementList.track.innerHTML = '1.' + this.playlist[0].title;
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
			sound = data.howl = new Howl({
				src: data.path,
				onplay: function(){
					// for UI
					//this.elementList.duration.innerHTML = self.formatTime(Math.round(sound.duration()));
					// --

					requestAnimationFrame(self.step.bind(self));

					// for UI
					//this.elementList.wave.container.style.display = 'block';
					//this.elementList.bar.style.display = 'none';
					//this.elementList.pauseBtn.style.display = 'block';
					// --
				},
				onload: function(){
					// for UI
					//this.elementList.wave.container.style.display = 'block';
					//this.elementList.bar.style.display = 'none';
					//this.elementList.loading.style.display = 'none';
				},
				onend: function(){
					// for UI
					//this.elementList.wave.container.style.display = 'none';
					//this.elementList.bar.style.display = 'block';
					//---
					self.skip('right');
				},
				onpause: function(){
					// for UI
					//this.elementList.wave.container.style.display = 'none';
					//this.elementList.bar.style.display = 'block';
					//--
				}
			});
		}

		sound.play();
		console.log("playing " + data.path);

		// for UI
		//this.elementList.track.innerHTML = (index + 1) + '. ' + data.title;

		if(sound.state() === 'loaded') {
			// for UI
			//this.elementList.playBtn.style.display = 'none';
			//this.elementList.pauseBtn.style.display = 'block';
		} else {
			// for UI
			//this.elementList.loading.style.display = 'block';
			//this.elementList.playBtn.style.display = 'none';
			//this.elementList.pauseBtn.style.display = 'none';
		}

		self.index = index;
	},

	pause: function(){
		var self = this;

		var sound = self.playlist[self.index].howl;

		sound.pause();
		// for UI
		//this.elementList.playBtn.style.display = 'block';
		//this.elementList.pauseBtn.style.display = 'none';
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
	    //this.elementList.progress.style.width = '0%';

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
	    //this.elementList.barFull.style.width = (barWidth * 100) + '%';
	    //this.elementList.sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
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
	    //this.elementList.timer.innerHTML = self.formatTime(Math.round(seek));
	    //this.elementList.progress.style.width = (((seek / sound.duration()) * 100) || 0) + '%';

	    // If the sound is still playing, continue stepping.
	    if (sound.playing()) {
	      requestAnimationFrame(self.step.bind(self));
	    }
	},

	formatTime: function(secs) {
	    var minutes = Math.floor(secs / 60) || 0;
	    var seconds = (secs - minutes * 60) || 0;

	    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
	},

	addToPlaylist: function(data){
		this.playlist.push(data);
	},

	checkState: function(){
		if(this.playlist.length == 1){
			return GESMO.PLAYLISTEMPTY;
		} else {
			return GESMO.MUSICPLAYING; 
		}
	}
};

