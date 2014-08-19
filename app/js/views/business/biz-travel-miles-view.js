'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app')
, jquiSlider = require('jquery-ui/slider');

var milesTemplate = require('../../templates/business/biz-travel-miles-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: milesTemplate,
  ui: {
    mileage: 'input[name="mileage"]',
    percentShort: 'input#percent-short',
    percentMed: 'input#percent-med',
    percentLong: 'input#percent-long'
  },
  onShow: function() {
    var self = this;

    this.vehicle.validate = function(attrs, options) {
      if(!attrs.mileage || attrs.mileage == '' || attrs.mileage.match(/^(0|[1-9][0-9]*)$/) == null) {       
        self.displayError(self.ui.numVehiclesInput);
        return false;
      } else {
        self.displaySuccess(self.ui.numVehiclesInput);
      }
      return true;
    }

    this.modelBinder = new Databinding.ModelBinder(this, this.vehicle);

    var mileage = this.vehicle.get('mileage') || undefined
    , percentShort = this.vehicle.get('percentShort') || undefined
    , percentMed = this.vehicle.get('percentMed') || undefined
    , percentLong = this.vehicle.get('percentLong') || undefined;
    
    if(mileage) this.modelBinder.watch('value: mileage', {selector: '[name="num_vehicles"]'});
    if(percentShort) this.modelBinder.watch('value: percentShort', {selector: 'input#percent-short'});
    if(percentMed) this.modelBinder.watch('value: percentMed', {selector: 'input#percent-med'});
    if(percentLong) this.modelBinder.watch('value: percentLong', {selector: 'input#percent-long'});

    var sliderMin = 0
    , sliderMax = 100
    , sliderPos1 = 33
    , sliderPos2 = 75;

    $( "#range-slider" ).slider({
      range: true,
      min: sliderMin,
      max: sliderMax,
      values: [ sliderPos1, sliderPos2 ],
      slide: function( event, ui ) {
        var percentShort = ui.values[0]
        , percentMed = ui.values[1] - ui.values[0]
        , percentLong = 100 - ui.values[1];

        self.ui.percentShort.val( percentShort + '%');
        self.ui.percentMed.val( percentMed + '%');
        self.ui.percentLong.val( percentLong + '%');
      }
    });

    var percentShort = sliderPos1
    , percentMed = sliderPos2 - sliderPos1
    , percentLong = 100 - sliderPos2;

    this.ui.percentShort.val( percentShort + '%');
    this.ui.percentMed.val( percentMed + '%');
    this.ui.percentLong.val( percentLong + '%');

  },
  getNextInputView: function() {
    var travel = require('../../utils/biz-travel-emissions');
    travel.annMiles = this.ui.mileage.val();
    travel.flight.shortHaul.percent = parseInt(this.ui.percentShort.val());
    travel.flight.medHaul.percent = parseInt(this.ui.percentMed.val());
    travel.flight.longHaul.percent = parseInt(this.ui.percentLong.val());
    travel.setCalculateBy('flightPercent');
    this.category.set({totalEmissions: travel.totalEmissions().shortHaul + travel.totalEmissions().medHaul + travel.totalEmissions().longHaul})
    console.log('this.category',this.category);
    App.vent.trigger('goToNextCategory');
  }
});