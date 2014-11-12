var Spotify = (function () {
  var search = function (query) {
    var url = "https://api.spotify.com/v1/search?type=track&q=" + query;
    var results = $.ajax({
      url : url,
      method : "GET",
      dataType : "json",
      async : false
    });

    return _.map( JSON.parse( results.responseText ).tracks.items, function (track) {
      return {
        href : track.uri,
        name : track.name,
        artist : track.artists[0].name,
        length : track.duration_ms / 1000,
        toString : function() {
          return JSON.stringify(this);
        },
        toLowerCase: function() {
          return this.name.toLowerCase();
        },
        indexOf: function(string) {
          return String.prototype.indexOf.apply(this.name, arguments);
        },
        replace: function(string) {
          return String.prototype.replace.apply(this.name, arguments);
        }
      }
    });
  };

  return {
    search : search
  }
}());

