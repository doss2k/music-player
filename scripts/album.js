var createSongRow = function (songNumber, songName, songLength) {
  var template =
     '<tr class="album-view-song-item">'
   + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
   + '  <td class="song-item-title">' + songName + '</td>'
   + '  <td class="song-item-duration">' + fmtMSS(songLength) + '</td>'
   + '</tr>'
   ;

  var handleSongClick = function () {
    var clickedSongNumber = $(this).attr('data-song-number');

    // 1. There is a song that is currently playing
    if (currentlyPlayingSongNumber !== null) {
      var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');

      currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }

    // 2. There is a song currently playing, but a different one was clicked to play
    if (clickedSongNumber !== currentlyPlayingSongNumber) {
      if(currentSoundFile) {
      currentSoundFile.stop();
      } 
      currentlyPlayingSongNumber = clickedSongNumber;

      // set up the song to play
      setSong(currentlyPlayingSongNumber);
      currentSoundFile.play();

      $(this).html(pauseButtonTemplate);

      // 3. The currently playing song was clicked
    } else {
      currentSoundFile.togglePlay();      
      if(currentSoundFile.isPaused()) {
        $(this).html(playButtonTemplate);
      } else {
        $(this).html(pauseButtonTemplate);
      }
    }
    displayCurrentlyPlayingSong(clickedSongNumber);
  };

  var onHover = function () {
    var songItem = $(this).find('.song-item-number');
    var songNumber = songItem.attr('data-song-number');

    // if the song being hovered over isn't the one being played
    if (songNumber !== currentlyPlayingSongNumber || currentSoundFile.isPaused()) {
      // show the play button
      songItem.html(playButtonTemplate);
    }
  };

  var offHover = function () {
    var songItem = $(this).find('.song-item-number');
    var songNumber = songItem.attr('data-song-number');

    // if the song being hovered over isn't the one being played
    if (songNumber !== currentlyPlayingSongNumber){
      // revert back to just showing the song number
      songItem.html(songNumber);
    }
  }

  var $row = $(template);

  $row.find('.song-item-number').click(handleSongClick);
  $row.hover(onHover, offHover);

  return $row;
};


var setCurrentAlbum = function(album) {
  //currentAlbum = album;

  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $songRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($songRow);
  }
};

var setSong = function (songNumber) {
  currentSoundFile = new buzz.sound(albums[currentAlbum].songs[songNumber - 1].audioUrl, {
    formats: [ 'mp3' ],
    preload: true,
  });
  return currentSoundFile;
};

var displayCurrentlyPlayingSong = function (clickedSongNumber) {
  var currentSong = albums[currentAlbum].songs[clickedSongNumber - 1];
    $('.song-name').html(currentSong.title);
    $('.artist-name').html(albums[currentAlbum].artist);
    $('.total-time').html(fmtMSS(currentSong.duration)); 
    $('.artist-song-mobile').html(currentSong.title + ' - ' + albums[currentAlbum].artist);
}

//TODO: Dont believe previous album is working correctly go back and check
var changeAlbum = function() {
  if($(this).find('.ion-arrow-right-a')) {
    if(currentAlbum === albums.length - 1) {
      currentAlbum = 0;
    } else {
    currentAlbum += 1;
    }
  } else if ($(this).find('.ion-arrow-left-a')) {
    currentAlbum -= 1;
  }
  setCurrentAlbum(albums[currentAlbum]);
}

var playPauseFromControls = function() {
  currentSoundFile.togglePlay();
  if(currentSoundFile.isPaused()) {
    $(this).html(playControlTemplate);
  } else {
    $(this).html(pauseControlTemplate);
  }
}

// Takes in a time duration of seconds and returns it in minutes and seconds
function fmtMSS(s){
  return(s-(s%=60))/60+(9<s?':':':0')+s
}

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playControlTemplate = '<a class="play-pause"><span class="ion-play"></span></a>';
var pauseControlTemplate = '<a class="play-pause"><span class="ion-pause"></span></a>';

var currentlyPlayingSongNumber = null;
var currentSoundFile = null;
var currentAlbum = 0;

$('.change-album').click(changeAlbum);
$('.play-pause').click(playPauseFromControls);


$('document').ready(function () {
  setCurrentAlbum(albums[currentAlbum]);
});