// require dotenv
require("dotenv").config();

// require keys
const keys = require("./keys.js");

const request = require('./node_modules/request');
// npm spotify
const Spotify = require('node-spotify-api');

// npm axios
const axios = require('axios');

// npm moment
let moment = require('moment');
moment().format();

// npm fs
const fs = require('fs');

const divider = '\n-------------------\n\n'
const nodeArg = process.argv;
let actions = nodeArg[2];
let entertainment = process.argv.slice(3).join(" ");

function shows() {
        fs.appendFileSync('log.txt', entertainment + divider + '\n', function(error){
            if(error) {
                console.log(error);
            }
        });

        // request bandsintown api for venue
        const queryURL = 'https://rest.bandsintown.com/artists/' + entertainment + '/events?app_id=codingbootcamp';
        request(queryURL, function(error, response, body){
            if(!error && response.statusCode === 200) {
                // parse's the response
                 const data = JSON.parse(body);

                for (let i = 0; i < data.length; i++) {
                    console.log('Venue: ' + data[i].venue.name + '\n'), function (error){
                        if (error) {
                            console.log(error);
                        }
                    };
                    if (data[i].venue.region === '') {
                        console.log('Location: ' + data[i].venue.city + ', ' + data[i].venue.country);
                        // add to log.txt
                        fs.appendFileSync('log.txt', 'Location: ' + data[i].venue.city + ', ' + data[i].venue.country, function(error){
                            if (error) {
                                console.log(error);
                            }
                        });
                    } else {
                        console.log('log.txt', 'Location: ' + data[i].venue.city + ', ' + data[i].venue.region + data[i].venue.country, function(error){
                            if (error) {
                                console.log(error);
                            }
                        });
                    }

                    // formatted date of show
                    let date = data[i].datetime;

                    date = moment(date).format('MM/DD/YYYY');
                    console.log('Date: ' + date);
                    fs.appendFileSync('log.txt', 'Date: ' + date + divider, function(error){
                        if (error) {
                            console.log(error);
                            }
                    })
                }
            }
            console.log(divider);
        })
}

function spotify() {
    const spotify = new Spotify(keys.spotify);
    if(!entertainment) {
        entertainment = 'All the Small Things';
    }
    spotify.search({ type: 'track', query: entertainment, limit: 5 }, function (err, data){
            let songs = data.tracks.items;
            // Append 'Artist' and the divider to log.txt, print 'Artist' to the console
            for (var i = 0; i < 4; i++){
                console.log(songs[i].name);
                const artistArr = songs[i].artists;
                const artists = [];

                for (var x = 0; x < artistArr.length; x++){
                artists.push(artistArr[i].name);
                }
                console.log('Artists: ' + artists.join(', '));
                if (songs[i].preview_url){
                console.log('Preview: ' + songs[i].preview_url);
                }
                console.log('Album: ' + songs[i].album.name);
                console.log(divider);
                }

            // Append 'Artist' and the divider to log.txt, print 'Artist' to the console
            fs.appendFile('log.txt', 'Artist: ' + artists[i].name + divider, function(err) {
                if (err)
                  throw err;
              });
            });
}

// Title of the movie.
// Year the movie came out.
// IMDB Rating of the movie.
// Rotten Tomatoes Rating of the movie.
// Country where the movie was produced.
// Language of the movie.
// Plot of the movie.
// Actors in the movie.
function movie(){
    const queryUrl = "http://www.omdbapi.com/?t=" + entertainment + "&y=&plot=short&apikey=trilogy";

    if(!entertainment) {
        entertainment = console.log("If you haven't watched 'Mr. Nobody', then you should: <http://www.imdb.com/title/tt0485947/>");
        console.log("It's on Netflix!");
    } 
    axios.get(queryUrl).then(
        function(response) {
            const showMovieData = [
                'Title: ' + response.data.Title,
                'Release Year: ' + response.data.Year,
                'Ratings: ' + response.data.imbdRating,
                'Released: ' + response.data.Released,
                'Language: ' + response.data.Language,
                'Plot: ' + response.data.Plot,
                'Actors: ' + response.data.Actors,
                'Country: ' + response.data.Country
            ].join('\n\n');

            // Append showMovieData and the divider to log.txt, print showMovieData to the console
            fs.appendFile('log.txt', showMovieData + divider + '\n', function(err) {
            if (err)
              throw err;
            console.log(showMovieData);
          });
        }
          
          );
        }

// runs the functions based off of the action performed
function runActions(){
    switch(actions){
        case 'concert-this':
            shows();
        break;
        case 'spotify-this-song':
            spotify();
        break;
        case 'movie-this':
            movie();
        break;

        default:
        console.log('Search for something..');
    }
}

if(actions == 'do-what-it-says') {
    // reads the random.txt file
    fs.readFile('random.txt', 'utf8', function(err, data){
        if (err) {
            console.log(err);
        }
        // split items and stores in array
        let readArr = data.split(',');
        actions = readArr[0];
        entertainment = readArr[1];
        // re-display content as array
        runActions();

    })
}

runActions();
// testing shows
// return shows()
