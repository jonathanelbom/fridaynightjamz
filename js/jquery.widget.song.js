(function ($) {
	$.widget( 'fridaynightjamz.song', {
		$button: null,
		$wav: null,
		$time: null,
		_create: function() {
			//console.log('song, _create, this.element:',this.element,', this.options:',this.options);
			this.element.attr('id', this.options.id)
			var template = '<button class="playpause"><i class="fa fa-play"></i></button><div class="details">'
				+'<div class="details-top"><span class="name">'+this.options.title+'</span><span class="playlist">'+this.options.playlistData.title+'</span></div>'
				+'<div class="details-bottom"><span class="artist">'+this.options.playlistData.participants+'</span><span class="time"></span></div></div>'
				+'<div class="wav"></div>';
			$( template ).appendTo( this.element );
			$wav = this.element.find('.wav');
			$time = this.element.find('.time');
			// $button = $('<button class="playpause"><i class="fa fa-play"></i></button>').appendTo( this.element );
			// $details = $('<div class="details"></div>').appendTo( this.element );
			// $detailsTop =
			// $creds = $('<div class="creds"></div>').appendTo( this.element );
			// $name = $('<span class="name">'+this.options.title+'</span>').appendTo( $creds );
			// $artist = $('<span class="artist">'+this.options.playlistData.participants+'</span>').appendTo( $creds );
			// $wav = $('<div class="wav"></div>').appendTo( this.element );
			console.log('this:',this);
			this.ws = Object.create(WaveSurfer);
			this.ws.init({
			    container: '#'+this.options.id+'> .wav',
			    waveColor: fnj.config.waveColor,
			    progressColor: fnj.config.progressColor,
			    barWidth: fnj.config.barWidth,
			    backend: 'MediaElement',
			    audioContext: fnj.config.audioCtx,
			    minPxPerSec: 1,
			    scrollParent: false,
			    fillParent: true
			});
			this.ws.on('ready', function (e) {
				//console.log('ready, e:',e,', this:',this);
			});
			$wav.on('mouseup', function (e) {
				//console.log('mouseup, e:',e,', this.element:',this.element);
				$(document).trigger( 'playSong', [this.element] );
			}.bind(this));
			this.ws.load( 'audio/'+this.options.mp3 );
		},

		play: function() {
			console.log('song > play, this.ws:',this.ws,', this.element:',this.element,', this.options.mp3:',this.options.mp3);
			this.ws.play();
		},

		stop: function() {
			console.log('song > stop, this.element:',this.element);
			this.ws.stop();
		},

	});
})( jQuery )