(function() {
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	var audioCtx = new AudioContext();
	var songWidgets = [];
	var songs = [];
	var playing = false;
	var loading = false;
	var curSong;
	var color = $('#color').css('color');
	console.log('color:',color);
	// $('body').on('playSong', '.song', function() {
	// 	console.log('document playSong');
	// })
	var manager = {
		curSongWidgetElem: null,
		playing: false,
		loading: false,
		init: function () {
			console.log('manager > init');
			$(document).on('playSong', function( e, curSongWidgetElem ) {
				console.log('playSong, curSongWidgetElem:',curSongWidgetElem );
				this.playSong( curSongWidgetElem );
			}.bind(this));
		},
		playSong: function( songWidgetElem, pause ) {
			$( '.song:not(#'+songWidgetElem.attr('id')+')' ).song('stop');
			songWidgetElem.song('play');
			// }
			// if ( this.curSongWidgetElem ) {
			// 	if ( songWidgetElem === this.curSongWidgetElem ) {
			// 		console.log('same song');
			// 		this.curSongWidgetElem.song('stop');
			// 		this.curSongWidgetElem.song('play');
			// 		playing = true;
			// 		return;
			// 	} else {
			// 		this.curSongWidgetElem.song('stop');
			// 		playing = false;
			// 	}
			// }
			// this.curSongWidgetElem = songWidgetElem;
			// if ( !playing ) {
			// 	songWidgetElem.song('play');
			// 	playing = true;
			// }

		}
	}

	console.log('fnj:',fnj);
	fnj.songs = [];
	fnj.config = {
		waveColor: '#666',
		progressColor: color, //'#00C7FF',
		barWidth: 3,
		audioCtx: audioCtx,
		height: 50,
		minPxPerSec: 1,
		scrollParent: false,
		fillParent: true,
		backend: 'MediaElement'
	};
	_.each( fnj.playlists, function( playlist, pIdx) {
		playlist.data.idx = pIdx;
		_.each( playlist.songs, function( song, sIdx ) {
			song.playlistData = playlist.data;
			song.idx = sIdx;
			song.id = 's'+sIdx+'_'+playlist.data.date;
		});
		console.log('playlist.songs:',playlist.songs);
		fnj.songs = fnj.songs.concat( playlist.songs );
	});
	console.log('fnj.songs:',fnj.songs);
	_.each( fnj.songs, function ( song ) {
		$('<div class="song row"></div>').appendTo( $('main') ).song( song );
	});

	manager.init();
	/*
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
	function createSongWidget( songData, idx ) {

	}
	*/
})();