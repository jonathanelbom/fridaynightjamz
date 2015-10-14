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
	var ws = Object.create(WaveSurfer);

	function setSong( song, playlist, playDelay ) {
		ws.stop();
		playDelay = playDelay || 500;
		curSong = song;
		curPlaylist = playlist;
		$('.play-list-item').removeClass('selected');
		$('.play-list-item#'+song.id).addClass('selected');
		$('body, html').css('background-image', 'url("/img/'+song.image+'")');
		$('.current-song').text( song.title );
		$loadProgress.outerWidth( '0%' );
		setTimeout( function() {
			ws.load('/audio/'+curSong.mp3);
		}, playDelay);

	}
	function playSongFromLink ( songId, playlistId ) {
    	var playlist = _.findWhere( fnj.playlists, {id:playlistId} );
    	var song = _.findWhere( playlist.songs, {id:songId} );
    	var delay = 0;
    	if ( $ws.outerHeight() < 5 ) {
    		$main.css( 'padding-top', parseInt( $main.css('padding-top'), 10) + wavHeight );
    		$ws.outerHeight( wavHeight);
    		delay = 500;
    	}
    	setSong( song, playlist, delay );
    }

	function addPlaylist( data ) {
		var listTemplate = '<section class="play-list row" id="'+data.id+'"><hgroup class="play-list-details">'
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
	        $item.find( '.item-thumb' ).css( 'background-image', 'url("'+'/img/'+song.image+'")' );
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

	ws.init({
		container: '#wavesurfer',
		waveColor: '#666',
		progressColor: color,
		cursorColor: color,
		barWidth: 3,
		audioCtx: audioCtx,
		height: wavHeight,
		minPxPerSec: 1,
		scrollParent: false,
		fillParent: true,
		backend: 'MediaElement'
	});
	$ws.on('mouseup', function() {
		ws.play();
	});
	ws.on('loading', function( pct ){
		$loadProgress.outerWidth( pct + '%' );
		if ( pct >= 100 ) {
			setTimeout( function() {
				ws.play();
			}, 500);
		}
	});
	ws.on('ready', function () {
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