'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app');

var defaultTemplate = require('../../templates/business/biz-shipping-default-template.hbs')

module.exports = Marionette.ItemView.extend({
	template: defaultTemplate,
  ui: {
    airShipmentsInput: 'input[name="air_shipments"]',
    airDistanceInput: 'input[name="air_distance"]',
    airWeightInput: 'input[name="air_weight"]', 
    truckShipmentsInput: 'input[name="truck_shipments"]',
    truckDistanceInput: 'input[name="truck_distance"]',
    truckWeightInput: 'input[name="truck_weight"]', 
    trainShipmentsInput: 'input[name="train_shipments"]',
    trainDistanceInput: 'input[name="train_distance"]',
    trainWeightInput: 'input[name="train_weight"]' 
  },
  events: {
    'blur input[name="air_shipments"]': 'validateField',
    'blur input[name="air_distance"]': 'validateField',
    'blur input[name="air_weight"]': 'validateField',
    'blur input[name="truck_shipments"]': 'validateField',
    'blur input[name="truck_distance"]': 'validateField',
    'blur input[name="truck_weight"]': 'validateField',
    'blur input[name="train_shipments"]': 'validateField',
    'blur input[name="train_distance"]': 'validateField',
    'blur input[name="train_weight"]': 'validateField'
  },
  onShow: function() {
    var airShipments = this.category.get('airShipments') || 0
    , airDistance = this.category.get('airDistance') || 0
    , airWeight = this.category.get('airWeight') || 0
    , truckShipments = this.category.get('truckShipments') || 0
    , truckDistance = this.category.get('truckDistance') || 0
    , truckWeight = this.category.get('truckWeight') || 0
    , trainShipments = this.category.get('trainShipments') || 0
    , trainDistance = this.category.get('trainDistance') || 0
    , trainWeight = this.category.get('trainWeight') || 0;

    if(airShipments) this.ui.airShipmentsInput.val(airShipments);
    if(airDistance) this.ui.airDistanceInput.val(airDistance);
    if(airWeight) this.ui.airWeightInput.val(airWeight);
    if(truckShipments) this.ui.truckShipmentsInput.val(truckShipments);
    if(truckDistance) this.ui.truckDistanceInput.val(truckDistance);
    if(truckWeight) this.ui.truckWeightInput.val(truckWeight);
    if(trainShipments) this.ui.trainShipmentsInput.val(trainShipments);
    if(trainDistance) this.ui.trainDistanceInput.val(trainDistance);
    if(trainWeight) this.ui.trainWeightInput.val(trainWeight);
    
  },
  validateField: function(event) {
    var $target = $(event.target);
    var val = $target.val();
    if(!val || val === '' || val.match(/^\d*$/) === null) {       
      this.displayError($target);
      return false;
    } else {
      this.displaySuccess($target);
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

    var totalEmissions = 0
    , airShipments = parseInt(this.ui.airShipmentsInput.val())
    , airDistance = parseInt(this.ui.airDistanceInput.val())
    , airWeight = parseInt(this.ui.airWeightInput.val())
    , truckShipments = parseInt(this.ui.truckShipmentsInput.val())
    , truckDistance = parseInt(this.ui.truckDistanceInput.val())
    , truckWeight = parseInt(this.ui.truckWeightInput.val())
    , trainShipments = parseInt(this.ui.trainShipmentsInput.val())
    , trainDistance = parseInt(this.ui.trainDistanceInput.val())
    , trainWeight = parseInt(this.ui.trainWeightInput.val());

    var shipping = require('../../utils/biz-shipping-emissions')

    shipping.air.shipments = airShipments;
    shipping.air.miles = airDistance;
    shipping.air.pounds = airWeight;

    shipping.truck.shipments = truckShipments;
    shipping.truck.miles = truckDistance;
    shipping.truck.pounds = truckWeight;

    shipping.train.shipments = trainShipments;
    shipping.train.miles = trainDistance;
    shipping.train.pounds = trainWeight;

    totalEmissions += shipping.totalEmissions().air;
    totalEmissions += shipping.totalEmissions().truck;
    totalEmissions += shipping.totalEmissions().train;

    this.category.set({
      airShipments: airShipments,
      airDistance: airDistance,
      airWeight: airWeight,
      truckShipments: truckShipments,
      truckDistance: truckDistance,
      truckWeight: truckWeight,
      trainShipments: trainShipments,
      trainDistance: trainDistance,
      trainWeight: trainWeight,
      totalEmissions: totalEmissions
    }); 

    console.log('this.category', this.category);

    App.vent.trigger('goToNextCategory');
  }
});



