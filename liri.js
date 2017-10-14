var request = require("request");
var fs = require('fs');


var Twitter = require('twitter');
var twitterKeys = require("./keys.js");
var client = new Twitter(twitterKeys);

var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: "eb19488d04634b51bf2b63cfb270eeb8",
  secret: "a2b3524e798c487fa0bf0af61e1e3b2e"
});


var fileDataArray = [];
var command = process.argv[2];
var args = process.argv[3];

  function getTweets(){
    console.log("----------------Last 20 Tweets--------------------");
    client.get('statuses/user_timeline', {count: 20}, function(error, tweets, response) {
        if(error) {
          throw error;
        }
        for (var x = 0; x < tweets.length; x++){
          console.log(tweets[x].created_at);
          console.log(tweets[x].text);
          console.log("--------------------------------");
        }
    });
  };

  function getSpotify(song){
    var artistArray = [];
    if (song == null){
    song = "\"" + "The Sign" + "\"";
    }
  
    spotify
      .search({ type: 'track', query: song })
      .then(function(response) {
        for (var x = 0; x < response.tracks.items[0].artists.length; x++){
         artistArray.push(response.tracks.items[0].artists[x].name);
        }

        console.log("Artist(s) Name(s): " + artistArray.join(", "));
        console.log("The Song's Name: " + response.tracks.items[0].name);
        console.log("Spotify preview Link: " + response.tracks.items[0].preview_url);
        console.log("Album Name: " + response.tracks.items[0].album.name);
      })
      .catch(function(err) {
        console.log(err);
      });
  };


  function getMovie(movie){
    if (movie == null){
      movie = "\"" + "Mr. Nobody" + "\"";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";

    request(queryUrl, function (error, response, body){
      if (!error && response.statusCode === 200){
        var result = JSON.parse(body);
        console.log("Title of the movie: " + result.Title);
        console.log("Year the movie came out: " + result.Year);
        console.log("IMDB Rating of the movie: " + result.Ratings[0].Value);
        console.log("Rotten Tomatoes Rating of the movie: " + result.Ratings[1].Value);
        console.log("Country where the movie was produced: " + result.Country);
        console.log("Language of the movie: " + result.Language);
        console.log("Plot of the movie: " + result.Plot);
        console.log("Actors in the movie: " + result.Actors);
      }
    });
  }







if (command === "my-tweets"){
  getTweets();
}else if (command === "spotify-this-song"){
  getSpotify(args);
}else if (command === "movie-this"){
  getMovie(args);
}else if (command === "do-what-it-says"){
  fs.readFile("random.txt", "utf8", function(error, data) {
      if (error){
        return console.log(error);
      }
      else {
      // Then split it by commas (to make it more readable)
          dataArr = data.split(",");
          var fileCommand = dataArr[0];
          var fileArgs = dataArr[1];

          if (fileCommand === "my-tweets"){
            getTweets();
          }else if (fileCommand === "spotify-this-song"){
            getSpotify(fileArgs);
          }else if (fileCommand === "movie-this"){
            getMovie(fileArgs);
          }
      }
  });
}