const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const https =require('https');
const request = require('request');
const yargs = require('yargs');

const geocode = require('./geocode/geocode');
const weather =require('./weather/weather');

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.post('/get-movie-details', function (req, res) {
var action=req.body.result.action;
//action:'Movie'
if(action==="Movie"){
    let movieToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.Movie ? req.body.result.parameters.Movie : 'The Godfather';
    let reqUrl = encodeURI('http://theapache64.com/movie_db/search?keyword=' + movieToSearch );
    http.get(reqUrl, (responseFromAPI) => {

        responseFromAPI.on('data', function (chunk) {
            let movie = JSON.parse(chunk)['data'];
            console.log(movie);
            let dataToSend = movieToSearch === 'The Godfather' ? 'I don\'t have the required info on that. Here\'s some info on \'The Godfather\' instead.\n' : '';
            dataToSend += movie.name + ' is a ' + movie.stars + ' starer ' + movie.genre + ' movie, released in ' + movie.year + '. It was directed by ' + movie.director;

            return res.json({
                speech: dataToSend,
                displayText: dataToSend,
                source: 'first-webhook'
            });

        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'first-webhook'
        });
    }
  )};
//action:'Weather'
if(action==="Weather"){
    let addressToCheck = req.body.result && req.body.result.parameters && req.body.result.parameters.geoCity

    geocode.geocodeAddress(addressToCheck, (ErrorMessage, results)=>{
    	if(ErrorMessage) {
    		return console.log(ErrorMessage);
    	} else {
    		var lng= results.Longitud;
    		var lat= results.Latitud;
let reqUrl = encodeURI('https://api.darksky.net/forecast/952e6c17d2e95573c9d7506e00a1fef7/' + lat +',' + lng );
weather.getWeather(lat,lng, (ErrorMessage,weatherResults)=>{
  if(ErrorMessage){
    console.log(ErrorMessage);
  } else {
    console.log(weatherResults.temperature);
    var answer = 'The weather in '+addressToCheck +' is: '+weatherResults.temperature;
    return res.json({
      speech: answer,
      displayText: answer,
      source: 'first-webhook'
    })
  }
});
      }
    });//geocodeAddress

};

}); //post

server.listen((process.env.PORT || 8000), function () {
    console.log("Server is up and running...");
});
