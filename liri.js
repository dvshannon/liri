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
const actions = nodeArg[2];
const entertainment = process.argv.slice(3).join(" ");

function shows() {
        fs.appendFileSync('log.txt', entertainment + divider, function(error){
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
            if (err){
                console.log('Error occurred: ' + err);
                return;
            }
            const songs = data.tracks.items;

            for (var i = 0; i < 4; i++){
                console.log(songs[i].name);
                const artistArr = songs[i].artists;
                const artists = [];

                for (var x = 0; x < artistArr.length; x++){
                artists.push(artistArr[i].name);
                }
                console.log("Artists: " + artists.join(", "));
                if (songs[i].preview_url){
                console.log("Preview: " + songs[i].preview_url);
                }
                console.log("Album: " + songs[i].album.name);
                console.log(divider);
                }
            });
}

function runActions(){
    switch(actions){
      case "concert-this":
          shows();
        break;
      case "spotify-this-song":
          spotify();
        break;

      default:
        console.log("Search for something..");
    }
}
    runActions();
// testing shows
// return shows()