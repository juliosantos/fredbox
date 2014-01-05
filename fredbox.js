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
    "click .upvote" : function () {
      if (typeof Session.get( this._id ) === "undefined") {
        Track.upvote(this);
        Session.set( this._id, true );
      } else {
        alert( "Please don't upvote a track more than once." );
      }
    },
    "click .remove" : function () {
      Track.destroy( this );
    },
    "click .play" : function () {
      Session.set( "currentUri", this.href );

      Track.stopAll();
      Track.play( this );
    }
  });

  Template.oldtracks.show = function () {
    return isAdmin ? "inline-block" : "none";
  };
  Template.oldtracks.events({
    "click .remove" : function () {
      Track.destroy( this );
    },
    "click .play" : function () {
      Session.set( "currentUri", this.href );

      Track.stopAll();
      Track.play( this );
    },
    "click .revive" : function () {
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

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

