// var express = require('express');
// var app = express();
// var Client = require('node-rest-client').Client;
// var client = new Client();
// var opn = require('opn');
// var xml2json = require("node-xml2json");

// var getData = function(url, res) {
// 	client.get(url, function(parsedResponseData, rawResponseData){
// 		console.log('parsedResponseData');
// 		console.log(parsedResponseData);
// 		res.send(parsedResponseData);
// 	});
// }

// app.use(express.static(__dirname + '/dev'));

// // fueleconomy.gov proxy api
// // to understand the xml being returned go here: http://www.fueleconomy.gov/feg/ws/wsData.shtml
// app.get('/vehicle/year', function(req, res) {
// 	getData('http://www.fueleconomy.gov/ws/rest/vehicle/menu/year', res);
// });

// app.get('/vehicle/make/:year', function(req, res) {
// 	getData('http://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year='+req.params.year+'&make='+req.params.make, res);
// });

// app.get('/vehicle/model/:year/:make', function(req, res) {
// 	getData('http://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year='+req.params.year+'&make='+req.params.make, res);
// });

// app.get('/vehicle/options/:year/:make/:model', function(req, res) {
// 	getData('http://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year='+req.params.year+'&make='+req.params.make+'&model='+req.params.model, res);
// });

// app.get('/airport/:key', function(req, res) {
// 	var url = 'http://www.terrapass.com/wp-content/themes/terrapass/flight/airports/airport_names.php?key='+req.params.key;
// 	client.get(url, function(parsedResponseData, rawResponseData){
// 		console.log('parsedResponseData');
// 		console.log(parsedResponseData);
// 		var xml = parsedResponseData;
// 		var json = xml2json.parser( xml );
// 		console.log( 'json.xml' );
// 		console.log( json.xml );
// 		console.log( 'json' );
// 		console.log( json );
// 		res.send(json.xml);
// 	});	
// });

// app.listen(3000);
// console.log('Listening on port 3000...');

// app.get('/vehicle/options/:year/:make/:model', function(req, res) {
// 	getData('http://www.terrapass.com//wp-content/themes/terrapass/js/year_make.js', res);
// });

// app.get('/vehicle/options/:year/:make/:model', function(req, res) {
// 	getData('http://www.terrapass.com/wp-content/themes/terrapass/road/models/car-model.php?year=2013&make=toyota', res);
// });

// app.get('/hello', function(req, res) {
// 	var url = 'http://www.terrapass.com/wp-content/themes/terrapass/home/models/home-model.php?zip=94607';
// 	client.get(url, function(parsedResponseData, rawResponseData){
// 			// res.send(data.vehicle.city08[0]);
// 			console.log(parsedResponseData);
// 		});
//     res.send(200);
// });
