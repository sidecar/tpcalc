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
    this.category.set({totalEmissions: travel.totalEmissions()})
    console.log('this.category',this.category);
    App.vent.trigger('goToNextCategory');
  }
});


    // // the code belows assume the colors array is exactly one element bigger than the handlers array.
    // var handlers = [33, 75];
    // var colors = ["#ff0000", "#00ff00", "#0000ff"];
    // //updateColors(handlers);
    
    // $('#perecent-short').val('test');
    // $('#perecent-med').val('test');
    // $('#perecent-long').val('test');
    
    // $("#slider").slider({
    //   range: true,
    //   min: 0,
    //   max: 100,
    //   values: handlers,
    //   slide: function (evt, ui) {
    //     var percentShort = ui.values[0]
    //     , percentMed = ui.values[1]
    //     , percentLong = 100 - (percentShort + percentMed);


    //     $('#perecent-short').val(percentShort + "%");
    //     $('#perecent-med').val(percentMed + "%");
    //     $('#perecent-long').val(percentLong + "%");
    //   }
    // });

    // function updateColors(values) {
    //   var colorstops = colors[0] + ", "; // start left with the first color
    //     for (var i=0; i< values.length; i++) {
    //       colorstops += colors[i] + " " + values[i] + "%,";
    //       colorstops += colors[i+1] + " " + values[i] + "%,";
    //     }
    //     // end with the last color to the right
    //     colorstops += colors[colors.length-1];
        
    //     /* Safari 5.1, Chrome 10+ */
    //     var css = '-webkit-linear-gradient(left,' + colorstops + ')';
    //     $('#slider').css('background-image', css);
    // }
