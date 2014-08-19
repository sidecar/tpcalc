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
    mileageInput: 'input[name="mileage"]',
    percentShortInput: 'input#percent-short',
    percentMedInput: 'input#percent-med',
    percentLongInput: 'input#percent-long'
  },
  onShow: function() {
    var self = this;
    this.category.validate = function(attrs, options) {
      if(!attrs.mileage || attrs.mileage == '' || attrs.mileage.match(/^\d*$/) == null) {       
        self.displayError(self.ui.mileageInput);
        return false;
      } else {
        self.displaySuccess(self.ui.mileageInput);
      }
      return true;
    }

    var mileage = this.category.get('mileage') || 0
    , percentShort = this.category.get('percentShort') || 33
    , percentMed = this.category.get('percentMed') || 33
    , percentLong = this.category.get('percentLong') || 33;

    this.ui.mileageInput.val(mileage);
    this.ui.percentShortInput.val( percentShort + '%');
    this.ui.percentMedInput.val( percentMed + '%');
    this.ui.percentLongInput.val( percentLong + '%');

    var sliderPos1 = percentShort
    , sliderPos2 = percentShort + percentMed;

    $( "#range-slider" ).slider({
      range: true,
      min: 0,
      max: 100,
      values: [ sliderPos1, sliderPos2 ],
      slide: function( event, ui ) {
        var percentShort = ui.values[0]
        , percentMed = ui.values[1] - ui.values[0]
        , percentLong = 100 - ui.values[1];
        
        self.category.set({
          percentShort: percentShort,
          percentMed: percentMed,
          percentLong: percentLong
        });

        self.ui.percentShortInput.val( percentShort + '%');
        self.ui.percentMedInput.val( percentMed + '%');
        self.ui.percentLongInput.val( percentLong + '%');
      }
    });

  },
  validate: function() {
    var attrs = {
      mileage: this.ui.mileageInput.val(),
    }
    this.category.validate(attrs);
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
    var attrs = {
      mileage: this.ui.mileageInput.val()
    }
    if(this.category.validate(attrs)) {
      var travel = require('../../utils/biz-travel-emissions');
      var totalEmissions = 0;
      travel.annMiles = this.ui.mileageInput.val();
      travel.flight.shortHaul.percent = parseInt(this.ui.percentShortInput.val());
      travel.flight.medHaul.percent = parseInt(this.ui.percentMedInput.val());
      travel.flight.longHaul.percent = parseInt(this.ui.percentLongInput.val());
      travel.setCalculateBy('flightPercent');
      totalEmissions += travel.totalEmissions().shortHaul; 
      totalEmissions += travel.totalEmissions().medHaul;
      totalEmissions += travel.totalEmissions().longHaul;
      this.category.set({
        mileage: this.ui.mileageInput.val(),
        totalEmissions: totalEmissions
      });
      App.vent.trigger('goToNextCategory');
    }
  }
});