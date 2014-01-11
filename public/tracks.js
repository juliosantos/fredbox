var Track = function (track) {
  this.name = track.name;
  this.href = track.href;
  this.artist = track.artist;
  this.length = track.length;

  this.score = track.score || 0;
  this.currentScore = track.currentScore || 0;
  this.playCount = track.playCount || 0;

  this.old = track.old || false;
  this.playing = track.playing || false;
};

Track.destroy = function (track) {
  Tracks.remove( track._id );
};

Track.upvote = function (track) {
  Tracks.update( track._id, {
    $inc : {
      score : 1,
      currentScore : 1
    }
  });
};

Track.stopAll = function () {
  var playing = Tracks.findOne( {playing : true} );
  if (playing) {
    Tracks.update( playing._id, {
      $set : {
        old : true,
        playing : false
      }
    });
  }
};

Track.play = function (track) {
  Tracks.update( track._id, {
    $set : {playing : true},
    $inc : {playCount : 1}
  });
};

Track.revive = function (track) {
  Tracks.update( track._id, {
    $set : {
      old : false,
      playing : false,
      currentScore : 0
    }
  });
};

Track.queued = function () {
  return Tracks.find( {old : false, playing : false}, {sort : {currentScore : -1}} );
};

Track.old = function () {
  return Tracks.find( {old : true}, {sort : {score : -1}} );
}

Track.playing = function () {
  return Tracks.findOne( {playing : true} );
}

