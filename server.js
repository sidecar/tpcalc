var express = require('express');
var app = express();
var Client = require('node-rest-client').Client;
var client = new Client();
var opn = require('opn');
var xml2json = require("node-xml2json");

var server_port = parseInt(process.env.OPENSHIFT_INTERNAL_PORT) || parseInt(process.env.OPENSHIFT_NODEJS_PORT)|| process.env.PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var getData = function(url, res) {
	client.get(url, function(parsedResponseData, rawResponseData){
		res.send(parsedResponseData);
		console.log('response', parsedResponseData)
	});
}

var root = (process.env.CONTEXT === 'local'? '/dev' : '/dist');
app.use(express.static(__dirname + root));

// fueleconomy.gov proxy api
// to understand the xml being returned go here: http://www.fueleconomy.gov/feg/ws/wsData.shtml
app.get('/vehicle/year', function(req, res) {
	getData('http://www.fueleconomy.gov/ws/rest/vehicle/menu/year', res);
});

app.get('/vehicle/make/:year', function(req, res) {
	getData('http://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year='+req.params.year+'&make='+req.params.make, res);
});

app.get('/vehicle/model/:year/:make', function(req, res) {
	getData('http://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year='+req.params.year+'&make='+req.params.make, res);
});

app.get('/vehicle/options/:year/:make/:model', function(req, res) {
	getData('http://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year='+req.params.year+'&make='+req.params.make+'&model='+req.params.model, res);
});

app.get('/vehicle/mpg/:id', function(req, res) {
	getData('http://www.fueleconomy.gov/ws/rest/vehicle/'+req.params.id, res);
});

app.get('/airport/:key', function(req, res) {
	getData('http://airportcode.riobard.com/search?q='+req.params.key+'&fmt=JSON', res);
});

app.get('/airport/icao/:iataCode', function(req, res) {
	getData('http://services.faa.gov/airport/status/'+req.params.iataCode+'?format=application/json', res);
});

app.get('/result/individual/:email/:trees/:vehicle/:transit/:travel/:home', function(req, res) {
	getData('http://www.terrapass.com/email/individual_email_send.php?emailAddr='+req.params.email
		+'&trees='+req.params.trees
		+'&co2e_vehicle='+req.params.vehicle
		+'&co2e_transit='+req.params.transit
		+'&co2e_travel='+req.params.travel
		+'&co2e_home='+req.params.home
		, res);
});

app.get('/result/business/:email/:trees/:site/:fleet/:travel/:commute/:shipping/:server', function(req, res) {
	getData('http://www.terrapass.com/email/business_email_send.php?emailAddr='+req.params.email
		+'&trees='+req.params.trees
		+'&co2e_site='+req.params.site
		+'&co2e_fleet='+req.params.fleet
		+'&co2e_travel='+req.params.travel
		+'&co2e_commute='+req.params.commute
		+'&co2e_shipping='+req.params.shipping
		+'&co2e_server='+req.params.server
		, res);
});

app.get('/result/events/:email/:trees/:travel/:venue/:water/:meals', function(req, res) {
	getData('http://www.terrapass.com/email/events_email_send.php?emailAddr='+req.params.email
		+'&trees='+req.params.trees
		+'&co2e_travel='+req.params.travel
		+'&co2e_venue='+req.params.venue
		+'&co2e_water='+req.params.water
		+'&co2e_meals='+req.params.meals
		, res);
});

app.get('/*', function(req, res){
  // res.status(404).send('Not found');
  res.redirect('/#/');
});

app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});



























