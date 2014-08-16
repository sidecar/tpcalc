'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app');

var defaultTemplate = require('../../templates/business/biz-travel-default-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: defaultTemplate,
  ui: {
    methodRadio: 'radio[name="method"]',
    useRfi: 'input[name="use_rfi"]'
  },
  onShow: function() {
    this.modelBinder = new Databinding.ModelBinder(this, this.category);
    this.modelBinder.watch('checked: method', {selector: '[name="method"]'});
    this.modelBinder.watch('checked: useRFI', {selector: '[name="use_rfi"]'});
  },
  getNextInputView: function() {
    var method = $('[name="method"]:checked').val();
    var useRFI = ($('[name="use_rfi"]:checked').val() == 'true') ? true : false ;
    this.category.set({
      method: method,
      useRFI: useRFI
    });
    App.vent.trigger('showInputView', method);
  }
});

	/* ------------------------------------------
	 * Business Travel - Miles - Slider
	 * ------------------------------------------ */
// 	if ( $('#ex').length > 0 ) {

// 		$("#ex").slider({
// 			'tooltip_split' : true
// 		});

// 	}

// 	if ( $('#biz_travel_miles_percent').length > 0 ) {

// 		$("#biz_travel_miles_percent").slider({});

// 		$('#biz_travel_miles .min-slider-handle').html('33');
// 		$('#biz_travel_miles .max-slider-handle').html('67');

// 		$("#biz_travel_miles_percent").on('slide', function(slideEvt) {
// 			$("#biz_travel_miles_percent_1").text(slideEvt.value);
// 			var arr = arrPercent(slideEvt.value);
// 			var val = slideEvt.value;
// 			$('.min-slider-handle').html(val[0]);
// 			$('.max-slider-handle').html(val[1]);
// 			// var percent1 = val[0];
// 			// var percent2 = val[1] - val[0];
// 			// var percent3 = 100 - val[1];

// 			$('#biz_travel_miles_percent_short').html(arr[0] + '% <span class="bold">short</span> haul flights');
// 			$('#biz_travel_miles_percent_medium').html(arr[1] + '% <span class="bold">medium</span> haul flights');
// 			$('#biz_travel_miles_percent_long').html(arr[2] + '% <span class="bold">long</span> haul flights');
// 		});
		
// 		function arrPercent(arr) {
// 			return [arr[0],arr[1]-arr[0],100-arr[1]];
// 		}
// 	}
// });

