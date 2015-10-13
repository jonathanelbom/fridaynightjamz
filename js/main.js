(function() {
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	var audioCtx = new AudioContext();
	var songs = [];
	var playing = false;
	var loading = false;
	var curSong;
	for (var i=0;i<6;i++) {
		songs.push({
			url:'audio/'+i+'.mp3'
		});
	}
	var $container = $('main');
	var config = {
		waveColor: '#666',
		progressColor: '#00C7FF'
	};
	_.each( songs, function( song, idx ) {
		var id = 's'+idx;
		var $song = $('<div id="s'+idx+'" class="song row"></div>');
		var $button = $('<button class="playpause"><i class="fa fa-play"></i></button>').appendTo( $song );
		var $creds = $('<div class="creds"></div>').appendTo( $song );
		var $name = $('<span class="name">song title here</span>').appendTo( $creds );
		var $artist = $('<span class="artist">jonnybomb</span>').appendTo( $creds );
		var $wav = $('<div class="wav"></div>').appendTo( $song );
		$song.appendTo( $container );
		var ws = Object.create(WaveSurfer);
		ws.init({
		    container: '#s'+idx+'> .wav',
		    waveColor: config.waveColor,
		    progressColor: config.progressColor,
		    barWidth: 3,
		    backend: 'MediaElement',
		    audioContext: audioCtx,
		    minPxPerSec: 1,
		    scrollParent: false,
		    fillParent: true
		});
		song.id = id;
		song.elem = $song;
		song.ws = ws;
		ws.on('ready', function (e) {
			//console.log('ready, e:',e,', this:',this);
		});
		$wav.on('mouseup', function (e) {
			console.log('mouseup, e:',e,', this:',this);
			playSong( _.findWhere( songs, {id: $(this).closest('.song').attr('id')} ) );
		});
		ws.load('audio/'+idx+'.mp3');
	});
	function playSong( song ) {
		console.log('playSong, song:',song,', curSong:',curSong);
		if ( curSong ) {
			if ( song === curSong ) {
				curSong.ws.play();
				return;
			} else {
				curSong.ws.stop();
				playing = false;
			}
		}
		if ( !playing ) {
			song.ws.play();
		}
		curSong = song;

	}

})();