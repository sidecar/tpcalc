var express = require('express')
, app = express()
, Client = require('node-rest-client').Client
, opn = require('opn')
, xml2json = require("node-xml2json")
, request = require("request")
, client = new Client()
, http = require('http');
http.post = require('http-post');

var server_port = parseInt(process.env.OPENSHIFT_INTERNAL_PORT) || parseInt(process.env.OPENSHIFT_NODEJS_PORT)|| process.env.PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var getData = function(url, res) {
	client.get(url, function(parsedResponseData, rawResponseData){
		res.send(parsedResponseData);
		//console.log('response', parsedResponseData)
	});
}

var root = (process.env.CONTEXT === 'local'? '/dev' : '/dist');
app.use(express.static(__dirname + root));

app.get('/gate/business/:name/:title/:company/:email/:employees', function(req, res) {
	getData('http://www.terrapass.com/tpcalc.services/csv/form_bus_A.php?'
		+'name='+req.params.name
		+'&title='+req.params.title
		+'&company='+req.params.company
		+'&email='+req.params.email
		+'&num_emps='+req.params.employees
		+'&submit_form='+'Yes'
		, res);
});

app.get('/gate/events/:name/:event/:company/:email/:phone', function(req, res) {
	getData('http://www.terrapass.com/tpcalc.services/csv/form_event_A.php?'
		+'name='+req.params.name
		+'&event='+req.params.event
		+'&company='+req.params.company
		+'&email='+req.params.email
		+'&phone='+req.params.phone
		+'&submit_form='+'Yes'
		, res);
});

app.get('/vehicle/year', function(req, res) {
	getData('http://www.fueleconomy.gov/ws/rest/vehicle/menu/year', res);
});

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

// Generate CSV and Email upon completion

app.get('/result/individual', function(appRequest, appResponse) {
	client.get('http://www.terrapass.com/tpcalc.services/email/individual_email_send.php'
		+'?emailAddr='+appRequest.query.email
		+'&trees='+appRequest.query.trees
		+'&co2e_vehicle='+appRequest.query.vehicleTotalEmissions
		+'&co2e_transit='+appRequest.query.transitTotalEmissions
		+'&co2e_travel='+appRequest.query.travelTotalEmissions
		+'&co2e_home='+appRequest.query.homeTotalEmissions, 
		function(parsedResponseData, rawResponseData){
			appResponse.send(parsedResponseData);
			console.log(parsedResponseData);
		}
	);
	http.post('http://www.terrapass.com/tpcalc.services/csv/csv_output_ind.php', appRequest.query, function(res){
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			//console.log('res.on(\'data\')');
			//console.log('chunk', chunk);
		});
	});
});

app.get('/result/business', function(appRequest, appResponse) {
	client.get('http://www.terrapass.com/tpcalc.services/email/business_email_send.php'
		+'?emailAddr='+appRequest.query.email 
		+'&trees='+appRequest.query.trees
		+'&co2e_site='+appRequest.query.siteTotalEmissions
		+'&co2e_fleet='+appRequest.query.fleetTotalEmissions
		+'&co2e_travel='+appRequest.query.travelTotalEmissions
		+'&co2e_commute='+appRequest.query.commuteTotalEmissions
		+'&co2e_shipping='+appRequest.query.shippingTotalEmissions
		+'&co2e_server='+appRequest.query.serverTotalEmissions,
		function(parsedResponseData, rawResponseData){
			appResponse.send(parsedResponseData);
			console.log(parsedResponseData);
		}
	);
	http.post('http://www.terrapass.com/tpcalc.services/csv/csv_output_bus.php', appRequest.query, function(res){
		res.setEncoding('utf8');
		res.on('data', function(chunk) {});
	});
});

app.get('/result/events', function(appRequest, appResponse) {
	client.get('http://www.terrapass.com/tpcalc.services/email/events_email_send.php'
		+'?emailAddr='+appRequest.query.email 
		+'&trees='+appRequest.query.trees
		+'&co2e_travel='+appRequest.query.travelTotalEmissions
		+'&co2e_venue='+appRequest.query.venueTotalEmissions
		+'&co2e_water='+appRequest.query.waterTotalEmissions
		+'&co2e_meals='+appRequest.query.mealsTotalEmissions,
		function(parsedResponseData, rawResponseData){
			appResponse.send(parsedResponseData);
			console.log(parsedResponseData);
		}
	);
	http.post('http://www.terrapass.com/tpcalc.services/csv/csv_output_evt.php', appRequest.query, function(res){
		res.setEncoding('utf8');
		res.on('data', function(chunk) {});
	});
});

app.get('/*', function(req, res){
  res.redirect('/#/');
});

app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});


















