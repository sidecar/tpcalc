$(document).ready(function(){

	/* ------------------------------------------
	 * Navigation toggle "on hover"
	 * ------------------------------------------ */

	$(function(){
		var fast = 200;
		var faster = 50;
		$("#col-nav li").hover(function(){
			$(this).stop().animate({width:'240px'},fast,function(){});
			$(this).find('a').stop().animate({width:'240px'},fast);
			$(this).find('.checkmark').stop()
				.animate({top:'6px'},faster)
				.animate({right:'6px'},faster);
		}, function() {
			$(this).stop().animate({width:'36px'},fast);
			$(this).find('a').stop().animate({width:'36px'},fast);
			$(this).find('.checkmark').stop()
				.animate({top:'-8px'},faster)
				.animate({right:'-8px'},faster);
		});
	});



	/* ------------------------------------------
	 * "Help/Info" popup
	 * ------------------------------------------ */
	if ( $('.help .btn, .help-info').length > 0 ) {

		$('.help .btn, .help-info').magnificPopup({
			type:'inline',
			midClick: true
		});

	}



	/* ------------------------------------------
	 * Business Travel - Miles - Slider
	 * ------------------------------------------ */
	if ( $('#ex').length > 0 ) {

		$("#ex").slider({
			'tooltip_split' : true
		});

	}

	if ( $('#biz_travel_miles_percent').length > 0 ) {

		$("#biz_travel_miles_percent").slider({});

		$('#biz_travel_miles .min-slider-handle').html('33');
		$('#biz_travel_miles .max-slider-handle').html('67');

		$("#biz_travel_miles_percent").on('slide', function(slideEvt) {
			$("#biz_travel_miles_percent_1").text(slideEvt.value);
			var arr = arrPercent(slideEvt.value);
			var val = slideEvt.value;
			$('.min-slider-handle').html(val[0]);
			$('.max-slider-handle').html(val[1]);
			// var percent1 = val[0];
			// var percent2 = val[1] - val[0];
			// var percent3 = 100 - val[1];

			$('#biz_travel_miles_percent_short').html(arr[0] + '% <span class="bold">short</span> haul flights');
			$('#biz_travel_miles_percent_medium').html(arr[1] + '% <span class="bold">medium</span> haul flights');
			$('#biz_travel_miles_percent_long').html(arr[2] + '% <span class="bold">long</span> haul flights');
		});
		
		function arrPercent(arr) {
			return [arr[0],arr[1]-arr[0],100-arr[1]];
		}
	}
});