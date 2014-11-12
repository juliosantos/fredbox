Tracks = new Meteor.Collection( "tracks" );

if (Meteor.isClient) {
  var isAdmin = false;

  Template.player.uri = function () {
    return Session.get( "currentUri" ) || "spotify:track:6JEK0CvvjDjjMUBFoXShNZ";
  };

  Template.tracks.show = function () {
    return isAdmin ? "inline-block" : "none";
  };
  Template.tracks.tracks = function () {
    return Track.queued();
  };
  Template.tracks.events({
    "click .upvote" : function (event) {
      event.preventDefault();
      if (typeof Session.get( this._id ) === "undefined") {
        Track.upvote(this);
        Session.set( this._id, true );
      } else {
        alert( "Please don't upvote a track more than once." );
      }
    },
    "click .remove" : function (event) {
      event.preventDefault();
      Track.destroy( this );
    },
    "click .play" : function (event) {
      event.preventDefault();
      Session.set( "currentUri", this.href );

      Track.stopAll();
      Track.play( this );
    }
  });

  Template.oldtracks.show = function () {
    return isAdmin ? "inline-block" : "none";
  };
  Template.oldtracks.events({
    "click .remove" : function (event) {
      event.preventDefault();
      Track.destroy( this );
    },
    "click .play" : function (event) {
      event.preventDefault();
      Session.set( "currentUri", this.href );

      Track.stopAll();
      Track.play( this );
    },
    "click .revive" : function (event) {
      event.preventDefault();
      Track.revive( this );
      Session.set( this._id, undefined );
    }
  });
  Template.oldtracks.anytracks = function () { return Track.old().count(); };
  Template.oldtracks.tracks = function () { return Track.old(); };

  Template.nowplaying.trackname = function () {
    var track = Track.playing();
    return track && track.name;
  };
  Template.nowplaying.artist = function () {
    var track = Track.playing();
    return track && track.artist;
  };

  $( document ).ready( function () {
    $( "#search" ).typeahead({
      source : Spotify.search,
      minLength : 3,
      matcher : function () { return true; },
      updater : function (itemJson) {
        var item = JSON.parse( itemJson );
        var existing = Tracks.findOne({
          name : item.name,
          artist : item.artist
        });
        if (existing && !existing.old) {
          alert( "Sorry, that track's already on the list." );
        } else if (existing && existing.old) {
          Track.revive( existing );
        } else {
          var minutes = Math.floor( item.length / 60 );
          var seconds = Math.round( item.length - minutes * 60 );
          Tracks.insert( new Track({
            href : item.href,
            name : item.name,
            artist : item.artist,
            length : minutes + ":" + seconds,
          }));
        }
        return "";
      },
      highlighter : function (item) {
        return item.name + " <small>" + item.artist + "</small>";
      }
    });

    new Konami( function() {
      $( ".remove" ).css( {display : "inline-block"} );
      $( ".play" ).css( {display : "inline-block"} );
      $( "#player" ).show();
      isAdmin = true;
    });
  });
}

/*
Router.map(function () {
  this.route( "tracks", {
    where : "server",
    path : "/api/popTopTrack",
    action : function () {
      var statusCode = 200;
      var headers = {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Methods" : "GET",
        "Access-Control-Allow-Headers" : "*",
      };
      var track = Tracks.findOne( {old : false, playing : false}, {sort : {currentScore : -1}} );
      if (track) {
        var playing = Tracks.findOne( {playing : true} );
        if (playing) {
          Tracks.update( playing._id, {
            $set : {
              old : true,
              playing : false
            }
          });
        }
        Tracks.update( track._id, {
          $set : {playing : true},
          $inc : {playCount : 1}
        });
        this.response.writeHead( 200, headers );
        this.response.write( JSON.stringify( track ) );
        this.response.end();
      }
    }
  });
});
*/

if (Meteor.isServer) {
  /*
  Meteor.Router.add('/api/tracks', function() {
    var statusCode = 200;
    var headers = {
      "Access-Control-Allow-Origin" : "*",
      "Access-Control-Allow-Methods" : "GET",
      "Access-Control-Allow-Headers" : "*",
    };
    var body = {"a" : 10};
    return [statusCode, headers, body];
  });
  */
  Meteor.startup(function () {
  });
}

