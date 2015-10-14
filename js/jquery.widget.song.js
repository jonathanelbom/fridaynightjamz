(function ($) {
	$.widget( 'fridaynightjamz.song', {
		button: null,
		time: null,
		wav: null,
		loadProgress: null,
		playing: false,

		_create: function() {
			//console.log('song, _create, this.element:',this.element,', this.options:',this.options);
			this.element.attr('id', this.options.id);
			//console.log( 'this.options:',this.options );
			var template = '<button class="playpause" disabled><i class="fa fa-play"></i></button><div class="details">'
				+'<div class="details-top"><span class="name">'+this.options.title+'</span><span class="playlist">'+this.options.playlistData.title+'</span></div>'
				+'<div class="details-bottom"><span class="artist">'+this.options.playlistData.participants+'</span><span class="time"></span></div></div>'
				+'<div class="wav"></div>'
				+'<div class="loadProgress"><div></div></div>';
			$( template ).appendTo( this.element );
			this.button = this.element.find('.playpause');
			this.wav = this.element.find('.wav');
			this.time = this.element.find('.time');
			this.loadProgress = this.element.find('.loadProgress > div');
			// $button = $('<button class="playpause"><i class="fa fa-play"></i></button>').appendTo( this.element );
			// $details = $('<div class="details"></div>').appendTo( this.element );
			// $detailsTop =
			// $creds = $('<div class="creds"></div>').appendTo( this.element );
			// $name = $('<span class="name">'+this.options.title+'</span>').appendTo( $creds );
			// $artist = $('<span class="artist">'+this.options.playlistData.participants+'</span>').appendTo( $creds );
			// $wav = $('<div class="wav"></div>').appendTo( this.element );
			this.ws = Object.create(WaveSurfer);
			this.ws.init( $.extend({
				container: '#'+this.options.id+'> .wav'
			}, fnj.config ) );

			// this.ws.on('ready', function () {
			// 	console.log('ready, this.$wav:',this.$wav);
			// 	this.$wav.on('mouseup', function (e) {
			// 		console.log('mouseup, e:',e,', this.element:',this.element,', this:',this);
			// 		$(document).trigger( 'playSong', [this.element] );
			// 	}.bind(this));
			// }.bind(this));

			//this.ws.on('ready', this._ready.bind(this) );
			this.ws.on('loading', this._loading.bind(this) );
				//console.log('loading, this.options.id:',this.options.id,', pct:',pct);
				//this._updateLoader( pct );
				// if ( pct >= 100 ) {
				// 	//this.$wav.removeClass('loading');
				// }
			//}.bind(this));
			this.ws.load( 'audio/'+this.options.mp3 );
		},

		_loading: function( pct ) {
			//console.log('_updateLoader, pct:',pct);
			this.loadProgress.outerWidth( pct + '%' );
			if ( pct >= 100 ) {
				//console.log('     this.element:',this.element);
				this._ready();
			}
		},

		_showTime: function() {
			console.log('showTime, this.options.id:',this.options.id);
			this.time.text( this._formatTime(this.ws.getDuration()) );
		},

		_ready: function() {
			//this._showTime();
			var time = this.ws.getDuration();
			console.log('time:',time);
			//this.time.text( this._formatTime() );
			//this.wav.innerHeight( fnj.config.height );
			// try {
			// 	this._showTime();
			// } catch( e ) {
			// 	console.log('showtime, error, e:',e);
			// 	window.setTimeout( this._showTime.bind(this), 1000 );
			// }

			this.button.on( 'click', function() {
				console.log('this.playing:',this.playing);
				if ( !this.playing) {
					$(document).trigger( 'playSong', [this.element] );
				} else {
					this.pause();
				}
			}.bind(this))
				.removeAttr('disabled');

			this.wav.on('mouseup', function (e) {
				$(document).trigger( 'playSong', [this.element, true] );
			}.bind(this));

			window.setTimeout( function() {
				this.loadProgress.addClass( 'done' );
				this._showTime();
			}.bind(this), 1000);

		},

		_toggleButton: function() {
			//console.log('this.button:',this.button);
			this.button.find('i').removeClass('fa-play fa-pause')
				.addClass( this.playing ? 'fa-pause' : 'fa-play' );
		},

		play: function() {
			console.log('song > play, this.ws:',this.ws,', this.element:',this.element,', this.options.mp3:',this.options.mp3);
			this.ws.play();
			this.playing = true;
			this._toggleButton();
			console.log('this.options.image:',this.options.image)
			$('body, html').css('background-image', 'url("img/'+this.options.image+'")')
		},

		pause: function() {
			console.log('song > pause, this.ws:',this.ws,', this.element:',this.element,', this.options.mp3:',this.options.mp3);
			this.ws.pause();
			this.playing = false;
			this._toggleButton();
			console.log('this.options.image:',this.options.image)
			$('body, html').css('background-image', 'url("img/'+this.options.image+'")')
		},

		stop: function() {
			console.log('song > stop, this.element:',this.element);
			this.ws.stop();
			this.playing = false;
			this._toggleButton();
		},

		_formatTime: function( time ) {
			var minutes = Math.floor(time / 60);
			var seconds = time - minutes * 60;
			function str_pad_left(string,pad,length) {
 			   return (new Array(length+1).join(pad)+string).slice(-length);
 			}
 			return str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
		}

	});
})( jQuery )