'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app')
, validation = require('../../utils/validation');

var addTemplate = require('../../templates/individual/ind-home-add-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: addTemplate,
  ui: {
    electricityAmountInput: '[name="electricity_amount"]',
    electricityUnitSelect: '[name="electricity_unit"]',
    electricityIntervalSelect: '[name="electricity_interval"]',
    naturalGasAmountInput: '[name="natural_gas_amount"]',
    naturalGasUnitSelect: '[name="natural_gas_unit"]',
    naturalGasIntervalSelect: '[name="natural_gas_interval"]',
    heatingOilAmountInput: '[name="heating_oil_amount"]',
    heatingOilUnitSelect: '[name="heating_oil_unit"]',
    heatingOilIntervalSelect: '[name="heating_oil_interval"]',
    propaneAmountInput: '[name="propane_amount"]',
    propaneUnitSelect: '[name="propane_unit"]',
    propaneIntervalSelect: '[name="propane_interval"]',
    gasolineAmountInput: '[name="gasoline_amount"]',
    gasolineUnitSelect: '[name="gasoline_unit"]',
    gasolineIntervalSelect: '[name="gasoline_interval"]',
    dieselAmountInput: '[name="diesel_amount"]',
    dieselUnitSelect: '[name="diesel_unit"]',
    dieselIntervalSelect: '[name="diesel_interval"]'
  },
  events: {
    'blur [name="electricity_amount"]': 'validateField',
    'blur [name="natural_gas_amount"]': 'validateField',
    'blur [name="heating_oil_amount"]': 'validateField',
    'blur [name="propane_amount"]': 'validateField',
    'blur [name="gasoline_amount"]': 'validateField',
    'blur [name="diesel_amount"]': 'validateField'
  },
  onShow: function() {
    this.ui.electricityAmountInput.val(this.category.get('electricityAmount') || 0);
    this.ui.electricityUnitSelect.val(this.category.get('electricityUnit') || 0);
    this.ui.electricityIntervalSelect.val(this.category.get('electricityInterval') || 0);
    this.ui.naturalGasAmountInput.val(this.category.get('naturalGasAmount') || 0);
    this.ui.naturalGasUnitSelect.val(this.category.get('naturalGasUnit') || 0);
    this.ui.naturalGasIntervalSelect.val(this.category.get('naturalGasInterval') || 0);
    this.ui.heatingOilAmountInput.val(this.category.get('heatingOilAmount') || 0);
    this.ui.heatingOilUnitSelect.val(this.category.get('heatingOilUnit') || 0);
    this.ui.heatingOilIntervalSelect.val(this.category.get('heatingOilInterval') || 0);
    this.ui.propaneAmountInput.val(this.category.get('propaneAmount') || 0);
    this.ui.propaneUnitSelect.val(this.category.get('propaneUnit') || 0);
    this.ui.propaneIntervalSelect.val(this.category.get('propaneInterval') || 0);
    this.ui.gasolineAmountInput.val(this.category.get('gasolineAmount') || 0);
    this.ui.gasolineUnitSelect.val(this.category.get('gasolineUnit') || 0);
    this.ui.gasolineIntervalSelect.val(this.category.get('gasolineInterval') || 0);
    this.ui.dieselAmountInput.val(this.category.get('dieselAmount') || 0);
    this.ui.dieselUnitSelect.val(this.category.get('dieselUnit') || 0);
    this.ui.dieselIntervalSelect.val(this.category.get('dieselInterval') || 0);
  },
  validateForm: function(){
    var validation = require('../../utils/validation');
    var view = this;

    function isDigit($input) {
      var val = $input.val();
      if(validation.isDigit(val)) {
        view.displaySuccess($input);
        return true;
      } else {
        view.displayError($input);
        return false;
      }
    }

    if(!isDigit(view.ui.electricityAmountInput)) return false;
    if(!isDigit(view.ui.naturalGasAmountInput)) return false;
    if(!isDigit(view.ui.heatingOilAmountInput)) return false;
    if(!isDigit(view.ui.propaneAmountInput)) return false;
    if(!isDigit(view.ui.gasolineAmountInput)) return false;
    if(!isDigit(view.ui.dieselAmountInput)) return false;
    return true;
  },
  validateField: function(event) {
    var $target = $(event.target);
    var val = $target.val();
    if(validation.isDigit(val)) {       
      this.displaySuccess($target);
    } else {
      this.displayError($target);
    }
  },
  displaySuccess: function($elem) {
    $elem.parent()
      .parent('div')
      .removeClass('has-error')
      .addClass('has-success')
      .prev('.big-label')
      .removeClass('has-error')
      .addClass('has-success')
      .find('.display-error')
      .html(':');
  },
  displayError: function($elem) {
    $elem.parent()
      .parent('div')
      .removeClass('has-success')
      .addClass('has-error')
      .prev('.big-label')
      .removeClass('has-success')
      .addClass('has-error')
      .find('.display-error')
      .html(' must contain a number');
  },
  getNextInputView: function() {
    var view = this;  
    if(!view.validateForm()) return; 

    var electricityAmount = view.ui.electricityAmountInput.val()
    , electricityUnit = view.ui.electricityUnitSelect.val()
    , electricityInterval = view.ui.electricityIntervalSelect.val()
    , naturalGasAmount = view.ui.naturalGasAmountInput.val()
    , naturalGasUnit = view.ui.naturalGasUnitSelect.val()
    , naturalGasInterval = view.ui.naturalGasIntervalSelect.val()
    , heatingOilAmount = view.ui.heatingOilAmountInput.val()
    , heatingOilUnit = view.ui.heatingOilUnitSelect.val()
    , heatingOilInterval = view.ui.heatingOilIntervalSelect.val()
    , propaneAmount = view.ui.propaneAmountInput.val()
    , propaneUnit = view.ui.propaneUnitSelect.val()
    , propaneInterval = view.ui.propaneIntervalSelect.val()
    , gasolineAmount = view.ui.gasolineAmountInput.val()
    , gasolineUnit = view.ui.gasolineUnitSelect.val()
    , gasolineInterval = view.ui.gasolineIntervalSelect.val()
    , dieselAmount = view.ui.dieselAmountInput.val()
    , dieselUnit = view.ui.dieselUnitSelect.val()
    , dieselInterval = view.ui.dieselIntervalSelect.val();

    var home = require('../../utils/ind-home-emissions')
    home.zipCode = this.category.get('zip');
    home.fuel.electricity.amount = electricityAmount;
    home.fuel.electricity.method = (electricityUnit === 'dollars') ? 'dollars' : 'energy' ;
    home.fuel.electricity.interval = electricityInterval;
    home.fuel.naturalGas.amount = naturalGasAmount;
    home.fuel.naturalGas.method = (naturalGasUnit === 'dollars') ? 'dollars' : 'energy' ;
    home.fuel.naturalGas.interval = naturalGasInterval;
    home.fuel.heatingOil.amount = heatingOilAmount;
    home.fuel.heatingOil.method = (heatingOilUnit === 'dollars') ? 'dollars' : 'energy' ;
    home.fuel.heatingOil.interval = heatingOilInterval;
    home.fuel.propane.amount = propaneAmount;
    home.fuel.propane.method = (propaneUnit === 'dollars') ? 'dollars' : 'energy' ;
    home.fuel.propane.interval = propaneInterval;
    home.fuel.gasoline.amount = gasolineAmount;
    home.fuel.gasoline.method = (gasolineUnit === 'dollars') ? 'dollars' : 'energy' ;
    home.fuel.gasoline.interval = gasolineInterval;
    home.fuel.diesel.amount = dieselAmount;
    home.fuel.diesel.method = (dieselUnit === 'dollars') ? 'dollars' : 'energy' ;
    home.fuel.diesel.interval = dieselInterval;

    var totalEmissions = 0;
    totalEmissions += home.totalEmissions('electricity');
    totalEmissions += home.totalEmissions('naturalGas');
    totalEmissions += home.totalEmissions('heatingOil');
    totalEmissions += home.totalEmissions('propane');
    totalEmissions += home.totalEmissions('gasoline');

    this.category.set({
      electricityAmount: electricityAmount,
      electricityUnit: electricityUnit,
      electricityInterval: electricityInterval,
      naturalGasAmount: naturalGasAmount,
      naturalGasUnit: naturalGasUnit,
      naturalGasInterval: naturalGasInterval,
      heatingOilAmount: heatingOilAmount,
      heatingOilUnit: heatingOilUnit,
      heatingOilInterval: heatingOilInterval,
      propaneAmount: propaneAmount,
      propaneUnit: propaneUnit,
      propaneInterval: propaneInterval,
      gasolineAmount: gasolineAmount,
      gasolineUnit: gasolineUnit,
      gasolineInterval: gasolineInterval,
      dieselAmount: dieselAmount,
      dieselUnit: dieselUnit,
      dieselInterval: dieselInterval,
      totalEmissions: totalEmissions
    });
    App.vent.trigger('goToNextCategory');
  }
});
