// require dotenv
require("dotenv").config();

// require keys
const keys = require("./keys.js");

const request = require('./node_modules/request');
// npm spotify
// const spotify = new Spotify(keys.spotify);

// npm moment
// let = require('moment');
// moment().format();

// npm fs
const fs = require('fs');

const divider = '\n-------------------\n\n'
const nodeArg = process.argv;
const actions = nodeArg[2];
const entertainment = process.argv.slice(3).join(" ");

function shows() {
    switch(actions) {
        case 'concert-this':

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
                    console.log('Venue: ' + data[i].venue.name + '\n', function (error){
                        if (error) {
                            console.log(error);
                        }
                    });
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
                    const date = data[i].datetime;

                    date = moment(date).format('MM/DD/YYYY');
                    console.log('Date: ' + date);

                    fs.appendFileSync('log.txt', 'Date: ' + date + divider, function(error){
                        if (error) {
                            console.log(error);
                        }
                    })
                }
            }
        })
        console.log(divider);
        break;

        
    }

}

// testing shows
// return shows();