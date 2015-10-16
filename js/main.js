(function() {
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	var audioCtx = new AudioContext();
	var songWidgets = [];
	var songs = [];
	var playing = false;
	var loading = false;
	var ready = false;
	var curPlaylist;
	var curSong;
	var wavHeight = 100;
	var color = $('#color').css('color');
	var $main = $('main');
	var $ws = $('#wavesurfer');
	var $loadProgress = $('.loadProgress');
	var $play = $('.playpause');
	var $prev = $('.prev');
	var $next = $('.next');
	var $time = $('.current_song-time');
	var intervalId;
	var ws = Object.create(WaveSurfer);

	function setSong( song, playlist, playDelay ) {
		stop();
		var delay = 0;
    	if ( $ws.outerHeight() < 5 ) {
    		$main.css( 'padding-top', parseInt( $main.css('padding-top'), 10) + wavHeight );
    		$ws.outerHeight( wavHeight);
    		delay = 500;
    	}
		playDelay = playDelay || 500;
		curSong = song;
		curPlaylist = playlist;
		$('.play-list-item').removeClass('selected');
		$('.play-list-item#'+song.id).addClass('selected');
		$('body, html').css('background-image', 'url("img/'+song.image+'")');
		$('.current_song-title').text( song.title );
		$('.current_song-title-time').removeClass('hidden');
		$loadProgress.outerWidth( '0%' );
		setTimeout( function() {
			$ws.off('mouseup');
			ws.load('audio/'+curSong.mp3, curSong.peaks);
			// if ( curSong.peaks ) {

			// }
		}, playDelay);
	}
	function updateTime() {
		var time = formatTime( ws.getCurrentTime() )+' / '+formatTime( ws.getDuration() );
		$time.text( time );
	}
	function getSong( type ) {
		var song;
		var playlist;
		var playlists = fnj.playlists;
		if ( !curPlaylist ) {
			curPlaylist = playlists[0];
		}
		var songs = curPlaylist.songs;
		var playlistIdx = playlists.indexOf( curPlaylist );
		var songIdx = songs.indexOf( curSong );
		switch( type ) {
			case 'first':
				song = playlists[0].songs[0];
				break;
			case 'next':
				if (songIdx < songs.length - 1) {
					playlist = curPlaylist;
					song = songs[ songIdx+1 ];
				} else {
					if ( playlistIdx < playlists.length -1 ) {
						playlist = playlists[ playlistIdx+1 ];
					} else {
						playlist = playlists[0];
					}
					song = playlist.songs[0];
				}
				break;
			case 'prev':
				if (songIdx > 0) {
					playlist = curPlaylist;
					song = songs[ songIdx-1 ];
				} else {
					if ( playlistIdx > 0 ) {
						playlist = playlists[ playlistIdx-1 ];
					} else {
						playlist = playlists[playlists.length-1];
					}
					song = playlist.songs[playlist.songs.length-1];
				}
				break;
		}
		return { song:song, playlist:playlist };
	}
	function play() {
		if ( !curSong ) {
			var song = getSong('first');
			setSong( song.song, song.playlist );
		}
		if ( intervalId ) {
			clearInterval( intervalId );
		}
		intervalId = setInterval( updateTime.bind(this), 1000);
		updateTime();
		playing = true;
		ws.play();
		$play.find('i').removeClass('fa-play').addClass('fa-pause');
	}
	function pause() {
		if ( intervalId ) {
			clearInterval( intervalId );
		}
		playing = false;
		ws.pause();
		$play.find('i').removeClass('fa-pause').addClass('fa-play');
	}
	function stop() {
		if ( intervalId ) {
			clearInterval( intervalId );
		}
		$time.text( '' );
		playing = false;
		if ( ws.isPlaying() ) {
			ws.stop();
		}
		ws.empty();
		$play.find('i').removeClass('fa-pause').addClass('fa-play');
	}
	function nextPrev( next ) {
		var song = getSong( !curSong ? 'first' : next ? 'next' : 'prev' );
		setSong( song.song, song.playlist );
	}

	function playSongFromLink ( songId, playlistId ) {
    	var playlist = _.findWhere( fnj.playlists, {id:playlistId} );
    	var song = _.findWhere( playlist.songs, {id:songId} );
    	setSong( song, playlist );
    }

	function addPlaylist( data ) {
		var listTemplate = '<section class="play-list col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1" id="'+data.id+'"><hgroup class="play-list-details">'
			+'<h1 class="play-list-title">'+data.title+'</h1>'
            +'<span class="play-list-artist">'+data.participants+'</span>'
            +'</hgroup><ul class="play-list-items"></ul></section>';
		var itemTemplate = '<li class="play-list-item">'
        	+'<span class="item-thumb"></span>'
        	+'<span class="item-count">1</span>'
        	+'<span class="item-name">Naa Naa Wah Wah<span></li>';
        var $list = $( listTemplate );
        var $items = $list.find('.play-list-items');
        _.each( data.songs, function( song, idx ) {
        	song.id = makeId();
        	var itemTemplate = '<li class="play-list-item" id="'+song.id+'">'
	        	+'<span class="item-thumb"></span>'
	        	+'<span class="item-count">'+(idx+1)+'</span>'
	        	+'<span class="item-name">'+song.title+'<span></li>';
	        var $item = $( itemTemplate ).appendTo( $items );
	        $item.find( '.item-thumb' ).css( 'background-image', 'url("'+'img/'+song.image+'")' );
        });
		$list.appendTo( $main );
	}

    function makeId ( isPlaylist ) {
        var uniqueness = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (var i = 0; i < 6; i++) {
            if (i === 0) {
                uniqueness += isPlaylist ? 'p_' : 's_';
            } else {
                uniqueness += possible.charAt(Math.floor(Math.random() * possible.length));
            }
        }
        return uniqueness;
    }
    function addClickPlayHandler() {
		//console.log( curSong.title,'> addClickPlayHandler');
    	return;
    	$ws.off('mouseup').on('mouseup', function() {
			play();
		});
    }
    function formatTime( time ) {
		time = parseInt( time );
		if ( isNaN(time) ) {
			time = 0;
		}
		var minutes = Math.floor(time / 60);
		var seconds = 	time - (minutes * 60);
		function str_pad_left(string,pad,length) {
		   return (new Array(length+1).join(pad)+string).slice(-length);
		}
		return str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
	}
	ws.init({
		container: '#wavesurfer',
		waveColor: '#666',
		progressColor: color,
		cursorColor: color,
		barWidth: 1,
		audioCtx: audioCtx,
		height: wavHeight,
		minPxPerSec: 1,
		scrollParent: false,
		fillParent: true,
		backend: 'MediaElement'
	});
	ws.on('loading', function( pct ){
		$loadProgress.outerWidth( pct + '%' );
		//console.log(curSong.title,'> loading, pct:',pct);
		if ( pct >= 100 ) {
			addClickPlayHandler();
		}
	});
	ws.on('ready', function () {
		//console.log(curSong.title,'> ready');
		if ( curSong.peaks ) {
			$loadProgress.outerWidth( '100%' );
			addClickPlayHandler();
		}
		play();
	});
	ws.on('finish', function () {
		nextPrev( true );
	});
	$('.current_song-controls').on('click', '.btn', function(e) {
		var $btn = $(e.currentTarget);
		if ( $btn.hasClass('playpause') ){
			playing ? pause() : play();
		} else if ( $btn.hasClass('next') ){
			nextPrev( true );
		} else if ( $btn.hasClass('prev') ){
			nextPrev( false );
		}
	});
    $main.on( 'click', '.play-list-item', function(e) {
    	var $item = $(this);
    	playSongFromLink( $item.attr('id'), $item.closest('.play-list').attr('id') );
    });

	_.each( fnj.playlists, function( playlist ) {
		playlist.id = makeId( true );
		addPlaylist( playlist );
	});
})();