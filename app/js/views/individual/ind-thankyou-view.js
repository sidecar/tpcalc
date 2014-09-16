'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app')
, numeral = require('numeral')
, isEmail = require('sane-email-validation')
, numeral = require('numeral')
, http = require('http');
http.post = require('http-post');

var template = require('../../templates/individual/ind-thankyou-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
  events : {
    'blur input[name="email"]': 'validateEmail',
    'click #send-results-btn': 'submitData'
  },
  ui: {
    emailInput: 'input[name="email"]'
  },
  validateEmail: function(event) {
    var $target = $(event.target)
    , email = $target.val();
    if(isEmail(email)) {
      this.displaySuccess($target);
      return true;
    } else {
      this.displayError($target);
      return false;
    }
  },
  displaySuccess: function($elem) {
    $elem.parent()
      .prev('label')
      .html(function() {
          return $(this).data('default-label');
        })
      .parent('div')
      .addClass('has-success')
      .removeClass('has-error');
  },
  displayError: function($elem) {
    $elem.parent()
      .prev('label')
      .html(function() {
          return $(this).data('error-msg');
        })
      .parent('div')
      .addClass('has-error')
      .removeClass('has-success');
  },
  getNextInputView: function() {
    return;
  },
  submitData: function() {
    console.log('this.model', this.model);
    var self = this;
    var email = this.ui.emailInput.val();
    if(isEmail(email)) {
      this.displaySuccess(this.ui.emailInput);
      var categories = this.model.get('categories')
      , vehicle = categories.findWhere({slug: 'vehicle'})
      , transit = categories.findWhere({slug: 'transit'})
      , travel = categories.findWhere({slug: 'travel'})
      , home = categories.findWhere({slug: 'home'})
      , vehicles = vehicle.get('vehicles')
      , vehicleDataString = ''
      , flights = travel.get('flights')
      , flightDataString = '';

      vehicles.each(function(vehicle) {
        vehicleDataString += '|';
        switch (vehicle.get('vehicleType')) {
          case 'car':
            if(vehicle.get('makeModelIsUnknown')) {
              vehicleDataString +=  vehicle.get('vehicleClass') + ';' + 
              vehicle.get('year') + ';' +
              'unknown make;' + 'unknown model;'
            } else {
              vehicleDataString += 'car;' + 
              vehicle.get('year') + ';' +
              vehicle.get('make') + ';' +
              vehicle.get('model') + ';' +
              vehicle.get('description').split(',').join(' ') + ';'
            }
            vehicleDataString += vehicle.get('mpg') + 'mpg;' +
            vehicle.get('mileage') + 'miles;' +
            numeral(vehicle.get('totalEmissions')).format('0.00') + 'mT'
          break;
          case 'ecar':
            vehicleDataString += 'ecar;'+ 
            vehicle.get('zip') + ';' +
            vehicle.get('year') + ';' +
            vehicle.get('mileage') + 'miles;'+
            numeral(vehicle.get('totalEmissions')).format('0.00') + 'mT'
          break;
          case 'boat':
            vehicleDataString += 'boat;' + 
            vehicle.get('fuelQty') + 'gal;' +
            vehicle.get('fuelType') + ';' +
            numeral(vehicle.get('totalEmissions')).format('0.00') + 'mT'
          break;
          case 'motorcycle':
            vehicleDataString += 'motorcycle;' + 
            vehicle.get('mileage') + 'miles;' +
            numeral(vehicle.get('totalEmissions')).format('0.00') + 'mT'
          break;
        }
      });

      flights.each(function(flight) {
        flightDataString += '|' + 
        'from ' + flight.get('from') + ';' +
        'to ' + flight.get('to') + ';' +
        'distance ' + flight.get('distance') + 'mi;' +
        numeral(flight.get('totalEmissions')).format('0.00') + 'mT'
      });
      
      var url = '/result/individual';

      var data = {
        vehicles: vehicleDataString,
        vehicleTotalEmissions: numeral(vehicle.get('totalEmissions')).format('0.00'),
        transitBusInterval: transit.get('busInterval'),
        transitBusMileage: transit.get('busMileage'),
        transitFerryInterval: transit.get('ferryInterval'),
        transitFerryMileage: transit.get('ferryMileage'),
        transitTaxiInterval: transit.get('taxiInterval'),
        transitTaxiMileage: transit.get('taxiMileage'),
        transitTrainInterval: transit.get('trainInterval'),
        transitTrainMileage: transit.get('trainMileage'),
        transitTotalEmissions: numeral(transit.get('totalEmissions')).format('0.00'),
        flights: flightDataString,
        travelEstimationMethod: travel.get('estimationMethod'),
        travelMilesLongBizClassFlights: travel.get('milesLongBizClassFlights'),
        travelMilesLongEconFlights: travel.get('milesLongEconFlights'),
        travelMilesLongEconPlusFlights: travel.get('milesLongEconPlusFlights'),
        travelMilesLongFirstClassFlights: travel.get('milesLongFirstClassFlights'),
        travelMilesMedEconFlights: travel.get('milesMedEconFlights'),
        travelMilesMedFirstClassFlights: travel.get('milesMedFirstClassFlights'),
        travelMilesShortFlights: travel.get('milesShortFlights'),
        travelNumLongBizClassFlights: travel.get('numLongBizClassFlights'),
        travelNumLongEconFlights: travel.get('numLongEconFlights'),
        travelNumLongEconPlusFlights: travel.get('numLongEconPlusFlights'),
        travelNumLongFirstClassFlights: travel.get('numLongFirstClassFlights'),
        travelNumMedEconFlights: travel.get('numMedEconFlights'),
        travelNumMedFirstClassFlights: travel.get('numMedFirstClassFlights'),
        travelNumShortFlights: travel.get('numShortFlights'),
        travelUseRFI: travel.get('useRFI'),
        travelTotalEmissions: numeral(travel.get('totalEmissions')).format('0.00'),
        homeDieselAmount: home.get('dieselAmount'),
        homeDieselInterval: home.get('dieselInterval'),
        homeDieselUnit: home.get('dieselUnit'),
        homeDisplayName: home.get('displayName'),
        homeElectricityAmount: home.get('electricityAmount'),
        homeElectricityInterval: home.get('electricityInterval'),
        homeElectricityUnit: home.get('electricityUnit'),
        homeGasolineAmount: home.get('gasolineAmount'),
        homeGasolineInterval: home.get('gasolineInterval'),
        homeGasolineUnit: home.get('gasolineUnit'),
        homeHeatingOilAmount: home.get('heatingOilAmount'),
        homeHeatingOilInterval: home.get('heatingOilInterval'),
        homeHeatingOilUnit: home.get('heatingOilUnit'),
        homeNaturalGasAmount: home.get('naturalGasAmount'),
        homeNaturalGasInterval: home.get('naturalGasInterval'),
        homeNaturalGasUnit: home.get('naturalGasUnit'),
        homePropaneAmount: home.get('propaneAmount'),
        homePropaneInterval: home.get('propaneInterval'),
        homePropaneUnit: home.get('propaneUnit'),
        homeTotalEmissions: numeral(home.get('totalEmissions')).format('0.00')
      };

      $.ajax({
        url: url,
        data: data,
        success: function() { 
          $('.send-results').hide(500, function() {$('#thankyou-message').show(300)});
        }
      });

    } else {
      this.displayError(this.ui.emailInput);
    }
  }
});

// var trees = numeral(this.model.get('totalEmissions')/0.039).format('0,0');
// var url = '/result/individual/'+encodeURIComponent(email)
//   +'/'
//   +trees
//   +'/'
//   +data['vehicle']
//   +'/'
//   +data['transit']
//   +'/'
//   +data['travel']
//   +'/'+
//   data['home'];

// categories.each(function(cat) {
//   calc[cat.get('slug')] = cat;
// var emissions = cat.get('totalEmissions') || 0;
// data[cat.get('slug')] = emissions;
// });



























