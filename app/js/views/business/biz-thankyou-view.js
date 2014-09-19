'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app')
, numeral = require('numeral')
, isEmail = require('sane-email-validation');

var template = require('../../templates/business/biz-thankyou-template.hbs');

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
    var self = this;
    var email = this.ui.emailInput.val();
    if(isEmail(email)) {
      this.displaySuccess(this.ui.emailInput);
      var trees = numeral(this.model.get('totalEmissions')/0.039).format('0,0');
      var categories = this.model.get('categories')
      , site = categories.findWhere({slug: 'site'})
      , fleet = categories.findWhere({slug: 'fleet'})
      , travel = categories.findWhere({slug: 'travel'})
      , commute = categories.findWhere({slug: 'commute'})
      , shipping = categories.findWhere({slug: 'shipping'})
      , server = categories.findWhere({slug: 'server'})
      , fleetVehicles = fleet.get('fleetVehicles')
      , fleetVehicleDataString = '';

      fleetVehicles.each(function(vehicle) {
        fleetVehicleDataString += '|' + 
        vehicle.get('vehicleType') + ';' + 
        'zipcode = ' + vehicle.get('zip') + ';' +
        vehicle.get('fuelType') + ';' +
        vehicle.get('fuelQty') + 'gal;' +
        vehicle.get('mileage') + 'mi/vehicle;';
        fleetVehicleDataString += (vehicle.get('useRFI')) ? 'useRFI = true;' : 'useRFI = false;';
        fleetVehicleDataString += vehicle.get('mileage') + 'mi/vehicle;' +
        numeral(vehicle.get('totalEmissions')).format('0.00') + 'mT';
      });

      var url = '/result/business';
      var data = {
        siteZip: site.get('zip'),
        siteDieselAmount: site.get('dieselAmount'),
        siteDieselInterval: site.get('dieselInterval'),
        siteDieselUnit: site.get('dieselUnit'),
        siteDisplayName: site.get('displayName'),
        siteElectricityAmount: site.get('electricityAmount'),
        siteElectricityInterval: site.get('electricityInterval'),
        siteElectricityUnit: site.get('electricityUnit'),
        siteGasolineAmount: site.get('gasolineAmount'),
        siteGasolineInterval: site.get('gasolineInterval'),
        siteGasolineUnit: site.get('gasolineUnit'),
        siteHeatingOilAmount: site.get('heatingOilAmount'),
        siteHeatingOilInterval: site.get('heatingOilInterval'),
        siteHeatingOilUnit: site.get('heatingOilUnit'),
        siteNaturalGasAmount: site.get('naturalGasAmount'),
        siteNaturalGasInterval: site.get('naturalGasInterval'),
        siteNaturalGasUnit: site.get('naturalGasUnit'),
        sitePropaneAmount: site.get('propaneAmount'),
        sitePropaneInterval: site.get('propaneInterval'),
        sitePropaneUnit: site.get('propaneUnit'),
        siteTotalEmissions: numeral(site.get('totalEmissions')).format('0.00'),
        fleetVehicles: fleetVehicleDataString,
        fleetTotalEmissions: numeral(fleet.get('totalEmissions')).format('0.00'),
        travelLongHaulPerEmp: travel.get('longHaulPerEmp'),
        travelMedHaulPerEmp: travel.get('medHaulPerEmp'),
        travelMethod: travel.get('method'),
        travelNumEmployeesTraveling: travel.get('numEmployeesTraveling'),
        travelPercentLongHaulMiles: travel.get('percentLongHaulMiles'),
        travelPercentMedHaulMiles: travel.get('percentMedHaulMiles'),
        travelPercentShortHaulMiles: travel.get('percentShortHaulMiles'),
        travelShortHaulPerEmp: travel.get('shortHaulPerEmp'),
        travelTotalAnnMiles: travel.get('totalAnnMiles'),
        travelUseRFI: travel.get('useRFI'),
        travelTotalEmissions: numeral(travel.get('totalEmissions')).format('0.00'),
        commuteBusEmployees: commute.get('busEmployees'),
        commuteBusMileage: commute.get('busMileage'),
        commuteCarEmployees: commute.get('carEmployees'),
        commuteCarMileage: commute.get('carMileage'),
        commuteFerryEmployees: commute.get('ferryEmployees'),
        commuteFerryMileage: commute.get('ferryMileage'),
        commuteTaxiEmployees: commute.get('taxiEmployees'),
        commuteTaxiMileage: commute.get('taxiMileage'),
        commuteTrainEmployees: commute.get('trainEmployees'),
        commuteTrainMileage: commute.get('trainMileage'),
        commuteTotalEmissions: numeral(commute.get('totalEmissions')).format('0.00'),
        shippingTrainDistance: shipping.get('trainDistance'),
        shippingTrainShipments: shipping.get('trainShipments'),
        shippingTrainWeight: shipping.get('trainWeight'),
        shippingTruckDistance: shipping.get('truckDistance'),
        shippingTruckShipments: shipping.get('truckShipments'),
        shippingTruckWeight: shipping.get('truckWeight'),
        shippingTotalEmissions: numeral(shipping.get('totalEmissions')).format('0.00'),
        serverNumServers: server.get('numServers'),
        serverZip: server.get('zip'),
        serverTotalEmissions: numeral(server.get('totalEmissions')).format('0.00'),
        trees: trees,
        email: encodeURIComponent(email)
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

































