var request = require('request');

var geocodeAddress = (address,callback) =>
{
	request({
		url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+encodeURIComponent(address),
		json: true
	},(error,response,body)=> {
		if(error){
			callback('Sorry, we are unable to connect to the server');
		} else if(body.status==='ZERO_RESULTS'){
			callback('Invalid address');
		} else if(body.status=='OK'){
			callback(undefined,{
				address: body.results[0].formatted_address,
				Longitud: body.results[0].geometry.location.lng,
				Latitud: body.results[0].geometry.location.lat
			});
		}
	});
}

module.exports.geocodeAddress=geocodeAddress;