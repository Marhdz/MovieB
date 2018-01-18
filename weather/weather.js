const request =require('request');

var getWeather= (lat, lng, callback) => {
request({
	url: 'https://api.darksky.net/forecast/952e6c17d2e95573c9d7506e00a1fef7/' + lat +',' + lng,
	json: true
}, (error, response, body)=>{
	if (response.statusCode===200){
		callback(undefined,{
			temperature: body.currently.temperature,
			apparentTemperature: body.currently.apparentTemperature
		});
	} else{
		callback('Unable to connect to server');
	}
});
};

module.exports.getWeather= getWeather;
