var Spotify = (function () {
  var search = function (query) {
    var url = "http://ws.spotify.com/search/1/track.json?q=" + query;
    var results = $.ajax({
      url : url,
      method : "GET",
      dataType : "json",
      async : false
    });

    return _.map( JSON.parse( results.responseText ).tracks, function (track) {
      return {
        href : track.href,
        name : track.name,
        artist : track.artists[0].name,
        length : track.length,
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

