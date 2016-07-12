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
	var isMobile = false; //initiate as false
	// device detection
	if ( /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
	    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
		isMobile = true;
	}
	var $playMobile = $('.play-mobile');
	$playMobile.hide();
	//console.log('isMobile:',isMobile);

	function setSong( song, playlist, playDelay ) {
		stop();
		$playMobile.hide();
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
		$('body, html').css('background-image', 'url("http://www.fridaynightjamz.com/img/'+song.image+'")');
		$('.current_song-title').text( song.title );
		$('.current_song-title-time').removeClass('hidden');
		$loadProgress.outerWidth( '100%' ); //'0%' );
		setTimeout( function() {
			$ws.off('mouseup');
			var mp3_url = curSong.mp3.indexOf('http://') > -1 ? curSong.mp3 : 'http://www.fridaynightjamz.com/audio/'+curSong.mp3
			ws.load(mp3_url, curSong.peaks);
			if ( isMobile ) {
				$playMobile.show();
			}
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
	function play( fromClick ) {
		$ws.find(' > wave').css('background-image', 'none' );
		if ( !curSong ) {
			fromClick = false;
			var song = getSong('first');
			setSong( song.song, song.playlist );
		}
		if ( intervalId ) {
			clearInterval( intervalId );
		}
		intervalId = setInterval( updateTime.bind(this), 1000);
		updateTime();
		if ( fromClick ) {
			$playMobile.hide();
			//console.log('play, fromClick:',fromClick,', ws.isPlaying():',ws.isPlaying());
		}
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
		if ( isMobile ) {
			$ws.find(' > wave').css('background-image', 'url("img/wav_bg.png")' );
		}
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
		var cols = 'col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1'
		var listTemplate = '<section class="play-list '+cols+'" id="'+data.id+'"><hgroup class="play-list-details clearfix">'
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
	        	+'<span class="item-name">'+song.title+'</span></li><div style="clear:both"></div>';
	        var $item = $( itemTemplate ).appendTo( $items );
	        $item.find( '.item-thumb' ).css( 'background-image', 'url("'+'http://www.fridaynightjamz.com/img/'+song.image+'")' );
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
    	$loadProgress.outerWidth( '100%' );
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
		//$loadProgress.outerWidth( pct + '%' );
		//console.log(curSong.title,'> loading, pct:',pct);
		if ( pct >= 100 ) {
			addClickPlayHandler();
		}
	});
	ws.on('ready', function () {
		//console.log(curSong.title,'> ready');
		if ( curSong.peaks ) {
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
			playing ? pause() : play( true );
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
    $playMobile.on('click', function() {
    	play( true );
    });
	_.each( fnj.playlists, function( playlist ) {
		playlist.id = makeId( true );
		addPlaylist( playlist );
	});
})();