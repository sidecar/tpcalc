/**
 * This file defines the TPCalc application object as well
 * as the AutoComplete utility class.
 *
 * The TPCalc object includes specialized sub-objects: the
 * TPCalc.User data object and the TPCalc.Road, TPCalc.Air,
 * and TPCalc.Residential application objects.
 */

/**
 * TPCalc core application object
 *
 * This singleton defines the application-wide settings and utilities
 * for the unified carbon calculator.
 *
 * Depends on jQuery (external) and JSON (external).
 */

var TPCalc = {

///////////////
// Constants //
///////////////

// Debug levels:
//
//  0 : off
//  1 : exceptions and notices
//  2 : init/update of user data
//  3 : curious yet unproblematic warnings
//  4 : init/update of application state
//  5 : verbose

DEBUG:              0,				// Debug off (0) or level (1-5)
VERSION:            '1.1',
COOKIE_DOMAIN:      '.terrapass.com',
COOKIE_TIMEOUT:     1209600E3,			// one week (ms)
COOKIE_PATH:        '/carbon-footprint-calculator/',
COOKIE_SECURE:      0,

TYPE_ROAD:          'road',
TYPE_AIR:           'air',
TYPE_RESIDENTIAL:   'residential',
TYPE_ACTION:        'action',

SCROLL_THRESHOLD:   2,

/////////////
// Members //
/////////////

totalFootprint: -1,
overlayQueue: [],

/////////////
// Methods //
/////////////

init: function() {

	// Set page error handler

	if(TPCalc.DEBUG > 0) {
		$(window).error(function(e, msg, url, line){
			if(msg || url || line) {
				TPCalc.printDebug("Line " + line + ": " + msg + "(" + url + ")");
			}
			return false;
		});
	} else {
		$(window).error(function(){
					TPCalc.showError("Sorry, there was an error in loading the calculator. Please contact us if you continue to have problems.");
			return true;
		});
	}

	// Add toFormattedString() to the Number prototype

	Number.prototype.toFormattedString = TPCalc.formatNumber;

	// Set global settings for jQuery's Ajax utilities

	$.ajaxSetup({
		async: false,
		ifModified: true,
		cache: true,
		error: TPCalc.handleAjaxError
	});

	// Import scripts into HEAD
	// This should be done immediately rather than when the
	// document is ready or when the window is loaded.

	//TPCalc.Road.importScripts();

	// Init page

	$(document).ready(function(){

		// Determine selected calculator

		var selCalcType = (location.hash.substr(1) || TPCalc.TYPE_ROAD).toLowerCase();
		var params = TPCalc.parseQueryString();

		// Attach expansion hanlder to expansion links in calculator navigation,
		// site left navigation, and in the summary "next" visual contexts

		$('#calculator_navigation a.expand, '+
		  '#calculator_cluster a.expand, '+
		  '#calculatemenu a.expand ').click(function() {
			var hash, calcType;
			if(this.hash) {
				hash = this.hash;
				calcType = this.hash.substr(1);
			} else {
				hash = '#road';
				calcType = 'road';
			}

			var hashId = calcType.split(/\;/,2);
			//try{console.log(hashId)}catch(e){}
			calcType = hashId[0];

			TPCalc.expandCalculator(calcType);
			location.replace(hash);		// Do not add history entries for toggling between calculators
			return false;

		});

		// Turn off autocomplete browser feature on all calculator forms
		// and turn off submissions

		$('#calculator_cluster form')
			.not('#signup_form')
			.not('#PRODProducts')
			.attr('autocomplete', 'off').submit(function(){return false;});

		// Workaround for scrolling: the height value used to set the overflow
		// scrolling needs to be determined with a rendered UL.data-summary
		// element, so the collapsed calculators need to be uncollapsed
		// momentarily

		$('#calculator_cluster .calculator-tab').css({
			display: 'block',
			visibility: 'hidden',
			overflow: 'hidden',
			height: '10px'
		});

		// Initialize each calculator

		switch(selCalcType) {
			case TPCalc.TYPE_AIR:
				TPCalc.Air.init();
				TPCalc.Road.init();
				TPCalc.Residential.init();
				break;
			case TPCalc.TYPE_RESIDENTIAL:
				TPCalc.Residential.init();
				TPCalc.Road.init();
				TPCalc.Air.init();
				if(params.hid !== undefined) {
					TPCalc.Residential.focusHomeSummary( TPCalc.Residential.getHomeIdxById(params.hid) );
				}
				break;
			case TPCalc.TYPE_ROAD:
			default:
				TPCalc.Road.init();
				TPCalc.Air.init();
				TPCalc.Residential.init();
				if(params.vid !== undefined) {
					TPCalc.Road.focusVehicleSummary( TPCalc.Road.getVehicleIdxById(params.vid) );
				}
		}

		// Clean up the workaround from above

		$('#calculator_cluster .calculator-tab').css({
			display: '',
			visibility: '',
			overflow: '',
			height: ''
		});

		// Expand selected calculator

		// IE6: Need to delay the code that follows the call to TPCalc.Road.removeVehicleSummary(),
		// because that code modifies objects that get used by  TPCalc.Road._loadVehicleControlsIE6(),
		// which is called within removeVehicleSummary() and uses setTimeout() to work around an
		// IE6 DOM access bug (see comments for _loadVehicleControlsIE6()).

		if( $.browser.msie && parseInt($.browser.version) == 6 ) {
			setTimeout(function(){
				TPCalc.expandCalculator(selCalcType);
			}, 475);
		} else {
			TPCalc.expandCalculator(selCalcType);
		}

		// Remove 'loading' class

		$('#calculator_cluster').removeClass('loading');
	});
},

formatNumber: function(num) {
	num = this || num;
	if(num === undefined) {
		return '';
	}

	var numStr = String(Math.floor(num));
	var displayStr = '';

	for(var pos=0; numStr.length > pos; pos++){

		if( pos != 0 && (numStr.length - pos) % 3 == 0){
			displayStr += ',';
		}
		displayStr += numStr.charAt(pos);
	}

	return displayStr;
},

formatCurrency: function(num) {
	num = this || num;
	if(num === undefined) {
		return '';
	}
	num = Number(num);
	var decimals = num.toFixed(2).replace(/\d+\.(\d{2})/, '$1');

	return num.toFormattedString() + '.' + decimals;
},

timestamp: function() {
	var date = new Date();
	return parseInt(date.getTime() / 1E3);	// Return Unix timestamp
},

syncActionTabWithCalcTabs: function() { // bind me lately
},

expandCalculator: function(calcType) {
	var calcId, navId, leftNavId;

	if(!calcType) {
		calcType = (location.hash.substr(1) || TPCalc.TYPE_ROAD).toLowerCase();
	}
	//{var e;try{console.log("expCalc<t ",calcType)}catch(e){}}
	switch(calcType) {
		case TPCalc.TYPE_ROAD:
			calcId = 'road_calculator';
			navId = 'road_tab';
			leftNavId = 'calculatedriving';
			break;
		case TPCalc.TYPE_AIR:
			calcId = 'air_calculator';
			navId = 'air_tab';
			leftNavId = 'calculateair';
			break;
		case TPCalc.TYPE_RESIDENTIAL:
			calcId = 'residential_calculator';
			navId = 'residential_tab';
			leftNavId = 'calculatehome';
			break;
		case TPCalc.TYPE_ACTION:
			syncActionTabWithCalcTabs();
			calcId = 'take_action';
			navId = '-take_action_tab-';
			leftNavId = '-calculateaction-';
			break;
		default:
			return;
	}
	//{var e;try{console.log("expCalc>t ",calcId,navId,leftNavId)}catch(e){}}

	// Announce tab
	$('#calcform').removeClass('tab-road tab-air tab-residential tab-action');
	$('#calcform').addClass('tab-'+calcType);

	// Uncollapse category calculator

	$('#'+calcId).removeClass('collapsed');
	//$('.calculator-tab').filter(':not(#'+calcId+')')
	$('.calculator-tab').not('#'+calcId)
		.addClass('collapsed');

	// Mark current navigation element

	$('#calculator_navigation ul li.current').removeClass('current');
	$('#calculator_navigation ul li#' + navId).addClass('current');

	// Mark current left navigation element

	$('#calculatemenu .subtab:not(#' + leftNavId + ')').removeClass('current');
	$('#'+leftNavId).addClass('current');
},

setCalculatorProgress: function(calcType, flag) {

	// Check that the given calc type is a valid one

	switch(calcType) {
		case TPCalc.TYPE_ROAD:
			navId = 'road_tab';
			break;
		case TPCalc.TYPE_AIR:
			navId = 'air_tab';
			break;
		case TPCalc.TYPE_RESIDENTIAL:
			navId = 'residential_tab';
			break;
		default:
			return;
	}

	if(flag) {
		$('#calculator_navigation ul li#' + navId).addClass('done');
	} else {
		$('#calculator_navigation ul li#' + navId).removeClass('done');
	}
},

calcFootprint: function() {
	return TPCalc.Road.calcFootprint()
	  + TPCalc.Air.State.calcFootprint()
	  + TPCalc.Residential.calcFootprint();
},

updateFootprintTotal: function() {
	var total = Math.round(TPCalc.calcFootprint());
	var rounded = Math.ceil(total / 1000) * 1000;

	$('#total_carbon_footprint').html(total.toFormattedString());
	$('#rounded_carbon_footprint').html(rounded.toFormattedString());

	TPCalc.toggleSkipToResults(total > 0);
},

toggleSkipToResults: function(flag) {
	if(flag) {
		$('.data-summary .skip-to-results').removeClass('hidden');
	} else {
		$('.data-summary .skip-to-results').addClass('hidden');
	}
},

cmpVersion: function(vStr1, vStr2) {

	// For now assume version strings of the form 'x.yz'
	// where x, y, z are digits and z is optional. Thus,
	// we can just use parseFloat() to compare.

	var v1 = parseFloat(vStr1);
	var v2 = parseFloat(vStr2);

	if(isNaN(v1) && isNaN(v2)) {
		return 0;
	} else if(isNaN(v2)) {
		return 1;
	} else if(isNaN(v1)) {
		return -1;
	}

	return v1 - v2;
},

objLength: function(obj) {
	var num = 0;
	for(var p in obj) {
		num++;
	}
	return num;
},

sortObject: function(obj, cmpFunc) {
	var keyArr = [];
	var valArr = [];
	var newObj = {};

	if(!obj || obj === {}) {
		return false;
	}

	if(!cmpFunc || typeof cmpFunc != 'function') {
		cmpFunc = function(key1, val1, key2, val2) {
			if(val1 < val2) {
				return -1;
			} else if(val1 > val2) {
				return 1;
			} else {
				return 0;
			}
		};
	}

	for(var key in obj) {
		keyArr.push(key);
		valArr.push(obj[key]);
	}

	var numPairs = keyArr.length;
	var tmpKey, tmpVal;

	for(var lpos=0; lpos < numPairs-1; lpos++) {
		for(var rpos=lpos+1; rpos < numPairs; rpos++) {

			if(cmpFunc(keyArr[lpos], valArr[lpos], keyArr[rpos], valArr[rpos]) > 0) {
				tmpKey = keyArr[lpos];
				keyArr[lpos] = keyArr[rpos];
				keyArr[rpos] = tmpKey;

				tmpVal = valArr[lpos];
				valArr[lpos] = valArr[rpos];
				valArr[rpos] = tmpVal;
			}
		}
	}

	for(var i=0; i < numPairs; i++) {
		newObj[keyArr[i]] = valArr[i];
	}

	return newObj;
},

importScript: function(url) {
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', url);
	document.getElementsByTagName('head').item(0).appendChild(script);
},

getJSON: function(reqUrl, callback) {
	var reqObj = $.ajax({url: reqUrl, dataType: "json", async: false, failure: function(){
	//try{console.log("ajax.failure")}catch(e){}
	}});
	//try{console.log(reqObj, reqObj.status)}catch(e){}
	if(reqObj.status != 200 && reqObj.status != 304){
		if(TPCalc.DEBUG > 0) {
			TPCalc.printDebug('The server did not give a successful response to the Ajax request.');
		}
		return false;
	}

	if(reqObj.responseText) {
		//try{console.log(reqObj.responseText)}catch(e){}
		var jsonObj = JSON.parse(reqObj.responseText);
		if(jsonObj) {
			callback(jsonObj);
		} else {
			if(TPCalc.DEBUG > 0) {
				TPCalc.printDebug('The JSON response could not be parsed.');
			}
		}
	} else {
		if(TPCalc.DEBUG > 4) {
			TPCalc.printDebug('The JSON response was empty.');
		}
	}

	return reqObj;
},

parseQueryString: function() {
	if(!location.search || location.search.length <= 1) {
		return false;
	}
	var qs = location.search.slice(1);
	var pairs = qs.split(/&/);
	var parsed, params = {};
	for(var i=0, numPairs=pairs.length; i < numPairs; i++) {
		parsed = pairs[i].split(/\=/);
		if(parsed && parsed.length == 2) {
			params[parsed[0]] = unescape(parsed[1]);
		}
	}

	return params.toString() != '' ? params : false;
},

submitEmailSignup: function(emailAddr, trackSrc) {
	if(!emailAddr || Cookie.get('nwsltr_signup') > 0) {
		return false;
	}
	var exc;
	var pageTrackId = '/newslettersignup?from=' + encodeURIComponent(trackSrc);
	var submitUrl = 'http://app.bronto.com/public/?q=landingpage&id=1fl8vkzw748g4wdx3yqsbrboycoje&a=DirectAdd&fn=Mail_LandingPage_Subadd&type=p&page=subadd&ssid=6429&email=' + encodeURIComponent(emailAddr);

	// Make GET request to Bronto submitting email address

	var img = new Image();
	img.src = submitUrl;

	// Explicitly notify Google Analytics tracking

	try {
		pageTracker._trackPageview(pageTrackId);
	} catch (exc) {
		// ignore //
	}

	// Remember that the user has submitted an email for signup

	Cookie.set('nwsltr_signup', '1', TPCalc.COOKIE_TIMEOUT, TPCalc.COOKIE_PATH, TPCalc.COOKIE_DOMAIN, TPCalc.COOKIE_SECURE);

	return true;
},

showDialog: function(msg, callback) {

	var html =
	    '<div class="dialog">'
	  + '<p>' + msg + '</p>'
	  + '<p>'
	  + '<input type="button" id="dialog_ok" value="OK" class="ok">'
	  + '<input type="button" id="dialog_cancel" value="Cancel" class="cancel">'
	  + '</p>'
	  + '</div>';

	var clickHdlr = function(event) {
		var exc;
		try {
			if(event.target.id == 'dialog_ok') {
				callback();
				TPCalc.closeOverlay();
			} else  if(event.target.id == 'dialog_cancel') {
				TPCalc.closeOverlay();
			}
		} catch(exc) {
			TPCalc.closeOverlay();
		}
	};

	TPCalc.openOverlay(html, clickHdlr);
},

showError: function(msg, onCloseCallback) {
	var html = '<p>' + (msg || 'Unknown error!') + '</p>';

	html += '<p><input type="button" id="close_overlay_alternate" value="Close" class="close button"></p>';

	TPCalc.openOverlay(html, function(event) {
		if(event.type == 'click' && event.target.id == 'close_overlay_alternate') {
			TPCalc.closeOverlay();
			if(onCloseCallback) {
				onCloseCallback();
			}
		}
	});
},

openDetailsWindow: function(detailUrl) {
	return;
	$.ajax({
		url: detailUrl,
		dataType: 'html',
		complete: function(reqObj, textStatus) {
			if(!reqObj || (reqObj.status != 200 && reqObj.status != 304)) {
				return;
			}
			var html;
			if(reqObj.responseText) {
				html = reqObj.responseText;
			} else {
				html = '<p>There is no details page available.</p>';
			}
			TPCalc.openOverlay(html, function(event) {
				if(event.type == 'click' && event.target.id == 'close_overlay') {
					$('html').removeClass('details-window');
				}
			});
			$('html').addClass('details-window');
		}
	});
},

openOverlay: function(html, evtHandler) {

	var $overlay = $('#overlay');

	// If the overlay is currently open, then put this overlay message in
	// a queue and wait for this message to be closed before showing the
	// next overlay message.

	if($overlay.length > 0) {
		TPCalc.overlayQueue.push( {content: html, handler: evtHandler} );
		return;
	} else {
		$overlay = $(document.createElement('div')).attr('id', 'overlay').prependTo('body');
	}

	$overlay
	  .html(
	      '<div class="mask"></div>'
	    + '<div class="content">'
	    +   '<div class="header">'
	    +     '<div class="rounded-left">'
	    +     '<div class="rounded-right">'
	    +     '<div class="rounded-edge">'
	    +       '<input type="button" id="close_overlay" value="Close" class="delete button">'
	    +     '</div></div></div>'
	    +   '</div>'
	    +   '<div class="body">'
	    +     '<div class="rounded-left">'
	    +     '<div class="rounded-right">'
	    +     '<div class="rounded-edge">'
	    +       html
	    +     '</div></div></div>'
	    +   '</div>'
	    +   '<div class="footer">'
	    +     '<div class="rounded-left">'
	    +     '<div class="rounded-right">'
	    +     '<div class="rounded-edge">'
	    +     '</div></div></div>'
	    +   '</div>'
	    + '</div>'
	  )
	  .click(function(event){
		if(evtHandler){
			evtHandler(event);
		}
		if(event.target.id == 'close_overlay') {
			TPCalc.closeOverlay();
		}
	  });

	// IE6

	if( $.browser.msie && parseInt($.browser.version) == 6 ) {
		var scrollYOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		$('.content', $overlay).css('top', scrollYOffset + 175);

		$('html').css('overflow', 'hidden');
		$('select').css('visibility', 'hidden');
		$('#overlay select').css('visibility', '');
	}
},

closeOverlay: function() {
	if( $.browser.msie && parseInt($.browser.version) == 6 ) {
		$('html').css('overflow', '');
		$('select').css('visibility', '');
	}
	$('#overlay').remove();

	// If overlay messages have queued up, then display the next one now

	if(TPCalc.overlayQueue.length > 0) {
		var olay = TPCalc.overlayQueue.shift();
		TPCalc.openOverlay(olay.content, olay.handler);
	}
},

handleAjaxError: function(reqObj, textStatus, exc) {
	if(reqObj.status != 200 && reqObj.status != 304) {
		if(exc) {
			TPCalc.handleException(exc);
		} else if(TPCalc.DEBUG > 0) {
			TPCalc.printDebug(textStatus + "\nResponse: " + reqObj.status + " " + reqObj.statusText);
		}
		TPCalc.showError("There was a problem communicating with the server.");
	}
},

handleException: function(exc) {
	if(TPCalc.DEBUG > 0) {
		var msg = '';
		var argType = typeof exc;

		if( argType == 'object' ) {
			if(exc.lineNumber) {
				msg += "Line number " + exc.lineNumber + "\n";
			}
			if( exc.name && exc.number && exc.message ) {
				msg += exc.name + ' ' + exc.number + ': ' + exc.message;
			} else {
				msg += exc.toString();
			}
		} else if( argType == 'string' ) {
			msg += exc;
		} else {
			msg += "Unknown exception";
		}
		TPCalc.printDebug(msg);
	} else {
		//TPCalc.showError("There was an error that occurred. Please try again.");
	}
},

printDebug: function(msg) {
	if(!TPCalc.DEBUG) {
		return;
	}
	var $div = $('#debug_output');
	if(!$div.length) {
		$('<div id="debug"><h1>DEBUG OUTPUT <input type="button" name="clear" value="Clear"></h1>'
		  + '<div id="debug_output"></div></div>').appendTo('body');
		$div = $('#debug_output');
		$('#debug input[name=clear]').click(function(){ $('#debug_output').empty(); });
	}

	var time = new Date(), timestamp = time.toLocaleTimeString();
	$div.prepend('<span class="timestamp">' + timestamp + '<br/></span><p>' + String(msg).replace(/\n/g, '<br>') + '</p>');
}

};  // End TPCalc //

/**
 * TPCalc.User data object
 *
 * This singleton encapsulates all the data access functionality
 * related to user profiles.
 *
 * Depends on jQuery (external), JSON (external), and Cookie (external).
 */

TPCalc.User = {

///////////////
// Constants //
///////////////

ROAD_COOKIE_NAME:          'unicalc_road',
AIR_COOKIE_NAME:           'unicalc_air',
RESIDENTIAL_COOKIE_NAME:   'unicalc_residential',

/////////////
// Members //
/////////////

vehicleSeq: -1,
flightSeq: -1,
homeSeq: -1,

// Hashes below serve as a local cache of saved user data //

roadCache: null,
airCache: null,
residentialCache: null,

/////////////
// Methods //
/////////////

retrieveRoadData: function(forceLookup) {
	if(forceLookup || !TPCalc.User.roadCache) {
		var value = Cookie.get(TPCalc.User.ROAD_COOKIE_NAME);
		if(value) {
			TPCalc.User.roadCache = JSON.parse(value);
		} else {
			TPCalc.User.roadCache = {
				version: TPCalc.VERSION,
				vehicles: []
			};
		}
	}
	return TPCalc.User.roadCache;
},

retrieveAirData: function(forceLookup) {
	if(forceLookup || !TPCalc.User.airCache) {
		var value = Cookie.get(TPCalc.User.AIR_COOKIE_NAME);
		if(value) {
			TPCalc.User.airCache = JSON.parse(value);
		} else {
			TPCalc.User.airCache = {
				version: TPCalc.VERSION,
				simple: false,
				simpleFlightCount: {
					numShort:  0,
					numMedium: 0,
					numLong:   0
				},
				flights: []
			};
		}
	}
	return TPCalc.User.airCache;
},

retrieveResidentialData: function(forceLookup) {
	if(forceLookup || !TPCalc.User.residentialCache) {
		var value = Cookie.get(TPCalc.User.RESIDENTIAL_COOKIE_NAME);
		if(value) {
			TPCalc.User.residentialCache = JSON.parse(value);
		} else {
			TPCalc.User.residentialCache = {
				version: TPCalc.VERSION,
				homes: []
			};
		}
	}
	return TPCalc.User.residentialCache;
},

initVehicleSeq: function() {
	var maxId = TPCalc.User.findMaxId(TPCalc.User.roadCache.vehicles);
	if(maxId > 0) {
		TPCalc.User.vehicleSeq = maxId + 1;
	} else {
		TPCalc.User.vehicleSeq = 1;
	}
},

initFlightSeq: function() {
	var maxId = TPCalc.User.findMaxId(TPCalc.User.airCache.flights);
	if(maxId > 0) {
		TPCalc.User.flightSeq = maxId + 1;
	} else {
		TPCalc.User.flightSeq = 1;
	}
},

initHomeSeq: function() {
	var maxId = TPCalc.User.findMaxId(TPCalc.User.residentialCache.homes);
	if(maxId > 0) {
		TPCalc.User.homeSeq = maxId + 1;
	} else {
		TPCalc.User.homeSeq = 1;
	}
},

saveRoadData: function(value) {
	if(value !== undefined) {
		TPCalc.User.roadCache = value;
	}
	var size = Cookie.set(
	  TPCalc.User.ROAD_COOKIE_NAME,
	  JSON.stringify(TPCalc.User.roadCache),
	  TPCalc.COOKIE_TIMEOUT,
	  TPCalc.COOKIE_PATH,
	  TPCalc.COOKIE_DOMAIN,
	  TPCalc.COOKIE_SECURE
	);

	if(size > Cookie.MAX_SIZE) {
		TPCalc.showError("Sorry, your changes cannot be saved. You have exceeded the maximum allowable size for a browser cookie.");
		return false;
	}
	if(TPCalc.DEBUG >= 5) {
		TPCalc.printDebug("Current cookie length: " + size);
	}

	return true;
},

saveAirData: function(value) {
	if(value !== undefined) {
		TPCalc.User.airCache = value;
	}
	var size = Cookie.set(
	  TPCalc.User.AIR_COOKIE_NAME,
	  JSON.stringify(TPCalc.User.airCache),
	  TPCalc.COOKIE_TIMEOUT,
	  TPCalc.COOKIE_PATH,
	  TPCalc.COOKIE_DOMAIN,
	  TPCalc.COOKIE_SECURE
	);

	if(size > Cookie.MAX_SIZE) {
		TPCalc.showError("Sorry, your changes cannot be saved. You have exceeded the maximum allowable size for a browser cookie.");
		return false;
	}
	if(TPCalc.DEBUG >= 5) {
		TPCalc.printDebug("Current cookie length: " + size);
	}

	return true;
},

saveResidentialData: function(value) {
	if(value !== undefined) {
		TPCalc.User.residentialCache = value;
	}
	var size = Cookie.set(
	  TPCalc.User.RESIDENTIAL_COOKIE_NAME,
	  JSON.stringify(TPCalc.User.residentialCache),
	  TPCalc.COOKIE_TIMEOUT,
	  TPCalc.COOKIE_PATH,
	  TPCalc.COOKIE_DOMAIN,
	  TPCalc.COOKIE_SECURE
	);
	if(size > Cookie.MAX_SIZE) {
		TPCalc.showError("Sorry, your changes cannot be saved. You have exceeded the maximum allowable size for a browser cookie.");
		return false;
	}
	if(TPCalc.DEBUG >= 5) {
		TPCalc.printDebug("Current cookie length: " + size);
	}

	return true;
},

// Road data access methods

getVehicles: function() {
	TPCalc.User.retrieveRoadData();
	return TPCalc.User.roadCache.vehicles;
},
getVehicle: function(idx) {
	var data = TPCalc.User.retrieveRoadData();
	return TPCalc.User.roadCache.vehicles[idx];
},
getVehicleById: function(id) {
	var data = TPCalc.User.retrieveRoadData();
	return TPCalc.User.findObjectById(TPCalc.User.roadCache.vehicles, id);
},
addVehicle: function(obj) {
	if(TPCalc.User.vehicleSeq < 0) {
		TPCalc.User.initVehicleSeq();
	}
	obj.id = TPCalc.User.vehicleSeq++;
	TPCalc.User.retrieveRoadData();
	TPCalc.User.roadCache.vehicles.unshift(obj);
	if(TPCalc.User.saveRoadData()) {
		return obj.id;
	} else {
		return false;
	}
},
updateVehicle: function(obj, idx) {
	TPCalc.User.retrieveRoadData();
	TPCalc.User.roadCache.vehicles[idx] = obj;
	return TPCalc.User.saveRoadData();
},

updateVehicleById: function(obj, id) {
	TPCalc.User.retrieveRoadData();
	var idx = TPCalc.User.findIndexById(TPCalc.User.roadCache.vehicles, id);
	if(idx < 0) {
		return false;
	}
	return TPCalc.User.updateVehicle(obj, idx);
},
deleteVehicle: function(idx) {
	TPCalc.User.retrieveRoadData();
	TPCalc.User.roadCache.vehicles.splice(idx, 1);
	return TPCalc.User.saveRoadData();
},
deleteVehicleById: function(id) {
	var data = TPCalc.User.retrieveRoadData();
	var idx = TPCalc.User.findIndexById(TPCalc.User.roadCache.vehicles, id);
	if(idx < 0) {
		return false;
	}
	return TPCalc.User.deleteVehicle(idx);
},

// Flight data access methods

getFlights: function() {
	TPCalc.User.retrieveAirData();
	return TPCalc.User.airCache.flights;
},
getFlight: function(idx) {
	TPCalc.User.retrieveAirData();
	return TPCalc.User.airCache.flights[idx];
},
getFlightById: function(id) {
	var data = TPCalc.User.retrieveAirData();
	return TPCalc.findObjectById(TPCalc.User.airCache.flights, id);
},
addFlight: function(obj) {
	if(TPCalc.User.flightSeq < 0) {
		TPCalc.User.initFlightSeq();
	}
	obj.id = TPCalc.User.flightSeq++;
	TPCalc.User.retrieveAirData();
	TPCalc.User.airCache.flights.unshift(obj);
	if(TPCalc.User.saveAirData()) {
		return obj.id;
	} else {
		return false;
	}
},
updateFlight: function(obj, idx) {
	TPCalc.User.retrieveAirData();
	TPCalc.User.airCache.flights[idx] = obj;
	return TPCalc.User.saveAirData();
},
updateFlightById: function(obj, id) {
	TPCalc.User.retrieveAirData();
	var idx = TPCalc.User.findIndexById(TPCalc.User.airCache.flights, id);
	if(idx < 0) {
		return false;
	}
	return TPCalc.User.updateFlight(obj, idx);
},

deleteFlight: function(idx) {
	TPCalc.User.retrieveAirData();
	TPCalc.User.airCache.flights.splice(idx, 1);
	return TPCalc.User.saveAirData();
},

deleteFlightById: function(id) {
	var data = TPCalc.User.retrieveAirData();
	var idx = TPCalc.findIndexById(TPCalc.User.airCache.flights, id);
	if(idx < 0) {
		return false;
	}
	return TPCalc.User.deleteFlight(idx);
},

getSimpleFlightCounts: function() {
	TPCalc.User.retrieveAirData();
	return TPCalc.User.airCache.simpleFlightCount;
},

updateSimpleFlightCounts: function(numShort, numMedium, numLong) {
	numShort = parseInt(numShort);
	numMedium = parseInt(numMedium);
	numLong = parseInt(numLong);

	TPCalc.User.retrieveAirData();
	TPCalc.User.airCache.simpleFlightCount.numShort = isNaN(numShort) ? 0 : numShort;
	TPCalc.User.airCache.simpleFlightCount.numMedium = isNaN(numMedium) ? 0 : numMedium;
	TPCalc.User.airCache.simpleFlightCount.numLong = isNaN(numLong) ? 0 : numLong;
	return TPCalc.User.saveAirData();
},

setSimpleFlightMode: function(flag) {
	TPCalc.User.retrieveAirData();
	TPCalc.User.airCache.simple = Boolean(flag);
	return TPCalc.User.saveAirData();
},

getSimpleFlightMode: function(flag) {
	return TPCalc.User.airCache.simple;
},

// Residential data access methods

getHomes: function() {
	TPCalc.User.retrieveResidentialData();
	return TPCalc.User.residentialCache.homes;
},
getHome: function(idx) {
	TPCalc.User.retrieveResidentialData();
	return TPCalc.User.residentialCache.homes[idx];
},
getHomeById: function(id) {
	var data = TPCalc.User.retrieveResidentialData();
	return TPCalc.User.findObjectById(TPCalc.User.residentialCache.homes, id);
},
addHome: function(obj) {
	if(TPCalc.User.homeSeq < 0) {
		TPCalc.User.initHomeSeq();
	}
	obj.id = TPCalc.User.homeSeq++;
	TPCalc.User.retrieveResidentialData();
	TPCalc.User.residentialCache.homes.unshift(obj);

	if(TPCalc.User.saveResidentialData()) {
		return obj.id;
	} else {
		return false;
	}
},
updateHome: function(obj, idx) {
	TPCalc.User.retrieveResidentialData();
	TPCalc.User.residentialCache.homes[idx] = obj;
	return TPCalc.User.saveResidentialData();
},
updateHomeById: function(obj, id) {
	TPCalc.User.retrieveResidentialData();
	var idx = TPCalc.User.findIndexById(TPCalc.User.residentialCache.homes, id);
	if(idx < 0) {
		return false;
	}
	return TPCalc.User.updateHome(obj, idx);
},

deleteHome: function(idx) {
	TPCalc.User.retrieveResidentialData();
	TPCalc.User.residentialCache.homes.splice(idx, 1);
	return TPCalc.User.saveResidentialData();
},

deleteHomeById: function(id) {
	var data = TPCalc.User.retrieveResidentialData();
	var idx = TPCalc.User.findIndexById(TPCalc.User.residentialCache.homes, id);
	if(idx < 0) {
		return false;
	}
	return TPCalc.User.deleteHome(idx);
},

findIndexById: function(arr, id) {
	if(!arr) {
		return -1;
	}
	var num = arr.length;
	var idx = -1;
	for(var i=0; i < num; i++) {
		if(arr[i].id == id) {
			idx = i;
			break;
		}
	}
	return idx;
},

findObjectById: function(arr, id) {
	if(!arr) {
		return null;
	}
	var num = arr.length;
	var obj = null;
	for(var i=0; i < num; i++) {
		if(arr[i].id == id) {
			obj = arr[i];
			break;
		}
	}
	return obj;
},

findMaxId: function(arr) {
	var exc, max = -1;
	for(var i=0, num=arr.length; i < num; i++) {
		try{
			max = Math.max(arr[i].id, max);
		} catch(exc) {
			return -1;
		}
	}
	return max;
},

migrateRoadData: function() {
	var currData = TPCalc.User.retrieveRoadData();

	// If the user data version and application version are the same,
	// then there is no need to migrate

	if(TPCalc.cmpVersion(currData.version, TPCalc.VERSION) == 0) {
		return;
	}

	var newData = {
		version: TPCalc.VERSION,
		vehicles: []
	};

	var newVehicles = [];

	// Follow the cascade the migration steps, upgrading the
	// user cookie to each new version format. Note that if
	// the current user cookie version exceeds the application
	// version, then the user cookie data is dropped.

	if(TPCalc.cmpVersion(currData.version, '0.9') < 0) {

		// Upgrade a pre-0.9 JSON cookie object

		for(var i=0, max=currData.vehicles.length; i < max; i++) {
			newVehicles.push({
				id:         currData.vehicles[i].id,
				isSimple:   currData.vehicles[i].isSimple ? 1 : 0,
				year:       currData.vehicles[i].year,
				make:       currData.vehicles[i].make,
				model:      currData.vehicles[i].model,
				miles:      currData.vehicles[i].milesPerYear,
				trans:      currData.vehicles[i].transmissionType,
				fuel:       currData.vehicles[i].fuelType,
				pctBio:     currData.vehicles[i].percentBiodiesel,
				co2PerMile: currData.vehicles[i].lbsCo2PerMile
			});
		}

		// Changed the cookie path, so need to delete the old cookie

		Cookie.remove(TPCalc.User.ROAD_COOKIE_NAME, '/', TPCalc.COOKIE_DOMAIN, TPCalc.COOKIE_SECURE);

		currData.vehicles = newVehicles;
		newVehicles = [];
	}
	/*
	if(TPCalc.cmpVersion(currData.version, '1.11') < 0) {

		// Upgrade a pre-1.11 JSON cookie object:
		// Changed path cookie back to domain cookie so need to delete the old cookie

		Cookie.remove(TPCalc.User.ROAD_COOKIE_NAME, '/carbon-footprint-calculator/', TPCalc.COOKIE_DOMAIN, TPCalc.COOKIE_SECURE);
	}
	*/
	if(TPCalc.cmpVersion(currData.version, TPCalc.VERSION) < 0) {
		newData.vehicles = currData.vehicles;
	}

	TPCalc.User.saveRoadData(newData);
},

migrateAirData: function() {
	var currData = TPCalc.User.retrieveAirData();

	// If the application version are the same, then there
	// is no need to migrate

	if(TPCalc.cmpVersion(currData.version, TPCalc.VERSION) == 0) {
		return;
	}

	var newData = {
		version: TPCalc.VERSION,
		simple: false,
		simpleFlightCount: {
			numShort:  0,
			numMedium: 0,
			numLong:   0
		},
		flights: []
	};

	var newFlights = [];

	// Follow the cascade the migration steps, upgrading the
	// user cookie to each new version format. Note that if
	// the current user cookie version exceeds the application
	// version, then the user cookie data is dropped.

	if(TPCalc.cmpVersion(currData.version, '0.9') < 0) {

		// Upgrade a pre-0.9 JSON cookie object

		for(var i=0, max=currData.flights.length; i < max; i++) {
			newFlights.push({
				id:    currData.flights[i].id,
				from:  currData.flights[i].departure.code,
				to:    currData.flights[i].destination.code,
				ways:  currData.flights[i].numWays,
				times: currData.flights[i].numTimes,
				miles: Math.round(currData.flights[i].miles),	// Should re-calculate with intermediate rounding
				co2:   Math.round(currData.flights[i].co2Lbs)	// but just rounding for simplicity
			});
		}

		// Changed the cookie path, so need to delete the old cookie

		Cookie.remove(TPCalc.User.AIR_COOKIE_NAME, '/', TPCalc.COOKIE_DOMAIN, TPCalc.COOKIE_SECURE);

		currData.flights = newFlights;
		newFlights = [];
	}
	if(TPCalc.cmpVersion(currData.version, '1.0') < 0) {

		// Upgrade a pre-1.0 JSON cookie object

		var newFlight;

		for(var i=0, max=currData.flights.length; i < max; i++) {

			// Copy each existing flight

			newFlight = {};
			for(var p in currData.flights[i]) {
				newFlight[p] = currData.flights[i][p];
			}

			// Add new flight properties

			newFlight.stops = 0;
			newFlight.airCode = null;
			newFlight.airlName = null;
			newFlight.seat = null;

			newFlights.push(newFlight);
		}

		// Changed the cookie path, so need to delete the old cookie

		Cookie.remove(TPCalc.User.AIR_COOKIE_NAME, '/', TPCalc.COOKIE_DOMAIN, TPCalc.COOKIE_SECURE);

		currData.flights = newFlights;
		newFlights = [];
	}
	/*
	if(TPCalc.cmpVersion(currData.version, '1.11') < 0) {

		// Upgrade a pre-1.11 JSON cookie object:
		// Changed path cookie back to domain cookie so need to delete the old cookie

		Cookie.remove(TPCalc.User.AIR_COOKIE_NAME, '/carbon-footprint-calculator/', TPCalc.COOKIE_DOMAIN, TPCalc.COOKIE_SECURE);
	}
	*/
	if(TPCalc.cmpVersion(currData.version, TPCalc.VERSION) < 0) {
		newData.flights = currData.flights;
	}

	TPCalc.User.saveAirData(newData);
},

migrateResidentialData: function() {
	var currData = TPCalc.User.retrieveResidentialData();

	// If the user data version and application version are the same,
	// then there is no need to migrate

	if(TPCalc.cmpVersion(currData.version, TPCalc.VERSION) == 0) {
		return;
	}

	var newData = {
		version: TPCalc.VERSION,
		homes: []
	};

	var newHomes = [];

	// Follow the cascade the migration steps, upgrading the
	// user cookie to each new version format. Note that if
	// the current user cookie version exceeds the application
	// version, then the user cookie data is dropped.

	if(TPCalc.cmpVersion(currData.version, '0.9') < 0) {

		// Upgrade a pre-0.9 JSON cookie object

		var newBills, billAmt, billFreq;

		for(var i=0, max=currData.homes.length; i < max; i++) {
			newBills = [];
			for(var billType in currData.homes[i].energyBills) {
				if(currData.homes[i].energyBills[billType].yearlyBill) {
					billAmt = currData.homes[i].energyBills[billType].yearlyBill;
					billFreq = 1;
				} else {
					billAmt = currData.homes[i].energyBills[billType].monthlyBill;
					billFreq = 12;
				}
				newBills.push({
					type:     billType,
					amt:      billAmt,
					freq:     billFreq,
					usdToCo2: currData.homes[i].energyBills[billType].usdToCo2Lbs
				});
			}
			newHomes.push({
				id:    currData.homes[i].id,
				zip:   currData.homes[i].location.zip,
				city:  currData.homes[i].location.city,
				state: currData.homes[i].location.state,
				bills: newBills
			});
		}

		// Changed the cookie path, so need to delete the old cookie

		Cookie.remove(TPCalc.User.RESIDENTIAL_COOKIE_NAME, '/', TPCalc.COOKIE_DOMAIN, TPCalc.COOKIE_SECURE);

		currData.homes = newHomes;
		newHomes = [];
	}
	/*
	if(TPCalc.cmpVersion(currData.version, '1.11') < 0) {

		// Upgrade a pre-1.11 JSON cookie object:
		// Changed path cookie back to domain cookie so need to delete the old cookie

		Cookie.remove(TPCalc.User.RESIDENTIAL_COOKIE_NAME, '/carbon-footprint-calculator/', TPCalc.COOKIE_DOMAIN, TPCalc.COOKIE_SECURE);
	}
	*/
	if(TPCalc.cmpVersion(currData.version, TPCalc.VERSION) < 0) {
		newData.homes = currData.homes;
	}

	TPCalc.User.saveResidentialData(newData);
}

};  // End TPCalc.User //

/**
 * TPCalc.Sys data object
 *
 * This singleton encapsulates all the data access functionality
 * related to system data.
 *
 * Depends on jQuery (external).
 */

TPCalc.Sys = {

/////////////// 
// Constants //
///////////////

FLIGHT_CO2_DATA_URL:        '/wp-content/themes/terrapass'+'/flight/models/flight-model.php',
AIRPORT_DATA_URL:	    '/wp-content/themes/terrapass'+'/flight/airports/airport_names.php',

/////////////
// Members //
/////////////

// Hashes below serve as a local cache of saved system data //

vehicleCo2Data:        {},
flightCo2Data:         {},
homeCo2Data:           {},

airports:              {},
airportsByKey:         {},
airlines:              {},

/////////////
// Methods //
/////////////

getFlightAirlines: function(fromCode, toCode) {
	var co2Data = TPCalc.Sys.getFlightCo2Data(fromCode, toCode);
	if(!co2Data || co2Data.allAirlineAverages.length < 1) {
		return false;
	}

	// Build local hash of airlines as a return value
	// and also add to the stored data cache of airlines

	var airlines = {};
	for(var i=0, numAirlines=co2Data.allAirlineAverages.length; i < numAirlines; i++) {
		airlines[co2Data.allAirlineAverages[i].airlineCode] = co2Data.allAirlineAverages[i].airlineName;
		TPCalc.Sys.airlines[co2Data.allAirlineAverages[i].airlineCode] = co2Data.allAirlineAverages[i].airlineName;
	}
	return airlines;
},

getFlightClasses: function(fromCode, toCode, airlineCode) {
	var co2Data = TPCalc.Sys.getFlightCo2Data(fromCode, toCode);
	if(!co2Data || co2Data.allAirlineAverages.length < 1) {
		return false;
	}

	var classes = {};

	if(airlineCode != '') {
		for(var i=0, numAirlines=co2Data.allAirlineAverages.length; i < numAirlines; i++) {

			if(co2Data.allAirlineAverages[i].airlineCode == airlineCode) {

				// Only grab classes from outbound portion of flight

				for(var seatClass in co2Data.allAirlineAverages[i].departureCo2) {
					classes[seatClass] = seatClass;
				}

				break;
			}
		}
	} else {
		for(var seatClass in co2Data.combinedAverages.departureCo2) {
			classes[seatClass] = seatClass;
		}
	}

	return classes !== {} ? classes : false;
},

getAirlineName: function(airlineCode) {
	return TPCalc.Sys.airlines[airlineCode];
},

getFlightCo2Data: function(fromCode, toCode) {
	
	var key = fromCode + ',' + toCode;

	if(TPCalc.Sys.flightCo2Data[key] === undefined) {
		var url = TPCalc.Sys.FLIGHT_CO2_DATA_URL + '?from=' + fromCode + '&to=' + toCode;

		TPCalc.getJSON(url, function(json) {
			if(json
			&& json.allAirlineAverages != '' && json.allAirlineAverages.length > 0
			&& json.combinedAverages != null) {
				TPCalc.Sys.flightCo2Data[key] = json;
			} else {
				TPCalc.Sys.flightCo2Data[key] = null;
			}
		});
	}

	return TPCalc.Sys.flightCo2Data[key];
},

getAirportData: function(displayName) {

	if(!displayName) {
		return false;
	}

	if(TPCalc.Sys.airports[displayName] === undefined) {

		// If UNDEFINED then this means this is the first time fetching,
		// so try doing the Ajax call. (If NULL, then there was an error
		// during a prior attempt to fetch this data.

		TPCalc.Sys.queryAirportData(displayName, true);

	}
	return TPCalc.Sys.airports[displayName];
},

queryAirportData: function(key, matchCode) {

	var argsKey = key + ',' + Boolean(matchCode);

	if(TPCalc.Sys.airportsByKey[argsKey] !== undefined) {
		return TPCalc.Sys.airportsByKey[argsKey];
	}

	var dataUrl = TPCalc.Sys.AIRPORT_DATA_URL;
	var params = { 'key': key };
	if(matchCode) {
		params.strict = '1';
	}
	var reqObj = $.ajax({url: dataUrl, dataType: 'xml', data: params, async: false});
	if(reqObj.status != 200 && reqObj.status != 304) {
		return false;
	}
	if(!reqObj.responseXML) {
		if(TPCalc.DEBUG >= 3) {
			TPCalc.printDebug("Empty XML response to Ajax request for airport data.");
		}
		return false;
	}
	var airports = [];
	$("airport", reqObj.responseXML).each(function(){
		var obj = {};
		var attribs = ['display', 'code', 'canon', 'lat', 'long', 'hemi', 'lhemi', 'type'];
		var attribToPropMap = {'long': 'lng'};
		var prop;

		for(var i in attribs) {
			prop = attribToPropMap[attribs[i]] || attribs[i];
			obj[prop] = $(this).attr(attribs[i]);
		}

		// Save in local array & TPCalc.Air hash cache

		airports.push(obj);
		TPCalc.Sys.airports[obj.display] = obj;
	});

	TPCalc.Sys.airportsByKey[argsKey] = airports;

	return airports.length > 0 ? airports : false;
}

};  // End TPCalc.Sys

/**
 * TPCalc.Road application object
 *
 * This singleton defines the settings and functionality specific
 * to the road calculator portion of the unified calculator.
 *
 * Depends on jQuery (external) and AutoComplete.
 */

TPCalc.Road = {

///////////////
// Constants //
///////////////

VEHICLE_MODEL_DATA_URL:     '/wp-content/themes/terrapass'+'/js/year_make.js',
VEHICLE_CO2_DATA_URL:       '/wp-content/themes/terrapass'+'/road/models/car-model.php',
DETAILS_PAGE_URL:           './car-details',

DEFAULT_TRANSMISSION:       'Automatic',
DEFAULT_FUEL:               'Gas',
DEFAULT_MILES:              12000,
DEFAULT_BIODIESEL_PERCENT:  '0%',

FUEL_GAS:                   'Gas',
FUEL_DIESEL:                'Diesel',
FUEL_ETHANOL:               'Ethanol',
FUEL_CNG:                   'CNG',
FUEL_ELECTRIC:		    'Electric',
FUEL_BIODIESEL:		    'BioDiesel',
FUEL_C02_PER_GAL:           {		// For simple road calculation
	"Gas":      19.42,
	"Diesel":   22.38,
	"Biodiesel": 17.90,
	"Ethanol":  2.91, 
	"CNG":      14.46,
	"Electric": 46.1
	},

MPG_SCALE_MIN:               0,
MPG_SCALE_MAX:               65,
MPG_SCALE_PIXEL_WIDTH:       154,
MPG_SCALE_PIXEL_X_OFFSET:    41,

/////////////
// Members //
/////////////

isInitialized: false,
subtotalFootprint: -1,
activeVehicleIdx: 0,
useSimpleMode: false,
co2Data: {},
vehicles: [],

/////////////
// Classes //
/////////////

Vehicle: function(   ) {

	// Public Properties //

	this.isSaved = false;
	this.isDirty = true;
	this.isSimple = TPCalc.Road.useSimpleMode;
	this.id = null;
	this.year = null;
	this.make = null;
	this.model = null;
	this.milesPerYear = null;
	this.transmissionType = null;
	this.fuelType = null;
	this.percentBiodiesel = null;
	this.galsPerMile = null;
	this.cityMpg = null;
	this.hwyMpg = null;
	this.lbsCo2PerMile = null;
	this.usdCostPerMile = null;

	// Private Properties //

	var usrToVehicleMap = {
	  'id':                 'id',
	  'isSimple':           'isSimple',
	  'year':               'year',
	  'make':               'make',
	  'model':              'model',
	  'miles':              'milesPerYear',
	  'trans':              'transmissionType',
	  'fuel':               'fuelType',
	  'pctBio':             'percentBiodiesel',
	  'cityMpg':            'cityMpg',
	  'hwyMpg':             'hwyMpg',
	  'co2PerMile':         'lbsCo2PerMile',
	  'galsPerMile':        'galsPerMile',
	  'costPerMile':        'usdCostPerMile'
	};

	// Constructor Main //

	var _this = this;
	if(this.isSimple) {
		var mpg = arguments[0];
		var milesPerYear = arguments[1];
		var fuelType = arguments[2];
		_reviseSimple(mpg, milesPerYear, fuelType);
	} else {
		var year = arguments[0];
		var make = arguments[1];
		var model = arguments[2];
		var milesPerYear = arguments[3];
		var transmissionType = arguments[4];
		var fuelType = arguments[5];
		var percentBiodiesel = arguments[6];

		_reviseComplex(year, make, model, milesPerYear, transmissionType, fuelType, percentBiodiesel);
	}

	// Public methods //

	this.fromJSONObject = function(usrObj) {
		var vehProp;
		for(var usrProp in usrToVehicleMap) {
			vehProp = usrToVehicleMap[usrProp];
			if(vehProp == 'percentBiodiesel') {
				_this[vehProp] = usrObj[usrProp] ? usrObj[usrProp]+'%' : usrObj[usrProp];
			} else {
				_this[vehProp] = usrObj[usrProp];
			}
		}
		_this.isSaved = true;
		_this.isDirty = false;
		if(_this.isSimple) {
			_setSimpleDependentProperties();
		} else {
			_setComplexDependentProperties();
		}
	};

	this.castAsSimple = function() {
		_this.isSimple = true;
		_this.clearProperties();
	};

	this.castAsComplex = function() {
		_this.isSimple = false;
		_this.clearProperties();
	};

	this.clearProperties = function() {
		_this.year = null;
		_this.make = null;
		_this.model = null;
		_this.milesPerYear = null;
		_this.transmissionType = null;
		_this.fuelType = null;
		_this.percentBiodiesel = null;
		_this.galsPerMile = null;
		_this.cityMpg = null;
		_this.hwyMpg = null;
		_this.lbsCo2PerMile = null;
		_this.usdCostPerMile = null;
	};

	this.getYear = function() {
		return _this.year;
	};

	this.getMake = function() {
		return _this.make;
	};

	this.getModel = function() {
		return _this.model;
	};

	this.getMilesPerYear = function() {
		return _this.milesPerYear;
	};

	this.getTransmissionType = function() {
		return _this.transmissionType;
	};

	this.getTransmissionTypeCount = function() {
		var exc, count=0;
		if(!TPCalc.Road.co2Data[_this.year][_this.make]) {
			if(!TPCalc.Road.fetchVehicleCo2Data(_this.year, _this.make)) {
				TPCalc.showError('There was a problem loading car CO2 data.');
				return false;
			}
		}
		try{
			if(TPCalc.Road.co2Data[_this.year][_this.make][_this.model]) {
				count = TPCalc.objLength(TPCalc.Road.co2Data[_this.year][_this.make][_this.model]);
			}
		} catch(exc) {
			TPCalc.handleException(exc);
		}
		return count;
	};

	this.getFuelType = function() {
		return _this.fuelType;
	};

	this.getPercentBiodiesel = function() {
		return _this.transmissionType;
	};

	this.getGallonsPerMile = function() {
		return _this.galsPerMile;
	};

	this.getCityMilesPerGallon = function() {
		return _this.cityMpg;
	};

	this.getHighwayMilesPerGallon = function() {
		return _this.hwyMpg;
	};

	this.calcCo2LbsPerYear = function() {
		return _this.milesPerYear * _this.lbsCo2PerMile;
	};

	this.calcGallonsPerYear = function() {
		return _this.milesPerYear * _this.galsPerMile;
	};

	this.isComplete = function() {
		var isComplete;
		if(_this.isSimple) {
			isComplete = _this.milesPerYear && _this.fuelType
			  && _this.lbsCo2PerMile && _this.galsPerMile;
		} else {
			isComplete = _this.year && _this.make && _this.model
			  && _this.milesPerYear && _this.transmissionType
			  && _this.fuelType && _this.lbsCo2PerMile
			  && (_this.fuelType != TPCalc.Road.FUEL_DIESEL || _this.percentBiodiesel)
			  && _this.galsPerMile && _this.cityMpg && _this.hwyMpg;
		}
		return isComplete;
	};

	this.toJSONObject = function() {
		var vehProp, jsonObj = {};
		for(var usrProp in usrToVehicleMap) {
			vehProp = usrToVehicleMap[usrProp];
			if(vehProp == 'isSimple') {
				jsonObj[usrProp] = _this[vehProp] ? 1 : 0;
			} else if(vehProp == 'percentBiodiesel') {
				jsonObj[usrProp] = _this[vehProp] ? _this[vehProp].replace(/%/g,'') : _this[vehProp];
			} else {
				jsonObj[usrProp] = _this[vehProp];
			}
		}

		return jsonObj;
	};

	this.revise = function(   ) {
		var args = arguments;
		if(_this.isSimple) {
			_reviseSimple(args[0], args[1], args[2]);
		} else {
			_reviseComplex(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
		}
	};

	// Private methods //

	function _reviseSimple(mpg, milesPerYear, fuelType) {
		if(_this.cityMpg != mpg
		|| _this.milesPerYear != (milesPerYear >= 0 ? parseInt(milesPerYear) : null)
		|| _this.fuelType != fuelType) {
			_this.isDirty = true;
		}

		_this.cityMpg = parseInt(mpg);
		_this.hwyMpg = parseInt(mpg);
		_this.galsPerMile = 1/mpg;
		_this.milesPerYear = milesPerYear >= 0 ? parseInt(milesPerYear) : null;
		_this.fuelType = fuelType;
		_setSimpleDependentProperties();

	}
	function _setSimpleDependentProperties() {
		if(_this.fuelType != null && !TPCalc.Road.FUEL_C02_PER_GAL[_this.fuelType]) {
			TPCalc.showError("You have specified an unrecognized fuel type.");
			return;
		}

		_this.lbsCo2PerMile = TPCalc.Road.FUEL_C02_PER_GAL[_this.fuelType] * _this.galsPerMile;
	}

	function _reviseComplex(year, make, model, milesPerYear, transmissionType, fuelType, percentBiodiesel) {

		if(_this.year != year
		|| _this.make != make
		|| _this.model != model
		|| _this.milesPerYear != (milesPerYear > 0 ? parseInt(milesPerYear) : null)
		|| _this.transmissionType != transmissionType
		|| _this.fuelType != fuelType
		|| _this.percentBiodiesel != percentBiodiesel) {
			_this.isDirty = true;
		}

		_this.year = year;
		_this.make = make;
		_this.model = model;
		_this.milesPerYear = milesPerYear > 0 ? parseInt(milesPerYear) : null;
		_this.transmissionType = transmissionType;
		_this.fuelType = fuelType;
		_this.percentBiodiesel = percentBiodiesel;

		_setComplexDependentProperties();
	}

	function _setComplexDependentProperties() {
		var exc, carCo2Data;

		if(!_this.year || !_this.make || !_this.model || !_this.transmissionType || !_this.fuelType) {
			return;
		}

		if(!TPCalc.Road.co2Data[_this.year][_this.make]) {
			if(!TPCalc.Road.fetchVehicleCo2Data(_this.year, _this.make)) {
				TPCalc.showError('There was a problem loading car CO2 data.');
				return false;
			}
		}

		try {
			if(_this.fuelType == TPCalc.Road.FUEL_DIESEL) {
				_this.percentBiodiesel = _this.percentBiodiesel || TPCalc.Road.DEFAULT_BIODIESEL_PERCENT;
				carCo2Data = TPCalc.Road.co2Data[_this.year][_this.make][_this.model][_this.transmissionType][_this.fuelType][_this.percentBiodiesel];
			} else {
				_this.percentBiodiesel = null;
				carCo2Data = TPCalc.Road.co2Data[_this.year][_this.make][_this.model][_this.transmissionType][_this.fuelType];
			}
		} catch(exc) {
			TPCalc.handleException(exc);
		}

		if(carCo2Data) {
			_this.galsPerMile    = carCo2Data.galsPerMile;
			_this.cityMpg        = carCo2Data.cityMpg;
			_this.hwyMpg         = carCo2Data.hwyMpg;
			_this.lbsCo2PerMile  = carCo2Data.lbsCo2PerMile;
			_this.usdCostPerMile = carCo2Data.usdCostPerMile;
		}
	}
},

/////////////
// Methods //
/////////////

init: function() {
	var exc;

	if(TPCalc.Road.isInitialized) {
		return;
	}
	if(!window.vehicleData) {
		TPCalc.showError("There was an error with initializing the data for the road carbon calculator.");
		return;
	}

	// If IE6, overwrite the loadVehicleControls method
	// IE6-specific implementation

	if( $.browser.msie && parseInt($.browser.version) == 6 ) {
		TPCalc.Road._loadVehicleControls = TPCalc.Road._loadVehicleControlsIE6;
	}

	try {
		TPCalc.Road.co2Data = vehicleData;  // from year_make.js
		TPCalc.Road.initDOMNodes();
		TPCalc.Road.initDOMEvents();
		TPCalc.Road.initDOMClones();
		TPCalc.Road.loadUserData();
		TPCalc.Road.isInitialized = true;
	} catch(exc) {
		if(TPCalc.DEBUG > 0){
			TPCalc.handleException(exc);
		} else {
			TPCalc.showError("There was an error with loading the road carbon calculator.");
		}
	}
},

importScripts: function() {
	TPCalc.importScript(TPCalc.Road.VEHICLE_MODEL_DATA_URL);
},

initDOMNodes: function() {

	// Gen initial DOM
	// Populate year drop-down

	var $selectYear = $('#vehicle_year');

	for(var year in TPCalc.Road.co2Data) {
		$selectYear.append('<option value="' + year + '">' + year + '</option>');
	}

	// Suppress display of email newsletter signup if the user has already
	// signed up in the past

	if(Cookie.get('nwsltr_signup') > 0) {
		$('#vehicle_email').val('').parents('.data-pair').eq(0).css('display', 'none');
	}
},

initDOMEvents: function() {

	// Attach event-handlers

	// Vehicle year SELECT

	$('#vehicle_year').change(function() {
		TPCalc.Road.resetVehicleMake();
		TPCalc.Road.enableVehicleMake();
		TPCalc.Road.updateActiveVehicle();
		TPCalc.Road.updateVehicleSummary();
	});

	// Vehicle make SELECT

	$('#vehicle_make').change(function(){
		TPCalc.Road.resetVehicleModel();
		if($(this).val() != '') {
			TPCalc.Road.enableVehicleModel();
		}
		TPCalc.Road.updateActiveVehicle();
		TPCalc.Road.updateVehicleSummary();
	});

	// Vehicle model SELECT

	$('#vehicle_model').change(function(){
		TPCalc.Road.collapseVehicleModelProfile();
		if($(this).val() != '') {
			TPCalc.Road.expandVehicleModelProfile();
			TPCalc.Road.enableVehicleTransmission();
			TPCalc.Road.enableVehicleFuel();
			TPCalc.Road.enableVehiclePercentBiodiesel();
			TPCalc.Road.enableVehicleMiles();
		}
		TPCalc.Road.updateActiveVehicle();

		TPCalc.Road.enableVehicleAdd();
		TPCalc.Road.updateVehicleSummary();
	});

	// Vehicle model profile - transmission RADIOs

	$('#vehicle_model_profile input[type=radio][name=vehicle_transmission]').click(function(){
		TPCalc.Road.resetVehicleFuel();
		TPCalc.Road.enableVehicleFuel();
		TPCalc.Road.enableVehiclePercentBiodiesel();
		TPCalc.Road.updateActiveVehicle();
	});

	// Vehicle model profile - fuel RADIOs only

	$('#vehicle_model_profile input[type=radio][name=vehicle_fuel]').click(function(){
		TPCalc.Road.resetVehiclePercentBiodiesel();
		TPCalc.Road.enableVehiclePercentBiodiesel();
		TPCalc.Road.updateActiveVehicle();
	});

	// Vehicle model profile - biodiesel YES/NO radios

	$('#vehicle_use_biodiesel_no').click(function(){
		$('#vehicle_biodiesel_percent').addClass('hidden').val(TPCalc.Road.DEFAULT_BIODIESEL_PERCENT);
		TPCalc.Road.updateActiveVehicle();
	});
	$('#vehicle_use_biodiesel_yes').click(function(){
		$('#vehicle_biodiesel_percent').removeClass('hidden');
		TPCalc.Road.updateActiveVehicle();
	});

	// Vehicle model profile controls
	//
	// (These should be attached after the handlers for the fuel radio inputs that enable the biodiesel % options.)

	$('#vehicle_model_profile input[type=radio]:not([name=vehicle_use_biodiesel_yes])').click(function(){
		TPCalc.Road.updateActiveVehicle();
		TPCalc.Road.enableVehicleAdd();
		TPCalc.Road.updateVehicleSummary();
	});
	$('#vehicle_biodiesel_percent').change(function(){
		if(parseInt(this.value) < 1) {
			$('#vehicle_use_biodiesel_no').attr('checked', true);
			$(this).addClass('hidden');
		}
		TPCalc.Road.updateActiveVehicle();
		TPCalc.Road.enableVehicleAdd();
		TPCalc.Road.updateVehicleSummary();
	});

	// Vehicle miles SELECT

	$('#vehicle_miles').change(function(){
		TPCalc.Road.updateActiveVehicle();
		TPCalc.Road.resetVehicleAdd();
		TPCalc.Road.enableVehicleAdd();
		TPCalc.Road.updateVehicleSummary();
	});

	// Monitor changes in standard road controls

	$('#complex_road_controls select').change(function() {
		TPCalc.Road.autoEnableVehicleCalculate();
	});

	$('#complex_road_controls input[type=radio]').click(function() {
		TPCalc.Road.autoEnableVehicleCalculate();
	});

	// Calculate button

	$('#vehicle_calculate').click(function(){
		if(!TPCalc.Road.validateVehicleInputs(true)) {
			return false;
		}
		TPCalc.Road.updateActiveVehicle();
		TPCalc.Road.saveUserVehicle();
		TPCalc.Road.updateVehicleSummary();
		TPCalc.Road.updateFootprintSubtotal();
		TPCalc.Road.enableVehicleAdd();
		if(TPCalc.submitEmailSignup($('#vehicle_email').val(), 'roadcalc')) {
			$('#vehicle_email').parents('.data-pair').eq(0).slideUp('slow');
		}

		return false;
	});

	// "Add Vehicle" button

	$('#add_vehicle').click(function(){
		var exc;
		try {
			if($(this).attr('disabled') || $(this).hasClass('disabled')) {
				return false;
			}
			TPCalc.Road.activeVehicleIdx = 0;
			if(TPCalc.Road.simpleMode()) {
				TPCalc.Road.resetSimpVehControls();
			} else {
				TPCalc.Road.resetVehicleControls();
			}
			TPCalc.Road.addVehicle();
			TPCalc.Road.addVehicleSummary();
		} catch(exc) {
		}
		return false;
	});

	// Delete Button

	$('.delete', '#road_summary').click(function(){
		var vehicleIdx = $('#road_summary ul li').index($(this).parents('li').get(0));
		var vehicle = TPCalc.Road.getVehicle(vehicleIdx);

		// Only delete if the vehicle has already been saved

		if(vehicle.isSaved) {
			TPCalc.Road.deleteUserVehicle(vehicleIdx);
		}

		TPCalc.Road.deleteVehicle(vehicleIdx);		// Remove from application state
		if(TPCalc.Road.getVehicleCount() < 1) {
			TPCalc.Road.addVehicle();		// Always keep at least one empty vehicle in application state
		}
		TPCalc.Road.removeVehicleSummary(vehicle, vehicleIdx);

		// IE6: Need to delay the code that follows the call to TPCalc.Road.removeVehicleSummary(),
		// because that code modifies objects that get used by  TPCalc.Road._loadVehicleControlsIE6(),
		// which is called within removeVehicleSummary() and uses setTimeout() to work around an
		// IE6 DOM access bug (see comments for _loadVehicleControlsIE6()).

		if( $.browser.msie && parseInt($.browser.version) == 6 ) {
			setTimeout(function(){
				TPCalc.Road.updateActiveVehicle();
				TPCalc.Road.updateFootprintSubtotal();
			}, 500);
		} else {
			TPCalc.Road.updateActiveVehicle();
			TPCalc.Road.updateFootprintSubtotal();
		}
	});

	// Edit Button

	$('.edit', '#road_summary').click(function(){

		var liContainer = $(this).parents('li').get(0);
		var vehicleIdx = $('#road_summary ul li').index(liContainer);
		TPCalc.Road.focusVehicleSummary(vehicleIdx);
	});

	// Switch to simple mode

	$('#switch_to_simple').click(function(){

		TPCalc.Road.simpleMode(true);

		// If the most recently vehicle is saved, create a new vehicle. Otherwise, reuse
		// unsaved vehicle at the top of the vehicle queue.
		TPCalc.Road.activeVehicleIdx = 0;
		var vehicle = TPCalc.Road.getVehicle(0);

		if(vehicle.isSaved) {
			TPCalc.Road.resetVehicleControls();
			TPCalc.Road.addVehicle();	// Will be  simple vehicle bec  simpleMode(true) was called
			TPCalc.Road.addVehicleSummary();

		} else {
			vehicle.castAsSimple();		// "cast" existing complex vehicle to be simple
			TPCalc.Road.updateVehicleSummary(vehicle);
		}
		TPCalc.Road.resetSimpVehControls();
		TPCalc.Road.chooseSimpVehControls();

		if(TPCalc.DEBUG >= 4) {
			TPCalc.printDebug("Switch to simple click:\n" + JSON.stringify(TPCalc.Road.vehicles, null, ' '));
		}

		return false;
	});

	// Switch from simple mode

	$('#switch_to_complex').click(function(){

		TPCalc.Road.simpleMode(false);

		// If the most recently vehicle is saved, create a new vehicle. Otherwise, reuse
		// unsaved vehicle at the top of the vehicle queue.
		TPCalc.Road.activeVehicleIdx = 0;
		var vehicle = TPCalc.Road.getVehicle(0);

		if(vehicle.isSaved) {
			TPCalc.Road.resetSimpVehControls();
			TPCalc.Road.addVehicle();
			TPCalc.Road.addVehicleSummary();
		} else {
			vehicle.castAsComplex();
			TPCalc.Road.updateVehicleSummary(vehicle);
		}
		TPCalc.Road.resetVehicleControls();
		TPCalc.Road.chooseVehicleControls();

		if(TPCalc.DEBUG >= 4) {
			TPCalc.printDebug("Switch to complex click:\n" + JSON.stringify(TPCalc.Road.vehicles, null, ' '));
		}

		return false;
	});

	// Monitor simple form elements for all required fields

	$('#simple_mpg').blur( TPCalc.Road.autoEnableSimpVehCalculate );
	$('#simple_miles').change( TPCalc.Road.autoEnableSimpVehCalculate );
	$('#simple_road_controls input[type=radio][name=simple_fuel]').click( TPCalc.Road.autoEnableSimpVehCalculate );

	// Filter charactesr
	AutoComplete.bindInputFilter($('#simple_mpg'), AutoComplete.filterForDigit);

	// Simple calculate button

	$('#simple_calculate').click(function(){
		if(!TPCalc.Road.validateSimpVehInputs(true)) {
			return false;
		}
		TPCalc.Road.updateActiveVehicle();
		TPCalc.Road.saveUserVehicle();
		TPCalc.Road.updateVehicleSummary();
		TPCalc.Road.updateFootprintSubtotal();
		TPCalc.Road.enableVehicleAdd();

		return false;
	});
},

initDOMClones: function() {

	// Save canonical DOM nodes used in cloning

	$('#road_summary ul').each(function(i, list){
		$(list).data('defaultItem', $('li:first-child', list).clone(true).removeClass('only-child'));
	});
},

loadUserData: function() {

	// Migrate old data formats to current data format

	TPCalc.User.migrateRoadData();

	// Get saved user data

	var usrVehicles = TPCalc.User.getVehicles();
	var vehicle;

	if(usrVehicles && usrVehicles.length > 0) {

		$('#road_summary ul li:only-child.active').remove();

		for(var i=usrVehicles.length-1; i >= 0; i--) {

			// Create and initialize Vehicle object

			vehicle = new TPCalc.Road.Vehicle();
			vehicle.fromJSONObject(usrVehicles[i]);

			TPCalc.Road.addVehicle(vehicle);
			TPCalc.Road.addVehicleSummary(vehicle);
		}
		TPCalc.Road.loadVehicleControls(vehicle);	// Load the last one into the controls
		TPCalc.Road.updateFootprintSubtotal(true);
	}

	if(TPCalc.Road.getVehicleCount() < 1) {
		TPCalc.Road.addVehicle();
	}
	TPCalc.Road.loadSubmittedVehicle();
},

isModelProfileEmpty: function(year, make, model) {
	if(!year || !make || !model) {
		return true;
	}

	var exc, stats, numTrans=0, numFuel=0;
	try{
		stats = TPCalc.Road.co2Data[year][make][model];
		for(var trans in stats) {
			numTrans++;
			if(numTrans > 1) {
				return false;
			}
			for(var fuel in stats[trans]) {
				numFuel++;
				if(numFuel > 1) {
					return false;
				}
				if(fuel == TPCalc.Road.FUEL_DIESEL) {
					return false;
				}
			}
		}
	} catch(exc) {
	}
	return true;
},

////// These methods manage the road calculator data model state //////

simpleMode: function(flag) {
	if(flag !== undefined) {
		TPCalc.Road.useSimpleMode = Boolean(flag);
	}
	return TPCalc.Road.useSimpleMode;
},

getVehicles: function(idx) {
	return TPCalc.Road.vehicles;
},

getVehicle: function(idx) {
	return TPCalc.Road.vehicles.length > 0 ? TPCalc.Road.vehicles[idx] : false;
},

getVehicleIdxById: function(id) {
	for(var i=0, max=TPCalc.Road.vehicles.length; i<max; i++) {
		if(TPCalc.Road.vehicles[i].id == id) {
			return i;
		}
	}
	return false;
},

getActiveVehicle: function() {
	return TPCalc.Road.getVehicle(TPCalc.Road.activeVehicleIdx);
},

updateActiveVehicle: function() {
	var activeVehicle = TPCalc.Road.getActiveVehicle();

	if(!activeVehicle) {
		return;
	}

	if(!activeVehicle.isSimple) {
		activeVehicle.revise(
		  $('#vehicle_year:enabled').val(),
		  $('#vehicle_make:enabled').val(),
		  $('#vehicle_model:enabled').val(),
		  $('#vehicle_miles:enabled').val(),
		  $('input[type=radio][name=vehicle_transmission]:enabled:checked').val(),
		  $('input[type=radio][name=vehicle_fuel]:enabled:checked').val(),
		  $('#vehicle_biodiesel_percent:enabled').val()
		);
	} else {
		activeVehicle.revise(
		  $('#simple_mpg:enabled').val(),
		  $('#simple_miles:enabled').val(),
		  $('#simple_road_controls input[type=radio][name=simple_fuel]:checked:enabled').val()
		);
	}

	if(TPCalc.DEBUG >= 4) {
		TPCalc.printDebug("TPCalc.Road.updateActiveVehicle():\n" + JSON.stringify(TPCalc.Road.vehicles, null, ' '));
	}
},

addVehicle: function(vehicle) {
	if(!vehicle) {
		vehicle = new TPCalc.Road.Vehicle();
	}
	TPCalc.Road.vehicles.unshift(vehicle);

	if(TPCalc.DEBUG >= 4) {
		TPCalc.printDebug("TPCalc.Road.addVehicle():\n" + JSON.stringify(TPCalc.Road.vehicles, null, ' '));
	}

	return vehicle;
},

deleteVehicle: function(idx) {
	var v = TPCalc.Road.vehicles.splice(idx, 1);

	if(TPCalc.DEBUG >= 4) {
		TPCalc.printDebug("TPCalc.Road.deleteVehicle() - index "+idx+", id "+v.id+":\n" + JSON.stringify(TPCalc.Road.vehicles, null, ' '));
	}
},

getVehicleCount: function() {
	return TPCalc.Road.vehicles.length;
},

fetchVehicleCo2Data: function(year, make) {
	var url = TPCalc.Road.VEHICLE_CO2_DATA_URL + '?year=' + year + '&make=' + make;

	return TPCalc.getJSON(url, function(json) {
		TPCalc.Road.co2Data[year][make] = json;
	});
},

////// These methods update the UI //////

updateFootprintSubtotal: function() {
	var total = Math.round(TPCalc.Road.calcFootprint(true));
	$('#road_carbon_footprint').html(total.toFormattedString());
	TPCalc.updateFootprintTotal();
	TPCalc.setCalculatorProgress(TPCalc.TYPE_ROAD, total > 0);
},

calcFootprint: function(forceRecalc) {
	if(forceRecalc || TPCalc.Road.subtotalFootprint < 0) {
		var subtotal = 0;
		var cars = TPCalc.Road.getVehicles();
		if(cars) {
			for(var i=0, numCars = cars.length; i < numCars; i++) {
				subtotal += cars[i].calcCo2LbsPerYear();
			}
		}
		TPCalc.Road.subtotalFootprint = subtotal;
	}
	return TPCalc.Road.subtotalFootprint;
},

addVehicleSummary: function( vehicle ) {

	// Find original default list item node,
	// clone it, revise the heading text within
	// the HTML of the node, and add it to the DOM

	var $list = $('#road_summary ul');
	var $li = $list.data('defaultItem').clone(true);
	var $header = $('.vehicle-id', $li);
	var hdrStr = $header.html();

	// Make note of list height when there are exactly two list items

	if($('li', $list).length == 2) {
		var listHeight = $list.height();
	}

	$('li.active', $list).removeClass('active');
	$header.html(hdrStr.replace(/\d+\s*$/, $('li', $list).length+1));
	$list.prepend($li);

	if(vehicle) {
		TPCalc.Road.updateVehicleSummary(vehicle, 0);
	}

	// The max height of the vehicle summary list
	// should be whatever the height when there are
	// exactly two vehicle summaries

	if($('li', $list).length > TPCalc.SCROLL_THRESHOLD) {
		if(!$list.hasClass('scrolling')) {
			$list.height(listHeight).addClass('scrolling');
		}
	}
},

updateVehicleSummary: function(vehicle, vIdx) {

	if(vIdx === undefined) {
		vIdx = TPCalc.Road.activeVehicleIdx;
	}
	if(!vehicle) {
		TPCalc.Road.updateActiveVehicle();
		vehicle = TPCalc.Road.getActiveVehicle();
	}

	var summary = $("#road_summary ul li").get(vIdx);
	var $header = $('.vehicle-id', summary);
	if(!$header.data('defaultInnerHTML')) {
		$header.data('defaultInnerHTML', $header.html());
	}

	if(vehicle.year || vehicle.make || vehicle.model) {
		$header.html( $.trim((vehicle.year||'') + ' ' + (vehicle.make||'') + ' ' + (vehicle.model||'')) );
	} else {
		$header.html($header.data('defaultInnerHTML'));
	}

	var isSimple = vehicle.isSimple;
	var showDescr;
	if(!isSimple) {
		showDescr = vehicle.year && vehicle.make && vehicle.model && (vehicle.transmissionType || vehicle.fuelType);
	} else {
		showDescr = vehicle.galsPerMile || vehicle.milesPerYear || vehicle.fuelType;
	}

	if(showDescr) {

		var descrStr = '';
		if(!isSimple) {

			// Figure out number of transmission options for a model because
			// if there is only one option, we suppress the display of
			// that option

			var numTransOpts = vehicle.getTransmissionTypeCount();

			// Build vehicle description string

			if(numTransOpts > 1) {
				descrStr += vehicle.transmissionType.toLowerCase() + " transmission";
			}
		}
		if(vehicle.fuelType && vehicle.fuelType != TPCalc.Road.FUEL_GAS) {
			if(descrStr != '') {
				descrStr += ", ";
			}
			descrStr += vehicle.fuelType.toLowerCase() + " fuel";
		}
		if(vehicle.fuelType == TPCalc.Road.FUEL_DIESEL && parseInt(vehicle.percentBiodiesel) > 0) {
			descrStr += " (" + vehicle.percentBiodiesel + " biodiesel)";
		}

		// Capitalize first letter only of vehicle description

		if(descrStr) {
			descrStr = descrStr.charAt(0).toUpperCase() + descrStr.substr(1);
		}

		$('.vehicle-description', summary).html(descrStr);
		$('.vehicle-controls .hidden', summary).removeClass('hidden');

		// Bind click event handler to details link

		var url = TPCalc.Road.DETAILS_PAGE_URL + '?id=' + vehicle.id;
		$('.detail', summary).unbind('click').click(function() {
			var exc;
			try {
				TPCalc.openDetailsWindow(url);
			} catch(exc) {
				// ignore //
			}
			return false;
		});

		if(vehicle.milesPerYear) {
			var milesPerYearFormatted = Math.round(vehicle.milesPerYear).toFormattedString();
			var galsPerYearFormatted = Math.round(vehicle.calcGallonsPerYear()).toFormattedString();

			$('.vehicle-consumption', summary).removeClass('hidden')
			  .find('.vehicle-miles').html(milesPerYearFormatted).end()
			  .find('.vehicle-gallons').html(galsPerYearFormatted).end();

			if(!vehicle.isDirty) {
				var co2LbsPerYearFormatted = Math.round(vehicle.calcCo2LbsPerYear()).toFormattedString();
				$('.vehicle-bottom-line', summary).removeClass('hidden')
				  .find('.vehicle-carbon-total').html(co2LbsPerYearFormatted);
				$('.vehicle-detail .detail', summary).removeClass('hidden');
			} else {
				$('.vehicle-bottom-line', summary).addClass('hidden')
				  .find('.vehicle-carbon-total').html('0');
				$('.vehicle-detail .detail', summary).addClass('hidden');
			}
		} else {
			$('.vehicle-consumption', summary).addClass('hidden')
			  .find('.vehicle-miles, .vehicle-gallons').html('0');
			$('.vehicle-detail .detail', summary).addClass('hidden');
		}

		// Place miles per gallon info on scale

		if(vehicle.cityMpg || vehicle.hwyMpg) {

			$('.vehicle-mpg-scale', summary).removeClass('hidden')

			var leftMpg, rightMpg;
			if((!vehicle.hwyMpg && vehicle.cityMpg) || vehicle.cityMpg <= vehicle.hwyMpg) {
				leftMpg = vehicle.cityMpg;
				rightMpg = vehicle.hwyMpg;
				$('.vehicle-mpg-scale .vehicle-mpg-city', summary)
				  .removeClass('right').addClass('left');
				$('.vehicle-mpg-scale .vehicle-mpg-hwy', summary)
				  .removeClass('left').addClass('right');
			} else {
				leftMpg = vehicle.hwyMpg;
				rightMpg = vehicle.cityMpg;
				$('.vehicle-mpg-scale .vehicle-mpg-hwy', summary)
				  .removeClass('right').addClass('left');
				$('.vehicle-mpg-scale .vehicle-mpg-city', summary)
				  .removeClass('left').addClass('right');
			}

			var range = TPCalc.Road.MPG_SCALE_MAX - TPCalc.Road.MPG_SCALE_MIN;
			var pct, targetPoint, $slider, posX, mpgHtml;

			$slider = $('.vehicle-mpg-scale .left', summary);
			if(leftMpg) {
				pct = Math.min(leftMpg / range, 1);	// Do not allow greater than 100%
				targetPoint = pct * TPCalc.Road.MPG_SCALE_PIXEL_WIDTH;
				posX = Math.round(TPCalc.Road.MPG_SCALE_PIXEL_X_OFFSET + targetPoint - $slider.width());
				$slider.css('left', posX + 'px');

				mpgHtml = $slider.html().replace(/\d+/, Math.round(leftMpg));
				$slider.html(mpgHtml).removeClass('hidden');
			} else {
				mpgHtml = $slider.html().replace(/\d+/, '0');
				$slider.html(mpgHtml).addClass('hidden');
			}
			$slider = $('.vehicle-mpg-scale .right', summary);
			if(!isSimple && rightMpg) {
				pct = Math.min(rightMpg / range, 1);	// Do not allow greater than 100%
				targetPoint = pct * TPCalc.Road.MPG_SCALE_PIXEL_WIDTH;
				posX = Math.round(TPCalc.Road.MPG_SCALE_PIXEL_X_OFFSET + targetPoint);
				$slider.css('left', posX + 'px');

				mpgHtml = $slider.html().replace(/\d+/, Math.round(rightMpg));
				$slider.html(mpgHtml).removeClass('hidden');
			} else {
				mpgHtml = $slider.html().replace(/\d+/, '0');
				$slider.html(mpgHtml).addClass('hidden');
			}
		} else {
			$('.vehicle-mpg-scale', summary).addClass('hidden')

		}

		if(TPCalc.DEBUG >= 5) {
			TPCalc.printDebug('CURRENT ROAD CALC FORM VALUES');
			$('#road_calculator :input:enabled').each(function(i, input){
				if(input.checked === undefined || input.checked) {
					TPCalc.printDebug(input.name + ' : ' + $(input).val());
				}
			});
		}
	} else {
		$('.vehicle-description', summary).empty();
		$('.vehicle-detail > *', summary).addClass('hidden');
		$('.vehicle-mpg-scale', summary).addClass('hidden')
		  .find('.vehicle-mpg-city,.vehicle-mpg-hwy').each(function(){
			$(this).html( $(this).html().replace(/\d+/, '0') );
		  });
		$('.vehicle-controls > *', summary).addClass('hidden');
		$('.vehicle-consumption', summary).addClass('hidden')
		  .find('.vehicle-miles, .vehicle-gallons').html('0');
		$('.vehicle-bottom-line', summary).addClass('hidden')
		  .find('.vehicle-carbon-total').html('0');
	}
},

removeVehicleSummary: function(vehicle, vIdx) {

	var $list = $('#road_summary ul li');

	// Different behavior if the list has only one summary item

	if($list.length > 1) {

		// Remove summary item from UI

		$list.eq(vIdx).remove();
		$('#road_summary ul li:only-child').addClass('only-child');

		// If del item is before active item revise indices. If del item = active item, "focus"
		// shifted to next item, whose new index = deleted item's old index

		if(vIdx < TPCalc.Road.activeVehicleIdx) {
			TPCalc.Road.activeVehicleIdx--;
		} else if(TPCalc.Road.activeVehicleIdx == vIdx) {
			TPCalc.Road.focusVehicleSummary(TPCalc.Road.activeVehicleIdx);
		}
	} else {
		vehicle.isSaved = false;
		vehicle.isDirty = true;
		TPCalc.Road.resetVehicleYear();
		TPCalc.Road.updateVehicleSummary();
	}

	if($('#road_summary ul li').length <= TPCalc.SCROLL_THRESHOLD) {
		$('#road_summary ul').height('').removeClass('scrolling');
	}
},

focusVehicleSummary: function(vIdx) {
	TPCalc.Road.activeVehicleIdx = vIdx;

	var vehicle = TPCalc.Road.getVehicle(vIdx);
	if(!vehicle) {
		return;
	}

	TPCalc.Road.loadVehicleControls(vehicle);

	$('#road_summary ul li').eq(vIdx)
	  .siblings('.active').removeClass('active').end()
	  .addClass('active');
},

autoEnableVehicleCalculate: function() {
	if(TPCalc.Road.validateVehicleInputs()) {
		$("#vehicle_calculate").removeAttr('disabled').removeClass('disabled');
	} else {
		$("#vehicle_calculate").attr('disabled', 'disabled').addClass('disabled');
	}
},

validateVehicleInputs: function(showError) {
	var year = parseInt($('#vehicle_year:enabled').val());
	var make = $('#vehicle_make:enabled').val();
	var model = $('#vehicle_model:enabled').val();
	var trans = $('input[name=vehicle_transmission]:checked:enabled').val();
	var fuel = $('input[name=vehicle_fuel]:checked:enabled').val();
	var milesPerYear = parseInt($('#vehicle_miles:enabled').val());

	return !isNaN(year) && year > 1900 && year < 3000 && make && model && trans && fuel && !isNaN(milesPerYear) && milesPerYear > 0;
},

resetSimpVehControls: function() {
	$("#simple_road_controls :text").val('');
	$("#simple_miles").val(TPCalc.Road.DEFAULT_MILES);
	$("#simple_road_controls input[type=radio]").attr('checked', false);
	TPCalc.Road.autoEnableSimpVehCalculate();
	TPCalc.Road.resetVehicleAdd();
},

autoEnableSimpVehCalculate: function() {
	if(TPCalc.Road.validateSimpVehInputs()) {
		$("#simple_calculate").removeAttr('disabled').removeClass('disabled');
	} else {
		$("#simple_calculate").attr('disabled', 'disabled').addClass('disabled');
	}
},

validateSimpVehInputs: function(showError) {
	var mpg = parseInt($('#simple_mpg').val());
	var miles = parseInt($('#simple_miles').val());
	var fuel = $('#simple_road_controls input[type=radio][name=simple_fuel]:checked').length > 0;

	var isValid = !isNaN(mpg) && mpg > 0 && !isNaN(miles) && miles > 0 && fuel;

	if(isNaN(mpg) || mpg < 1) {
		if(showError) {
			TPCalc.showError("The miles per gallon value must be a positive number.");
		}
		return false;
	}
	if(isNaN(miles) || miles < 1) {
		if(showError) {
			TPCalc.showError("The miles per year value must be a positive number.");
		}
		return false;
	}
	if(!fuel) {
		if(showError) {
			TPCalc.showError("You must specify a fuel type.");
		}
		return false;
	}

	return true;
},

resetVehicleControls: function() {
	TPCalc.Road.resetVehicleYear();  // Cascades down resets
},

chooseSimpVehControls: function() {
	$('#complex_road_controls').addClass('hidden');
	$('#simple_road_controls').removeClass('hidden');
},

chooseVehicleControls: function() {
	$('#simple_road_controls').addClass('hidden');
	$('#complex_road_controls').removeClass('hidden');
},

resetVehicleYear: function () {
	$('#vehicle_year').val('');
	TPCalc.Road.resetVehicleMake();
},

enableVehicleMake: function() {
	var year = $('#vehicle_year').val();
	var $selectMake = $('#vehicle_make');

	if(!year || !TPCalc.Road.co2Data[year]) {
		return;
	}

	$selectMake.removeAttr('disabled');
	for(var make in TPCalc.Road.co2Data[year]){
		$selectMake.append('<option value="'+ make +'">'+ make +'</option>');
	}
},

resetVehicleMake: function() {
	var $selectMake = $('#vehicle_make');
	if($selectMake.attr('disabled')) {
		return;
	}
	$selectMake.attr('disabled', 'disabled').find('option:gt(0)').remove();
	TPCalc.Road.resetVehicleModel();
},

enableVehicleModel: function() {
	var year = $('#vehicle_year').val();
	var make = $('#vehicle_make').val();
	var $selectModel = $('#vehicle_model');

	if(!year || !make) {
		return;
	}
	if(!TPCalc.Road.co2Data[year][make] && !TPCalc.Road.fetchVehicleCo2Data(year, make)) {
		TPCalc.showError('There was a problem loading car CO2 data.');
		return;
	}

	$selectModel.removeAttr('disabled');
	for(var model in TPCalc.Road.co2Data[year][make]){
		$selectModel.append('<option value="'+ model +'">'+ model +'</option>');
	}
},

resetVehicleModel: function() {
	var $selectModel = $('#vehicle_model');
	if($selectModel.attr('disabled')) {
		return;
	}
	$selectModel.attr('disabled', 'disabled').find('option:gt(0)').remove();
	TPCalc.Road.collapseVehicleModelProfile();
},

expandVehicleModelProfile: function() {
	var year = $('#vehicle_year').val();
	var make = $('#vehicle_make').val();
	var model = $('#vehicle_model').val();

	if(!year || !make || !model) {
		return;
	}

	if(!TPCalc.Road.isModelProfileEmpty(year, make, model)) {
		$('#vehicle_model_profile').removeClass('collapsed');
		$('#vehicle_model_fieldset').removeClass('off');	// There's a clearer way of doing this...
	}
},

collapseVehicleModelProfile: function() {
	$('#vehicle_model_profile').addClass('collapsed');
	TPCalc.Road.resetVehicleTransmission();  // Should cascade down within the model profile
	TPCalc.Road.resetVehicleMiles();
	$('#vehicle_model_fieldset').addClass('off');
},

enableVehicleTransmission: function() {

	var year = $('#vehicle_year').val();
	var make = $('#vehicle_make').val();
	var model = $('#vehicle_model').val();

	if(!year || !make || !model) {
		return;
	}

	// Disable and hide undefined options

	$('#vehicle_model_profile input[type=radio][name=vehicle_transmission]')
	  .each(function(){
		var $radio = $(this);
		if(TPCalc.Road.co2Data[year][make][model][$radio.val()]){
			$radio
			  .removeAttr('disabled')
			  .parent('li').removeClass('hidden');
		} else {
			$radio
			  .attr('disabled', 'disabled')
			  .parent('li').addClass('hidden');
		}
	  });

	// Check radio button if it is the only allowed option

	$('#vehicle_model_profile input[type=radio][name=vehicle_transmission]').parents('.data-pair').eq(0).each(function(){
		var $radio = $(this);
		if($('input[type=radio]:enabled', this).length == 1) {
			$('input[type=radio]:enabled', $radio).eq(0).attr('checked', true);
			$radio.addClass('hidden');
		} else {
			$radio.removeClass('hidden');
		}
	});

},

resetVehicleTransmission: function() {
	$('#vehicle_model_profile input[type=radio][name=vehicle_transmission]')
	  .attr('checked', false)
	  .attr('disabled', 'disabled')
	  .filter(function(){
		return $(this).val() == TPCalc.Road.DEFAULT_TRANSMISSION;
	  }).attr('checked', true);

	TPCalc.Road.resetVehicleFuel();
},

enableVehicleFuel: function() {

	var year = $('#vehicle_year').val();
	var make = $('#vehicle_make').val();
	var model = $('#vehicle_model').val();
	var transmission = $('#complex_road_controls input[type=radio][name=vehicle_transmission]:enabled:checked').val();

	if(!year || !make || !model) {
		return;
	}

	// Disable and hide undefined options

	if(transmission) {
		$('#vehicle_model_profile input[type=radio][name=vehicle_fuel]').each(function(){
			var $radio = $(this);
			if(TPCalc.Road.co2Data[year][make][model][transmission][$radio.val()]){
				$radio
				  .removeAttr('disabled')
				  .parent('li').removeClass('hidden');
			} else {
				$radio
				  .parent('li').addClass('hidden');
			}
		  });
	}

	// Check radio button if it is the only allowed option

	$('#vehicle_model_profile input[type=radio][name=vehicle_fuel]').parents('.data-pair').eq(0).each(function(){
		var $radio = $(this);
		if($('input[type=radio]:enabled', this).length == 1) {
			$('input[type=radio]:enabled', $radio).eq(0).attr('checked', true);
			$radio.addClass('hidden');
		} else {
			$radio.removeClass('hidden');
		}
	});

},

resetVehicleFuel: function() {
	$('#vehicle_model_profile input[type=radio][name=vehicle_fuel]')
	  .attr('checked', false)
	  .attr('disabled', 'disabled')
	  .filter(function(){
		return $(this).val() == TPCalc.Road.DEFAULT_FUEL;
	  }).attr('checked', true);

	TPCalc.Road.resetVehiclePercentBiodiesel();
},

enableVehiclePercentBiodiesel: function() {
	var year = $('#vehicle_year').val();
	var make = $('#vehicle_make').val();
	var model = $('#vehicle_model').val();
	var fuel = $('#complex_road_controls [name=vehicle_fuel]:enabled:checked').val();

	if(!year || !make || !model || !fuel) {
		return;
	}

	if(fuel == TPCalc.Road.FUEL_DIESEL) {
		$('#vehicle_biodiesel_controls').removeClass('collapsed');
		$('#vehicle_biodiesel_percent').removeAttr('disabled');
		if($('#vehicle_biodiesel_controls input[name=vehicle_use_biodiesel]:enabled:checked').val() == '1') {
			$('#vehicle_biodiesel_percent').removeClass('hidden');
		} else {
			$('#vehicle_biodiesel_percent').addClass('hidden');
		}
	} else {
		$('#vehicle_biodiesel_controls').addClass('collapsed');
		$('#vehicle_biodiesel_percent').attr('disabled','disabled');
	}
},

resetVehiclePercentBiodiesel: function() {
	$('#vehicle_biodiesel_controls').addClass('collapsed');

	$('#vehicle_use_biodiesel_no').attr('checked', true);

	$('#vehicle_biodiesel_percent')
	  .val(TPCalc.Road.DEFAULT_BIODIESEL_PERCENT)
	  .attr('disabled','disabled')
	  .addClass('hidden');
},

enableVehicleMiles: function() {
	var year = $('#vehicle_year').val();
	var make = $('#vehicle_make').val();
	var model = $('#vehicle_model').val();
	var transmission = $('input[type=radio][name=vehicle_transmission]:enabled:checked').val();
	var fuel = $('#complex_road_controls [name=vehicle_fuel]:enabled:checked').val();

	if(!year || !make || !model || !transmission || !fuel) {
		return;
	}

	var $selectMiles = $('#vehicle_miles');
	$selectMiles.removeAttr('disabled');

	if($selectMiles.val() != '') {
		TPCalc.Road.enableVehicleAdd();
	}
},

resetVehicleMiles: function() {
	if($('#vehicle_miles').attr('disabled')) {
		return;
	}

	$('#vehicle_miles')
	  .attr('disabled', 'disabled')
	  .val(TPCalc.Road.DEFAULT_MILES);

	TPCalc.Road.autoEnableVehicleCalculate();
	TPCalc.Road.resetVehicleAdd();
},

enableVehicleAdd: function() {
	var isSimpleMode = TPCalc.Road.simpleMode();
	if(!isSimpleMode) {
		var year = $('#vehicle_year').val();
		var make = $('#vehicle_make').val();
		var model = $('#vehicle_model').val();
		var transmission = $('input[type=radio][name=vehicle_transmission]:enabled:checked').val();
		var fuel = $('#complex_road_controls [name=vehicle_fuel]:enabled:checked').val();
		var miles = $('#vehicle_miles').val();

		if(!year || !make || !model || !miles || !fuel || !transmission) {
			return;
		}
	}

	// Do not enable if edit focus is on a saved vehicle but an unsaved home exists

	var allCarsSaved = true;
	var cars = TPCalc.Road.getVehicles();
	for(var i=0, max=cars.length; i < max; i++) {
		if(!cars[i].isSaved) {
			allCarsSaved = false;
			break;
		}
	}

	if(allCarsSaved) {
		$('#add_vehicle').removeAttr('disabled').removeClass('disabled');
	}
},

resetVehicleAdd: function() {
	$('#add_vehicle').attr('disabled', 'disabled').addClass('disabled');
},

saveUserVehicle: function() {
	TPCalc.Road.updateActiveVehicle();
	var vehicle = TPCalc.Road.getActiveVehicle();

	// Save this vehicle, provided all its required features have been specified

	if(!vehicle.isComplete()) {
		return false;
	}

	// Save the JSON representation of the vehicle to the user profile

	var jsonObj = vehicle.toJSONObject();
	var activeIdx = TPCalc.Road.activeVehicleIdx;
	var success;

	if(!vehicle.isSaved) {
		vehicle.id = TPCalc.User.addVehicle(jsonObj);
		success = vehicle.isSaved = Boolean(vehicle.id);
	} else {
		success = TPCalc.User.updateVehicleById(jsonObj, vehicle.id);
	}

	vehicle.isDirty = !success;

	if(!success) {
		TPCalc.showError("There was a problem saving this vehicle to your profile.");
	}

	if(TPCalc.DEBUG >= 2) {
		TPCalc.printDebug("<h2>TPCalc.Road.saveUserVehicle(): User Data Cookie</h2>"
		  + JSON.stringify(TPCalc.User.retrieveRoadData(), null, " "));
	}

	return true;
},

deleteUserVehicle: function(vIdx) {

	if(vIdx === undefined) {
		vIdx = TPCalc.Road.activeVehicleIdx;
	}

	var vehicle = TPCalc.Road.getVehicle(vIdx);

	TPCalc.User.deleteVehicleById(vehicle.id);

	if(TPCalc.DEBUG >= 2) {
		TPCalc.printDebug("<h2>TPCalc.Road.deleteUserVehicle(): User Data Cookie</h2>"
		  + JSON.stringify(TPCalc.User.retrieveRoadData(), null, " "));
	}
},

loadVehicleControls: function(vehicle) {
	if(!vehicle) {
		vehicle = TPCalc.Road.getActiveVehicle();
	}
	if(vehicle.isSimple) {
		TPCalc.Road.simpleMode(true);
		TPCalc.Road.chooseSimpVehControls();
		TPCalc.Road._loadSimpVehControls(vehicle);
	} else {
		TPCalc.Road.simpleMode(false);
		TPCalc.Road.chooseVehicleControls();
		TPCalc.Road._loadVehicleControls(vehicle);
	}
},

// Implemention for loadVehicleControls() for complex vehicles

_loadVehicleControls: function(vehicle) {

	TPCalc.Road.resetVehicleYear();

	$('#vehicle_year').val(vehicle.year);
	TPCalc.Road.enableVehicleMake();
	$('#vehicle_make').val(vehicle.make);
	TPCalc.Road.enableVehicleModel();
	$('#vehicle_model').val(vehicle.model);

	TPCalc.Road.expandVehicleModelProfile();

	TPCalc.Road.enableVehicleTransmission();
	$('#complex_road_controls input[name=vehicle_transmission][value='+ vehicle.transmissionType +']:enabled').attr('checked',true);
	TPCalc.Road.enableVehicleFuel();
	$('#complex_road_controls input[name=vehicle_fuel][value='+ vehicle.fuelType +']:enabled').attr('checked',true);
	TPCalc.Road.enableVehiclePercentBiodiesel();
	if(vehicle.fuelType == TPCalc.Road.FUEL_DIESEL) {
		$('#vehicle_biodiesel_percent').removeAttr('disabled');
		if(parseInt(vehicle.percentBiodiesel) > 0) {
			$('#vehicle_use_biodiesel_yes').attr('checked',true);
			$('#vehicle_biodiesel_percent')
			  .removeClass('hidden')
			  .val(vehicle.percentBiodiesel);
		} else {
			$('#vehicle_use_biodiesel_no').attr('checked',true);
			$('#vehicle_biodiesel_percent')
			  .addClass('hidden')
			  .val(TPCalc.Road.DEFAULT_BIODIESEL_PERCENT);
		}
	}

	TPCalc.Road.enableVehicleMiles();
	$('#vehicle_miles').val(vehicle.milesPerYear);
	TPCalc.Road.autoEnableVehicleCalculate();
	TPCalc.Road.enableVehicleAdd();

},

// Implemention for loadVehicleControls() for complex vehicles
// BUT only for MS IE6.
//
// We have a huge IE6 hack here. This alternate, IE6-specific implementation
// is in response to a known bug filed with jQuery:
//
//   <http://dev.jquery.com/ticket/2252>
//
// It is not clear, however, whether the bug is fundamental, not specific to
// jQuery. There is at least one claim that the problem is with IE6 -- namely,
// that IE6 does not update its DOM until it gets control back from the script:
//
//   <http://remysharp.com/2007/01/20/auto-populating-select-boxes-using-jquery-ajax/#comment-6625>
//
// For now, the following is a workaround. At some point it would be worthwhile
// to check whether a jQuery-less implementation circumvents this bug, obviating
// the browser-specific code forking.

_loadVehicleControlsIE6: function(vehicle) {

	TPCalc.Road.resetVehicleYear();

	setTimeout(function() {
		$('#vehicle_year').val(vehicle.year);
		TPCalc.Road.enableVehicleMake();
		setTimeout(function(){
			$('#vehicle_make').val(vehicle.make);
			TPCalc.Road.enableVehicleModel();
			setTimeout(function() {
				$('#vehicle_model').val(vehicle.model);
				TPCalc.Road.expandVehicleModelProfile();
				TPCalc.Road.enableVehicleTransmission();

				$('#complex_road_controls input[name=vehicle_transmission][value='+ vehicle.transmissionType +']:enabled').attr('checked',true);
				TPCalc.Road.enableVehicleFuel();
				$('#complex_road_controls input[name=vehicle_fuel][value='+ vehicle.fuelType +']:enabled').attr('checked',true);
				TPCalc.Road.enableVehiclePercentBiodiesel();

				if(vehicle.fuelType == TPCalc.Road.FUEL_DIESEL) {
					$('vehicle_biodiesel_percent').removeAttr('disabled');
					if(parseInt(vehicle.percentBiodiesel) > 0) {
						$('#vehicle_use_biodiesel_yes').attr('checked',true);
						$('#vehicle_biodiesel_percent')
						  .removeClass('hidden')
						  .val(vehicle.percentBiodiesel);
					} else {
						$('#vehicle_use_biodiesel_no').attr('checked',true);
						$('#vehicle_biodiesel_percent')
						  .addClass('hidden')
						  .val(TPCalc.Road.DEFAULT_BIODIESEL_PERCENT);
					}
				}

				TPCalc.Road.enableVehicleMiles();
				setTimeout(function() {
					$('#vehicle_miles').val(vehicle.milesPerYear);
					TPCalc.Road.autoEnableVehicleCalculate();
					TPCalc.Road.enableVehicleAdd();
				}, 0);
			}, 0);
		}, 0);
	}, 0);
},

// Implementation for loadVehicleControls() for simple vehicles

_loadSimpVehControls: function(vehicle) {

	TPCalc.Road.resetSimpVehControls();

	var mpg = vehicle.cityMpg ? vehicle.cityMpg : '';
	var milesPerYear = vehicle.milesPerYear;
	var fuelType = vehicle.fuelType;

	$('#simple_mpg').val(mpg);
	$('#simple_miles').val(milesPerYear);
	$('#simple_road_controls input[type=radio][name=simple_fuel][value='+fuelType+']').attr('checked', true);
	TPCalc.Road.autoEnableSimpVehCalculate();
	TPCalc.Road.enableVehicleAdd();
},

loadSubmittedVehicle: function() {

	var params = TPCalc.parseQueryString();
	if(!params || !params['year']) {
		return;
	}

	var activeVehicle = TPCalc.Road.getActiveVehicle();
	var newVehicle;

	TPCalc.Road.chooseVehicleControls();
	if(!activeVehicle || activeVehicle.isSaved) {
		TPCalc.Road.activeVehicleIdx = 0;
		newVehicle = new TPCalc.Road.Vehicle(params['year'], params['make']);
		TPCalc.Road.addVehicle(newVehicle);
		TPCalc.Road.loadVehicleControls(newVehicle);
		TPCalc.Road.addVehicleSummary();
	} else {
		newVehicle = activeVehicle;
		newVehicle.revise(params['year'], params['make']);
		TPCalc.Road.loadVehicleControls(newVehicle);
	}
	TPCalc.Road.updateVehicleSummary(newVehicle);
}

};  // End TPCalc.Road //

/**
 * TPCalc.Air application object
 *
 * This singleton defines the settings and functionality specific to
 * the air travel calculator portion of the unified calculator.
 *
 * Depends on jQuery (external) and AutoComplete.
 */

TPCalc.Air = {

///////////////
// Constants //
///////////////

DETAILS_PAGE_URL:       './flight-details',

WRI_CO2_FACTORS: 	[ {mileThreshold: 0,    lbsCo2PerMile: 0.64},
			  {mileThreshold: 281,  lbsCo2PerMile: 0.45},
			  {mileThreshold: 994, lbsCo2PerMile: 0.39} ],

DEFAULT_SEAT_CLASS:    'Economy',
SEAT_CLASSES:          ['Economy', 'Premium Economy', 'Business', 'First'],		// order from lowest to highest

EARTH_RADIUS:           6366.707,		// in kilometers
KM_TO_MILES_FACTOR:     1/1.609344,

SIMPLE_FLIGHT_FACTORS: {co2LbsPerShortFlight: 500, co2LbsPerMediumFlight: 1250, co2LbsPerLongFlight: 2000},

MILE_PENALTY_PER_STOPOVER: 500,	// each stop-over is equiv to a 500-mile flight

/////////////
// Members //
/////////////

isInitialized: false,

/////////////
// Classes //
/////////////

Airport: function(code, displayName, canonName, lat, lng, hemi, lhemi, type) {

	this.code = code || null;
	this.displayName = displayName || null;
	this.cityName = canonName || null;
	this.lat = parseFloat(lat);
	this.lng = parseFloat(lng);
	this.hemi = hemi || null;
	this.lhemi = lhemi || null;
	this.type = type || null;

	var _this = this;

	if(isNaN(this.lat)) {
		this.lat = null;
	}
	if(isNaN(this.lng)) {
		this.lng = null;
	}

	this.isComplete = function() {
		return _this.code && _this.displayName && _this.cityName
		    && _this.lat !== null && _this.lng !== null;
	};

},

Flight: function(fromStr, toStr, numWays, numTimes, numStops, seatClass, airlineCode) {

	this.id = null;
	this.isSaved = false;
	this.isDirty = true;

	this.deptAirport = null;
	this.destAirport = null;
	this.numWays = null;		// 1 = "one way" and 2 = "round trip"
	this.numTimes = null;
	this.numStops = null;
	this.seatClass = null;
	this.airlineCode = null;
	this.airlineName = null;

	// These properties are set only by fromJSONObject()
	// and then are set back to NULL after their first use

	this.milesPerLeg = null;
	this.totalCo2Lbs = null;

	//////////
	// Main //
	//////////

	var _this = this;

	// Method defined up here to precede 'main' section //

	this.revise = function(fromStr, toStr, numWays, numTimes, numStops, seatClass, airlineCode) {

		var deptData = fromStr ? TPCalc.Air.Data.getAirportData(fromStr) : null;
		var destData = toStr ? TPCalc.Air.Data.getAirportData(toStr): null;
		var exc;

		try {
			if( deptData.code != _this.deptAirport.code
			 || destData.code != _this.destAirport.code) {
				_this.isDirty = true;
			}
		} catch(exc) {
			if( (deptData == null && _this.deptAirport != null)
			 || (destData == null && _this.destAirport != null) ) {
				_this.isDirty = true;
			}
		}

		if(deptData) {
			_this.deptAirport = new TPCalc.Air.Airport(
			  deptData.code, deptData.display, deptData.canon, deptData.lat,
			  deptData.lng, deptData.hemi, deptData.lhemi, deptData.type
			);
		} else {
			_this.deptAirport = null;
		}
		if(destData) {
			_this.destAirport = new TPCalc.Air.Airport(
			  destData.code, destData.display, destData.canon, destData.lat,
			  destData.lng, destData.hemi, destData.lhemi, destData.type
			);
		} else {
			_this.destAirport = null;
		}

		if(deptData && destData) {
			if(_this.numWays != numWays
			|| _this.numTimes != numTimes
			|| _this.numStops != numStops
			|| _this.seatClass != seatClass
			|| _this.airlineCode != airlineCode) {
				_this.isDirty = true;
			}
			_this.numWays = numWays !== undefined ? parseInt(numWays) : null;
			_this.numTimes = numTimes !== undefined ? parseInt(numTimes) : null;
			_this.numStops = numStops !== undefined ? parseInt(numStops) : null;
			_this.seatClass = seatClass || null;
			_this.airlineCode = airlineCode || null;
			_this.airlineName = null;
		} else {
			_this.numWays = null;
			_this.numTimes = null;
			_this.numStops = null;
			_this.seatClass = null;
			_this.airlineCode = null;
			_this.airlineName = null;
		}

		_this.milesPerLeg = null;
		_this.totalCo2Lbs = null;
	};


	this.revise(fromStr, toStr, numWays, numTimes, numStops, seatClass, airlineCode);

	/////////////
	// Methods //
	/////////////

	this.fromJSONObject = function(usrObj) {

		var srcCode = usrObj.from;
		var destCode = usrObj.to;

		var src = TPCalc.Air.Data.fetchAirportByCode(srcCode);
		var dest = TPCalc.Air.Data.fetchAirportByCode(destCode);

		if(!src || !dest) {
			return;
		}

		var srcAirport = new TPCalc.Air.Airport(
		  src.code, src.display, src.canon, src.lat,
		  src.lng, src.hemi, src.lhemi, src.type
		);

		var destAirport = new TPCalc.Air.Airport(
		  dest.code, dest.display, dest.canon, dest.lat,
		  dest.lng, dest.hemi, dest.lhemi, dest.type
		);

		_this.id = usrObj.id;
		_this.deptAirport = srcAirport;
		_this.destAirport = destAirport;
		_this.numWays = parseInt(usrObj.ways || 2);
		_this.numTimes = parseInt(usrObj.times || 1);
		_this.numStops = parseInt(usrObj.stops || 0);
		_this.airlineCode = usrObj.airCode;
		_this.airlineName = usrObj.airCode ? usrObj.airName : null;
		_this.seatClass = usrObj.seat;
		_this.milesPerLeg = usrObj.miles / _this.numWays / _this.numTimes;
		_this.totalCo2Lbs = usrObj.co2;

		_this.isSaved = true;
		_this.isDirty = false;
	};

	this.toJSONObject = function() {
		var obj = {
			id:    _this.id,
			from:  _this.deptAirport.code,
			to:    _this.destAirport.code,
			ways:  _this.numWays,
			times: _this.numTimes,
			stops: _this.numStops,
			airCode: _this.airlineCode,
			airName: _this.getAirlineName(),
			seat:  _this.seatClass,
			miles: _this.getMilesTraveledTotal(),
			co2:   _this.calcCo2Lbs()
		};

		return obj;
	};

	this.getAirlineName = function() {
		if(!_this.airlineCode) {
			return null;
		}
		return _this.airlineName || TPCalc.Air.Data.getAirlineName(_this.airlineCode) || null;
	};

	this.getMilesTraveledPerLeg = function() {
		var deptLat, deptLng, destLat, destLng;

		if(_this.milesPerLeg !== null) {
			return _this.milesPerLeg;
		}

		if(_this.deptAirport && _this.destAirport) {
			deptLat = _this.deptAirport.lat;
			deptLng = _this.deptAirport.lng;
			destLat = _this.destAirport.lat;
			destLng = _this.destAirport.lng;
		}

		if(deptLat === undefined || deptLng === undefined
		|| destLat === undefined || destLng === undefined) {
			return 0;
		}

		return TPCalc.Air.Util.distance(deptLat, deptLng, destLat, destLng);
	};

	this.getMilesTraveledPerTrip = function() {
		return _this.getMilesTraveledPerLeg() * _this.numWays;
	};

	this.getMilesTraveledTotal = function() {
		return Math.round(_this.getMilesTraveledPerTrip() * _this.numTimes);
	};

	this.calcCo2Lbs = function() {

		var co2Lbs, trxData, outbndCo2Lbs, inbndCo2Lbs;

		if(_this.totalCo2Lbs !== null) {
			return _this.totalCo2Lbs;
		}
		if(!_this.deptAirport || !_this.destAirport) {
			return 0;
		}

		if(_this.numStops == 0
		&& (trxData = TPCalc.Air.Data.getFlightCo2Data(_this.deptAirport.code, _this.destAirport.code))) {


			// Figure out whether to use cross-airline average statistic or
			// individual airline average statistic

			var airlineFlight = trxData.combinedAverages;
			if(_this.airlineCode && trxData !== undefined) {
				for(var i=0, numAvgs=trxData.allAirlineAverages.length; i < numAvgs; i++) {
					if(trxData.allAirlineAverages[i].airlineCode == _this.airlineCode) {
						airlineFlight = trxData.allAirlineAverages[i];
						break;
					}
				}
			}

			// Get CO2-lbs for the given airline by class.
			// If the class does not exist, pick the lowest (in co2) seat class.
			// If there are no return flights, then just double the outbound flight

			if(airlineFlight.departureCo2[_this.seatClass] !== undefined) {
				outbndCo2Lbs = airlineFlight.departureCo2[_this.seatClass];
			} else {
				outbndCo2Lbs = _this.lowestCo2Seat(airlineFlight.departureCo2);
			}
			inbndCo2Lbs = 0;
			if(_this.numWays > 1) {
				// if "round trip"
				if (airlineFlight.returnCo2 == undefined) {
					inbndCo2Lbs = outbndCo2Lbs;
				} else if(airlineFlight.returnCo2[_this.seatClass] !== undefined) {
					inbndCo2Lbs = airlineFlight.returnCo2[_this.seatClass];
				} else {
					inbndCo2Lbs = _this.lowestCo2Seat(airlineFlight.returnCo2);
				}
			}

			co2Lbs = (outbndCo2Lbs + inbndCo2Lbs) * _this.numTimes;
		} else {
			var milesPerLeg = _this.getMilesTraveledPerLeg();
			var lbsCo2PerMile = TPCalc.Air.Util.getWRICo2Factor(milesPerLeg);
			var lbsCo2PerPenaltyMile = TPCalc.Air.Util.getWRICo2Factor(TPCalc.Air.MILE_PENALTY_PER_STOPOVER);
			var stopoverPenalty = _this.numStops * lbsCo2PerPenaltyMile * TPCalc.Air.MILE_PENALTY_PER_STOPOVER;

			co2Lbs = (milesPerLeg * lbsCo2PerMile + stopoverPenalty) * _this.numWays * _this.numTimes;
		}

		return Math.round(co2Lbs);
	};

	this.isComplete = function() {
		return _this.deptAirport && _this.deptAirport.isComplete()
		    && _this.destAirport && _this.destAirport.isComplete()
		    && !isNaN(_this.numWays) && !isNaN(_this.numTimes) && !isNaN(_this.numStops);
	};

	this.lowestCo2Seat = function(co2SeatArray) {
		var lowestCo2Lbs, currCo2Lbs;
		for(var j=0; j < TPCalc.Air.SEAT_CLASSES.length; j++) {
			currCo2Lbs = co2SeatArray[TPCalc.Air.SEAT_CLASSES[j]];
			if (lowestCo2Lbs == undefined || (currCo2Lbs !== undefined && currCo2Lbs < lowestCo2Lbs))
				lowestCo2Lbs = currCo2Lbs;
		}
		return lowestCo2Lbs;
	};
},

/////////////
// Methods //
/////////////

init: function() {
	var exc;

	if(TPCalc.Air.isInitialized) {
		return;
	}

	// If IE6, overwrite the loadComplexFlightControls method
	// IE6-specific implementation

	if( $.browser.msie && parseInt($.browser.version) == 6 ) {
		TPCalc.Air.UI._loadComplexFlightControls = TPCalc.Air.UI._loadComplexFlightControlsIE6;
	}

	try {
		TPCalc.Air.initDOMNodes();
		TPCalc.Air.initDOMEvents();
		TPCalc.Air.initDOMClones();
		TPCalc.Air.loadUserData();
		TPCalc.Air.isInitialized = true;
	} catch(exc) {
		if(TPCalc.DEBUG > 0){
			TPCalc.handleException(exc);
		} else {
			TPCalc.showError("There was an error with loading the air travel carbon calculator.");
		}
	}
},

initDOMNodes: function() {

	// Set and save default state for input controls

	var defaultAirportText = 'Enter city or airport';
	$('#air_controls :input.flight-airport')
	  .data('defaultValue', defaultAirportText)
	  .val(defaultAirportText);

	$('#trip_type_roundtrip')
	  .data('defaultChecked', true)
	  .attr('checked', true);

	// Suppress display of email newsletter signup if the user has already
	// signed up in the past

	if(Cookie.get('nwsltr_signup') > 0) {
		$('#flight_email').val('').parents('.data-pair').eq(0).css('display', 'none');
	}
},

initDOMEvents: function() {

	// Show/hide simple or complex controls based on mode question

	$('#flight_use_simple_no').click(function(){
		if(this.checked) {
			TPCalc.User.setSimpleFlightMode(false);
			TPCalc.Air.State.simpleMode(false);
			TPCalc.Air.UI.resetFlightControls();
			TPCalc.Air.UI.enableFlightControls();
			TPCalc.Air.UI.updateFootprintSubtotal();

			var flight = TPCalc.Air.State.getActiveFlight();
			TPCalc.Air.UI.loadFlightControls(flight);
			TPCalc.Air.UI.hideSimpleFlightSummary();
		}
	});
	$('#flight_use_simple_yes').click(function(){
		if(this.checked) {
			TPCalc.User.setSimpleFlightMode(true);
			TPCalc.Air.State.simpleMode(true);
			TPCalc.Air.UI.resetFlightControls();
			TPCalc.Air.UI.enableFlightControls();
			TPCalc.Air.UI.updateFootprintSubtotal();

			TPCalc.Air.UI.loadFlightControls();
			TPCalc.Air.UI.showSimpleFlightSummary();
		}
	});

	// Set up inputs for auto-completion

	var setCompletedAirport = function(input, displayName) {

		var exc;

		// Put keyboard focus on the next form input

		var inputId = $(input).attr('id');
		if(inputId == 'flight_dept_airport') {
			$('#flight_dest_airport').get(0).focus();
		} else if(inputId == 'flight_dest_airport'){

			// Wrap in try-catch block to avoid IE error
			// with trying to put focus on hidden elements
			try {
				TPCalc.Air.UI.enableFlightIsDirect();
				$('#flight_is_direct_yes').get(0).focus();
			} catch(exc) {
			}
		} else {
			input.blur();
		}
	};

	var acDept = new AutoComplete($('#flight_dept_airport'), TPCalc.Air.Data.fetchKeywords, setCompletedAirport);
	var acDest = new AutoComplete($('#flight_dest_airport'), TPCalc.Air.Data.fetchKeywords, setCompletedAirport);

	// Save AutoComplete objects in the input elements themselves

	$('#flight_dept_airport').data('autoCompleter', acDept);
	$('#flight_dest_airport').data('autoCompleter', acDest);

	// Handle the logic for the default text that appears in the
	// airport text inputs

	$('#air_controls :input.flight-airport').focus(function(){

		// Save default text value into defaultValue attribute
		// for later comparisons

		var $input = $(this);
		if($input.val() == $input.data('defaultValue')) {
			$input.val('');
		}

		// Cursor select all text in the textbox

		if($input.val() != '') {
			this.select();
		}

		// Update the UI

		$input.removeClass('default');
	});
	$('#air_controls :input.flight-airport').blur(function(){
		var $input = $(this);

		// If the value has not changed, then do nothing

		if($input.val() == $input.data('prevValue')) {
			return;
		}

		// Replace the empty value with the default value

		if($input.val() == '') {
			$input.val($input.data('defaultValue'));
		}

		// Validate the value

		if($input.val() == $input.data('defaultValue')) {
			$input.addClass('default');
		} else if(!$input.data('acMouseClicked') && !TPCalc.Air.Data.getAirportData($input.val())) {
			TPCalc.showError("We couldn't find that airport. Enter a three-letter airport code or the name of the city.", function() {
				$input.get(0).focus();
			});
			return;
		} else if($.browser.msie && $input.data('acMouseClicked')) {	// IE hack for different event trigger order on blur/mouse events
			return;
		}

		// Remember the current value for next time

		$input.data('prevValue', $input.val());

		// If both the dept and dest airports have been specified
		// and both identify recognized airports from the system,
		// then enable the next downstream calculator section

		var $fromInput = $('#flight_dept_airport');
		var $toInput = $('#flight_dest_airport');

		var fromDisplayName = $fromInput.val();
		var toDisplayName = $toInput.val();

		var fromDefaultDisplayName = $fromInput.data('defaultValue');
		var toDefaultDisplayName = $toInput.data('defaultValue');

		var areValidValues = fromDisplayName != '' && toDisplayName != ''
		 && fromDisplayName != fromDefaultDisplayName
		 && toDisplayName != toDefaultDisplayName;

		var fromData, toData;

		// Show the Ajax loading indicator
		//try{ console.log(areValidValues,$('#air_controls fieldset'),$('#flight_specifics')) }catch(e){}
		if(areValidValues) {
			$('#air_controls fieldset').removeClass('off');
			$('#flight_specifics').addClass('loading');
		}

		// Wrap in setTimeout() because actually doing this
		// synchronously and need to relinquish control
		// before UI will be updated

		setTimeout(function(){

			if(areValidValues
			&& (fromData = TPCalc.Air.Data.getAirportData(fromDisplayName))
			&& (toData = TPCalc.Air.Data.getAirportData(toDisplayName))) {

				TPCalc.Air.UI.enableFlightIsDirect();
				TPCalc.Air.UI.resetFlightAirline();
				TPCalc.Air.UI.enableFlightAirline();
				TPCalc.Air.UI.resetFlightClass();
				TPCalc.Air.UI.enableFlightClass();
			} else {
				TPCalc.Air.UI.resetFlightIsDirect();
			}
			TPCalc.Air.UI.autoEnableFlightCalculate();

			TPCalc.Air.State.updateActiveFlight();
			TPCalc.Air.UI.updateFlightSummary();
			TPCalc.Air.UI.updateFootprintSubtotal();

			$('#flight_specifics').removeClass('loading');
		}, 0);

	});

	// Flight round-trip/one-way SELECT menu

	$('#flight_num_ways').change(function(){
		TPCalc.Air.State.updateActiveFlight();
		TPCalc.Air.UI.updateFlightSummary();
		TPCalc.Air.UI.updateFootprintSubtotal();
	});

	// Flight no. of times SELECT menu

	$('#flight_num_times').change(function(){
		TPCalc.Air.State.updateActiveFlight();
		TPCalc.Air.UI.updateFlightSummary();
		TPCalc.Air.UI.updateFootprintSubtotal();
	});

	// No. of stopover radio buttons

	$('#flight_is_direct_yes').click(function(){
		if(this.checked) {
			TPCalc.Air.UI.resetFlightNumStops();
			TPCalc.Air.State.updateActiveFlight();
			TPCalc.Air.UI.updateFlightSummary();
			TPCalc.Air.UI.updateFootprintSubtotal();
		}
	});

	$('#flight_is_direct_no').click(function(){
		if(this.checked) {
			TPCalc.Air.UI.enableFlightNumStops();
			TPCalc.Air.State.updateActiveFlight();
			TPCalc.Air.UI.updateFlightSummary();
			TPCalc.Air.UI.updateFootprintSubtotal();
		}
	});

	// Flight no. of stops SELECT menu

	$('#flight_num_stops').change(function(){
		TPCalc.Air.State.updateActiveFlight();
		TPCalc.Air.UI.updateFlightSummary();
		TPCalc.Air.UI.updateFootprintSubtotal();
	});

	// Flight airlines SELECT menu

	$('#flight_airline').change(function(){
		TPCalc.Air.UI.resetFlightClass();
		TPCalc.Air.UI.enableFlightClass();

		TPCalc.Air.State.updateActiveFlight();
		TPCalc.Air.UI.updateFlightSummary();
		TPCalc.Air.UI.updateFootprintSubtotal();
	});

	// Flight class SELECT menu

	$('#flight_class').change(function(){
		TPCalc.Air.State.updateActiveFlight();
		TPCalc.Air.UI.updateFlightSummary();
		TPCalc.Air.UI.updateFootprintSubtotal();
	});

	// "Add Flight" button

	$('#add_flight').click(function(){
		var exc;
		try {
			if($(this).attr('disabled') || $(this).hasClass('disabled')) {
				return false;
			}
			TPCalc.Air.State.activeFlightIdx(0);
			TPCalc.Air.State.addFlight();
			TPCalc.Air.UI.resetFlightControls();
			TPCalc.Air.UI.enableFlightControls();
			TPCalc.Air.UI.addFlightSummary();
		} catch(exc) {
			TPCalc.handleException(exc);
		}
		return false;
	});

	// Delete button

	$('#air_summary .flight-controls .delete').click(function(){
		if(TPCalc.Air.State.simpleMode()) {
			$('#flight_num_short').val('0');
			$('#flight_num_medium').val('0');
			$('#flight_num_long').val('0');
			TPCalc.Air.Data.saveUserSimpleFlightCounts('0', '0', '0');
			TPCalc.Air.UI.updateFlightSummary();
			TPCalc.Air.UI.updateFootprintSubtotal();
			TPCalc.Air.UI.resetFlightDetail();
		} else {
			var li = $(this).parents('li').get(0);
			var flightIdx = $('#air_summary ul li').index(li);
			var flight = TPCalc.Air.State.getFlight(flightIdx);

			// Only delete if the flight has already been saved

			if(flight.isSaved) {
				if(!TPCalc.Air.Data.deleteUserFlight(flightIdx)) {
					TPCalc.showError("There was problem with deleting your flight.");
					return false;
				}
			}

			TPCalc.Air.State.deleteFlight(flightIdx);	// Then remove from application state
			if(TPCalc.Air.State.getFlightCount() < 1) {
				TPCalc.Air.State.addFlight();			// Always keep at least one empty vehicle in application state
			}
			TPCalc.Air.UI.removeFlightSummary(flight, flightIdx);
			TPCalc.Air.UI.updateFootprintSubtotal();
		}

		return true;
	});

	// Edit Button

	$('#air_summary .edit').click(function(){
		var liContainer = $(this).parents('li').get(0);
		var idx = $('#air_summary ul li').index(liContainer);
		TPCalc.Air.UI.focusFlightSummary(idx);
	});

	// Monitor changes in standard road controls

	$('#air_controls select').change(function() {
		TPCalc.Air.UI.autoEnableFlightCalculate();
	});
	$('#air_controls input[type=text]').blur(function() {
		TPCalc.Air.UI.autoEnableFlightCalculate();
	});
	$('#air_controls input[type=radio]').click(function() {
		TPCalc.Air.UI.autoEnableFlightCalculate();
	});

	// Calculate button

	$('#flight_calculate').click(function(){
		if(!TPCalc.Air.UI.validateFlightInputs(true)) {
			return false;
		}
		TPCalc.Air.State.updateActiveFlight();
		TPCalc.Air.Data.saveUserFlight();
		TPCalc.Air.UI.updateFlightSummary();
		TPCalc.Air.UI.updateFootprintSubtotal();
		TPCalc.Air.UI.enableFlightAdd();
		if(TPCalc.submitEmailSignup($('#flight_email').val(), 'flightcalc')) {
			$('#flight_email').parents('.data-pair').eq(0).slideUp('slow');
		}

		return false;
	});

	// Simple air calculator controls

	$('#simple_flight_calculate').click(function() {
		var numShort = $('#flight_num_short').val();
		var numMedium = $('#flight_num_medium').val();
		var numLong = $('#flight_num_long').val();
		TPCalc.Air.Data.saveUserSimpleFlightCounts(numShort, numMedium, numLong);
		TPCalc.Air.UI.updateFlightSummary(numShort, numMedium, numLong);
		TPCalc.Air.UI.updateFootprintSubtotal();
		return false;
	});
},

initDOMClones: function() {

	// Save canonical DOM nodes used in cloning

	$('#air_summary ul').each(function(i, list){
		$(list).data('defaultItem', $('li:first-child', list).clone(true).removeClass('only-child'));
	});
},

loadUserData: function() {

	// Migrate old data formats to current data format

	TPCalc.User.migrateAirData();

	// Load saved user data for complex flights
	// into application state and UI

	var usrFlights = TPCalc.User.getFlights();
	var flight;

	if(usrFlights && usrFlights.length > 0) {

		$('#air_summary ul li:only-child.active').remove();

		for(var i=usrFlights.length-1; i >= 0; i--) {
			flight = new TPCalc.Air.Flight();
			flight.fromJSONObject(usrFlights[i]);

			TPCalc.Air.State.addFlight(flight);
			TPCalc.Air.UI.addFlightSummary(flight);
		}

		TPCalc.Air.UI.loadFlightControls(flight);	// Load the last one into the controls
	}

	if(TPCalc.Air.State.getFlightCount() < 1) {
		TPCalc.Air.State.addFlight();
	}

	// Load any form submitted complex flight data
	// into the application state and UI

	TPCalc.Air.UI.loadSubmittedFlight();

	// Determine last operating mode prior to page load

	var wasPrevSimpleMode = TPCalc.User.getSimpleFlightMode();
	TPCalc.Air.State.simpleMode(wasPrevSimpleMode);
	if(wasPrevSimpleMode) {
		TPCalc.Air.UI.resetFlightControls();
	}
	TPCalc.Air.UI.enableFlightControls();

	// Update the UI depending on the last operating mode
	// of the calculator prior to the current page load

	if(!wasPrevSimpleMode) {
		$('#flight_use_simple_no').attr('checked', true);
	} else {
		$('#flight_use_simple_yes').attr('checked', true);
		TPCalc.Air.UI.loadFlightControls();
		TPCalc.Air.UI.showSimpleFlightSummary();
	}

	// Update footprint subtotal

	TPCalc.Air.UI.updateFootprintSubtotal(true);
},

UI: {

	loadFlightControls: function(flight) {
		if(TPCalc.Air.State.simpleMode()) {
			TPCalc.Air.UI._loadSimpleFlightControls();
		} else {
			TPCalc.Air.UI._loadComplexFlightControls(flight);
		}
	},

	_loadComplexFlightControls: function(flight) {
		$('#flight_num_ways').val(flight.numWays || '2');
		$('#flight_num_times').val(flight.numTimes || '1');

		if(flight.deptAirport) {
			$('#flight_dept_airport')
			  .val(flight.deptAirport.displayName)
			  .data('prevValue', flight.deptAirport.displayName)
			  .removeClass('default');
		}
		if(flight.destAirport) {
			$('#flight_dest_airport')
			  .val(flight.destAirport.displayName)
			  .data('prevValue', flight.destAirport.displayName)
			  .removeClass('default');
		}
		if(flight.deptAirport && flight.destAirport) {
			TPCalc.Air.UI.enableFlightIsDirect();
		}

		if(flight.numStops > 0) {
			$('#flight_is_direct_no').attr('checked', true);
			TPCalc.Air.UI.enableFlightNumStops();
			$('#flight_num_stops').val(flight.numStops);
		} else {
			$('#flight_is_direct_yes').attr('checked', true);
			TPCalc.Air.UI.resetFlightNumStops();
		}

		TPCalc.Air.UI.resetFlightAirline();
		TPCalc.Air.UI.enableFlightAirline();
		TPCalc.Air.UI.resetFlightClass();
		TPCalc.Air.UI.enableFlightClass();

		$('#flight_airline').val(flight.airlineCode);
		$('#flight_class').val(flight.seatClass);

		TPCalc.Air.UI.autoEnableFlightCalculate();
		TPCalc.Air.UI.enableFlightAdd();
		TPCalc.Air.UI.enableFlightDetail();
	},

	_loadComplexFlightControlsIE6: function(flight) {
		$('#flight_num_ways').val(flight.numWays || '2');
		$('#flight_num_times').val(flight.numTimes || '1');

		if(flight.deptAirport) {
			$('#flight_dept_airport')
			  .val(flight.deptAirport.displayName)
			  .data('prevValue', flight.deptAirport.displayName)
			  .removeClass('default');
		}
		if(flight.destAirport) {
			$('#flight_dest_airport')
			  .val(flight.destAirport.displayName)
			  .data('prevValue', flight.destAirport.displayName)
			  .removeClass('default');
		}
		if(flight.deptAirport && flight.destAirport) {
			TPCalc.Air.UI.enableFlightIsDirect();
		}

		if(flight.numStops > 0) {
			$('#flight_is_direct_no').attr('checked', true);
			TPCalc.Air.UI.enableFlightNumStops();
			$('#flight_num_stops').val(flight.numStops);
		} else {
			$('#flight_is_direct_yes').attr('checked', true);
			TPCalc.Air.UI.resetFlightNumStops();
		}

		TPCalc.Air.UI.resetFlightAirline();
		TPCalc.Air.UI.enableFlightAirline();
		TPCalc.Air.UI.resetFlightClass();
		TPCalc.Air.UI.enableFlightClass();

		// Workaround for IE6: See comments for TPCalc.Road._loadComplexVehicleControls() for more.

		setTimeout(function(){
			$('#flight_airline').val(flight.airlineCode);
			setTimeout(function(){
				$('#flight_class').val(flight.seatClass);
			}, 0);
		}, 0);

		TPCalc.Air.UI.autoEnableFlightCalculate();
		TPCalc.Air.UI.enableFlightAdd();
		TPCalc.Air.UI.enableFlightDetail();
	},

	_loadSimpleFlightControls: function() {
		var counts = TPCalc.Air.Data.getUserSimpleFlightCounts();

		$('#flight_num_short').val(counts.numShort);
		$('#flight_num_medium').val(counts.numMedium);
		$('#flight_num_long').val(counts.numLong);

		if(counts.numShort > 0 || counts.numMedium > 0 || counts.numLong > 0) {
			TPCalc.Air.UI.enableFlightDetail();
		}
	},

	loadSubmittedFlight: function() {
		var params = TPCalc.parseQueryString();
		if(!params) {
			return;
		}
		if(params['from']) {
			$('#flight_dept_airport').val(params['from']).removeClass('default');
			TPCalc.Air.Data.fetchAirportsByKey(params['from']);
		}
		if(params['to']) {
			$('#flight_dest_airport').val(params['to']).removeClass('default');
			TPCalc.Air.Data.fetchAirportsByKey(params['to']);
		}
	},

	addFlightSummary: function(flight) {

		// Find original default list item node clone, revise text, and add to DOM

		var $list = $('#air_summary ul');
		var $li = $list.data('defaultItem').clone(true);
		var $header = $('.flight-id', $li);
		var hdrStr = $header.html();

		$header.html(hdrStr.replace(/\d+\s*$/, $('li', $list).length+1));

		// Make note of list height when there are exactly two list items

		if($('li', $list).length == 2) {
			var listHeight = $list.height();
		}

		$('li.active', $list).removeClass('active');
		$li.addClass('active');
		$list.prepend($li);

		if(flight) {
			TPCalc.Air.UI.updateFlightSummary(flight, 0);
		}

		// The max height of the vehicle summary list
		// should be whatever the height when there are
		// exactly two vehicle summaries

		if($('li', $list).length > TPCalc.SCROLL_THRESHOLD) {
			if(!$list.hasClass('scrolling')) {
				$list.height(listHeight).addClass('scrolling');
			}
		}

	},

	showSimpleFlightSummary: function() {
		TPCalc.Air.UI.addFlightSummary();
		$('#air_summary ul li').eq(0).attr('id', 'simple_flight_summary');
		TPCalc.Air.UI.updateFlightSummary(
		  $('#flight_num_short').val(), $('#flight_num_medium').val(), $('#flight_num_long').val()
		);

		$('#air_summary ul li:not(#simple_flight_summary)').addClass('hidden');
	},

	hideSimpleFlightSummary: function() {
		$('#simple_flight_summary').remove();
		$('#air_summary ul li').removeClass('hidden');
		TPCalc.Air.UI.focusFlightSummary(0);
	},

	updateFlightSummary: function() {
		if(TPCalc.Air.State.simpleMode()) {
			var numShort = arguments[0];
			var numMedium = arguments[1];
			var numLong = arguments[2];
			TPCalc.Air.UI._updateSimpleFlightSummary(numShort, numMedium, numLong);
		} else {
			var flight = arguments[0];
			var flightIdx = arguments[1];
			TPCalc.Air.UI._updateComplexFlightSummary(flight, flightIdx);
		}
	},

	_updateSimpleFlightSummary: function(numShort, numMedium, numLong) {

		var $li = $('#simple_flight_summary');
		var carbonTotal = TPCalc.Air.State.calcFootprint(true);
		var hdr = 'Annual flight profile';
		var descr = '';

		if(numShort > 0) {
			descr += numShort + ' round-trip short flights<br>';
		}
		if(numMedium > 0) {
			descr += numMedium + ' round-trip medium flights<br>';
		}
		if(numLong > 0) {
			descr += numLong + ' round-trip long flights<br>';
		}
		/*
		if(descr != '') {
			descr += '<br>Approximately ' + 0 + 'miles';	// How do we approximate miles?
		}
		*/

		$('.flight-id', $li).html(hdr);
		$('.flight-num-times', $li).html(descr)
		 .parent('p.flight-description').removeClass('hidden');
		$('.flight-bottom-line', $li).removeClass('hidden');
		$('.flight-carbon-total', $li).html(carbonTotal.toFormattedString());

		if(numShort > 0 || numMedium > 0 || numLong > 0) {
			TPCalc.Air.UI.enableFlightDetail();

			// Bind click event handler to details link

			var url = TPCalc.Air.DETAILS_PAGE_URL + '?simple=1';
			$('.detail', $li).unbind('click').click(function() {
				var exc;
				try {
					TPCalc.openDetailsWindow(url);
				} catch(exc) {
					// ignore //
				}
				return false;
			});
		} else {
			TPCalc.Air.UI.resetFlightDetail();
		}
	},

	_updateComplexFlightSummary: function(flight, flightIdx) {

		if(flightIdx === undefined) {
			flightIdx = TPCalc.Air.State.activeFlightIdx();
		}
		if(!flight) {
			flight = TPCalc.Air.State.getActiveFlight();
		}

		var $liSet = $('#air_summary ul li');
		var $li = $liSet.eq(flightIdx);
		var defaultHdrStr = $('#air_summary ul').data('defaultItem').find('.flight-id').html();

		var deptCity = flight.deptAirport ? flight.deptAirport.cityName : '';
		var destCity = flight.destAirport ? flight.destAirport.cityName : '';
		var numWays = flight.numWays;
		var numTimes = flight.numTimes;
		var numStops = flight.numStops;
		var airlineCode = flight.airlineCode;
		var seatClass = flight.seatClass;
		var milesTraveledPerTrip = Math.round(flight.getMilesTraveledPerTrip());
		var carbonTotal = Math.round(flight.calcCo2Lbs()) || 0;

		var descr = deptCity && destCity
		  ? deptCity + ' &harr; ' + destCity
		  : defaultHdrStr.replace(/\d+\s*$/, $liSet.length - flightIdx);
		var numWaysDescr = numWays !== null ? (numWays <= 1 ? 'One way' : 'Round trip') : '';
		var numTimesDescr = '';
		var numStopsDescr = '';
		var airlineDescr = flight.getAirlineName() || '';
		var classDescr = seatClass ? seatClass + ' Class' : '';

		if(numTimes > 1) {
			numTimesDescr = numTimes + ' passengers';
		}
		if(numStops > 0) {
			numStopsDescr = 'Flight makes ';
			if(numStops > 1) {
				numStopsDescr += numStops + ' stops';
			} else {
				numStopsDescr += '1 stop';
			}
		} else if(numStops === 0) {
			numStopsDescr = 'Direct flight';
		}
		if(airlineCode && seatClass) {
			airlineDescr += ', ';
		}

		$('.flight-id', $li).html(descr);
		$('.flight-num-ways', $li).html(numWaysDescr);
		$('.flight-miles', $li).html(milesTraveledPerTrip.toFormattedString());
		$('.flight-num-times', $li).html(numTimesDescr);
		$('.flight-num-stops', $li).html(numStopsDescr);
		$('.flight-airline', $li).html(airlineDescr);
		$('.flight-class', $li).html(classDescr);

		if(deptCity && destCity) {
			$('.flight-description', $li).removeClass('hidden');

			// Bind click event handler to details link

			var url = TPCalc.Air.DETAILS_PAGE_URL + '?id=' + flight.id;
			$('.detail', $li).unbind('click').click(function() {
				var exc;
				try {
					TPCalc.openDetailsWindow(url);
				} catch(exc) {
					// ignore //
				}
				return false;
			});
		} else {
			$('.flight-description', $li).addClass('hidden');
		}

		if(!flight.isDirty) {
			$('.flight-detail', $li).removeClass('hidden');
			$('.flight-bottom-line', $li).removeClass('hidden');
			$('.flight-carbon-total', $li).html(carbonTotal.toFormattedString());
		} else {
			$('.flight-detail', $li).addClass('hidden');
			$('.flight-bottom-line', $li).addClass('hidden');
			$('.flight-carbon-total', $li).html('0');
		}
	},

	removeFlightSummary: function(flight, flightIdx) {

		var $list = $('#air_summary ul li');

		// Different behavior if the list has only one summary item

		if($list.length > 1) {

			// Remove summary item from UI

			$list.eq(flightIdx).remove();
			$('#air_summary ul li:only-child').addClass('only-child');

			// If del item is before active item revise indices. If del item = active item, "focus"
			// shifted to next item, whose new index = deleted item's old index

			var activeIdx = TPCalc.Air.State.activeFlightIdx();

			if(flightIdx < activeIdx) {
				TPCalc.Air.State.activeFlightIdx(activeIdx-1);
			} else if(activeIdx == flightIdx) {
				TPCalc.Air.UI.focusFlightSummary(flightIdx);
			}
			TPCalc.Air.UI.enableFlightAdd();
			TPCalc.Air.UI.enableFlightDetail();
		} else {
			flight.isSaved = false;
			flight.isDirty = true;
			TPCalc.Air.UI.resetFlightControls();
			TPCalc.Air.UI.enableFlightControls();
			TPCalc.Air.UI.updateFlightSummary();
		}

		if($('#air_summary ul li').length <= TPCalc.SCROLL_THRESHOLD) {
			$('#air_summary ul').height('').removeClass('scrolling');
		}
	},

	focusFlightSummary: function(flightIdx) {
		TPCalc.Air.State.activeFlightIdx(flightIdx);
		var flight = TPCalc.Air.State.getFlight(flightIdx);
		if(!flight) {
			return;
		}

		$('#flight_specifics').addClass('loading');

		setTimeout(function(){

			TPCalc.Air.UI.resetFlightControls();
			TPCalc.Air.UI.enableFlightControls();
			TPCalc.Air.UI.loadFlightControls(flight);

			$('#air_summary ul li').eq(flightIdx)
			  .siblings('.active').removeClass('active').end()
			  .addClass('active');

			$('#flight_specifics').removeClass('loading');
		}, 0);
	},

	autoEnableFlightCalculate: function() {
		if(TPCalc.Air.UI.validateFlightInputs()) {
			$("#flight_calculate").removeAttr('disabled').removeClass('disabled');
		} else {
			$("#flight_calculate").attr('disabled', 'disabled').addClass('disabled');
		}
	},

	validateFlightInputs: function() {
		var numWays = parseInt($('#flight_num_ways:enabled').val()) || 0;
		var numTimes = parseInt($('#flight_num_times:enabled').val()) || 0
		var from = $('#flight_dept_airport:enabled').val();
		var to = $('#flight_dest_airport:enabled').val();
		var fromDefault = $('#flight_dept_airport').data('defaultValue');
		var toDefault = $('#flight_dest_airport').data('defaultValue');

		return numWays > 0 && numTimes > 0 && from != '' && to != '' && from != fromDefault && to != toDefault;
	},

	updateFootprintSubtotal: function() {
		var total = Math.round(TPCalc.Air.State.calcFootprint(true));
		$('#air_carbon_footprint').html(total.toFormattedString());
		TPCalc.updateFootprintTotal();
		TPCalc.setCalculatorProgress(TPCalc.TYPE_AIR, total > 0);
	},

	resetFlightControls: function() {
		if(TPCalc.Air.State.simpleMode()) {
			TPCalc.Air.UI._resetSimpleFlightControls();
		} else {
			TPCalc.Air.UI._resetComplexFlightControls();
		}
	},

	_resetSimpleFlightControls: function() {
		$('#simple_air_controls select').each(function(){
			$(this).val('0').attr('disabled', 'disabled');
		});
		TPCalc.Air.UI.resetFlightAdd();
		TPCalc.Air.UI.resetFlightDetail();
	},

	_resetComplexFlightControls: function() {
		$('#complex_air_controls .flight-basic-control :input').attr('disabled', 'disabled');
		$('#complex_air_controls :input.flight-airport').each(function(){
			this.value = this.defaultValue;
			$(this).addClass('default');
			$(this).removeData('prevValue');
		});
		$('#flight_num_ways').val('2');
		$('#flight_num_times').val('1');
		$('input[type=radio][name=flight_is_direct]').attr('checked', false);
		$('#flight_num_stops').val('1');
		$('#flight_class,#flight_airline').val('');

		TPCalc.Air.UI.resetFlightIsDirect();
		TPCalc.Air.UI.autoEnableFlightCalculate();
	},

	enableFlightControls: function() {
		if(TPCalc.Air.State.simpleMode()) {
			TPCalc.Air.UI._enableSimpleFlightControls();
		} else {
			TPCalc.Air.UI._enableComplexFlightControls();
		}
	},

	_enableSimpleFlightControls: function() {
		$('#complex_air_controls').addClass('collapsed')
		  .find(':input').attr('disabled', 'disabled');
		$('#simple_air_controls').removeClass('collapsed')
		  .find(':input').removeAttr('disabled');
	},

	_enableComplexFlightControls: function() {
		$('#complex_air_controls').removeClass('collapsed')
		  .find('.flight-basic-control :input').removeAttr('disabled');
		$('#simple_air_controls').addClass('collapsed')
		  .find(':input').attr('disabled', 'disabled');
	},

	resetFlightIsDirect: function() {
		$('#flight_is_direct_field').addClass('collapsed')
		 .find('input[type=radio][name=flight_is_direct]').attr('disabled', 'disabled');

		$('#air_controls fieldset').addClass('off');

		TPCalc.Air.UI.resetFlightNumStops();
		TPCalc.Air.UI.resetFlightClass();
		TPCalc.Air.UI.resetFlightAirline();
		TPCalc.Air.UI.resetFlightAdd();
		TPCalc.Air.UI.resetFlightDetail();
	},

	enableFlightIsDirect: function() {
		$('#flight_is_direct_field').removeClass('collapsed')
		 .find('input[type=radio][name=flight_is_direct]').removeAttr('disabled');

		var co2Data, fromData, toData;

		if($('#flight_dept_airport').val() != $('#flight_dept_airport').data('defaultValue')) {
			fromData = TPCalc.Air.Data.getAirportData($('#flight_dept_airport').val());
		}
		if($('#flight_dest_airport').val() != $('#flight_dest_airport').data('defaultValue')) {
			toData = TPCalc.Air.Data.getAirportData($('#flight_dest_airport').val());
		}
		if(fromData && toData) {
			co2Data = TPCalc.Air.Data.getFlightCo2Data(fromData.code, toData.code);
		}

		$('#air_controls fieldset').removeClass('off');

		// If system data exists, then check direct flight as default;
		// otherwise, check indirect as default.

		if(co2Data) {
			$('#flight_is_direct_yes').attr('checked', true);
			TPCalc.Air.UI.resetFlightNumStops();
			TPCalc.Air.UI.updateFlightSummary();
			TPCalc.Air.UI.updateFootprintSubtotal();
		} else {
			$('#flight_is_direct_no').attr('checked', true);
			TPCalc.Air.UI.enableFlightNumStops();
			TPCalc.Air.UI.updateFlightSummary();
			TPCalc.Air.UI.updateFootprintSubtotal();
		}
	},

	resetFlightNumStops: function() {
		$('#flight_num_stops_field').addClass('hidden')
		 .find('select').attr('disabled', 'disabled').val('1');

		TPCalc.Air.UI.resetFlightClass();
		TPCalc.Air.UI.enableFlightClass();
		TPCalc.Air.UI.resetFlightAirline();
		TPCalc.Air.UI.enableFlightAirline();
	},

	enableFlightNumStops: function() {
		$('#flight_num_stops_field').removeClass('hidden')
		 .find('select').removeAttr('disabled');

		TPCalc.Air.UI.resetFlightClass();
		TPCalc.Air.UI.resetFlightAirline();
	},

	resetFlightClass: function() {
		$('#flight_class_field').addClass('collapsed');
		$('#flight_class').attr('disabled', 'disabled').val('')
		  .find('option:gt(0)').remove();
	},

	enableFlightClass: function() {
		var fromData, toData;
		if($('#flight_dept_airport').val() != $('#flight_dept_airport').data('defaultValue')) {
			fromData = TPCalc.Air.Data.getAirportData($('#flight_dept_airport').val());
		}
		if($('#flight_dest_airport').val() != $('#flight_dest_airport').data('defaultValue')) {
			toData = TPCalc.Air.Data.getAirportData($('#flight_dest_airport').val());
		}
		if(!fromData || !toData) {
			return;
		}

		var airlineCode = $('#flight_airline').val();
		var classes = TPCalc.Air.UI._sortClasses( TPCalc.Air.Data.getFlightClasses(fromData.code, toData.code, airlineCode) );

		// Populate the SELECT menu with the airline-specific flight seat classes
		// and pre-select the lowest (aka first in order) seat class

		if(classes) {
			if($('#flight_is_direct_yes').attr('checked')) {
				$('#flight_class_field').removeClass('collapsed');
				$('#flight_class').removeAttr('disabled');
			} else {
				$('#flight_class_field').addClass('collapsed');
				$('#flight_class').attr('disabled', 'disabled');
			}
			var $select = $('#flight_class');
			var isFirst = true;
			for(var key in classes) {
				if(isFirst) {
					$select.append('<option value="' + key + '" selected>' + classes[key] + '</option>' );
					isFirst = false;
				} else {
					$select.append('<option value="' + key + '">' + classes[key] + '</option>' );
				}
			}
		}
	},

	_sortClasses: function(classes) {
		var sortIndices = {};
		for(var i=0, maxClasses=TPCalc.Air.SEAT_CLASSES.length; i < maxClasses; i++) {
			sortIndices[TPCalc.Air.SEAT_CLASSES[i]] = i;
		}

		var cmpFunc = function(key1, val1, key2, val2) {
			var lposSortIdx = sortIndices[key1];
			var rposSortIdx = sortIndices[key2];
			return lposSortIdx - rposSortIdx;
		};

		return TPCalc.sortObject(classes, cmpFunc);
	},

	_sortAirlines: function(airlines) {
		return TPCalc.sortObject(airlines);
	},

	resetFlightAirline: function() {
		$('#flight_airline_field').addClass('collapsed');
		$('#flight_airline').attr('disabled', 'disabled').val('')
		  .find('option:gt(0)').remove();
	},

	enableFlightAirline: function() {
		var fromData, toData;
		if($('#flight_dept_airport').val() != $('#flight_dept_airport').data('defaultValue')) {
			fromData = TPCalc.Air.Data.getAirportData($('#flight_dept_airport').val());
		}
		if($('#flight_dest_airport').val() != $('#flight_dest_airport').data('defaultValue')) {
			toData = TPCalc.Air.Data.getAirportData($('#flight_dest_airport').val());
		}
		if(!fromData || !toData) {
			return;
		}

		var airlines = TPCalc.Air.UI._sortAirlines( TPCalc.Air.Data.getFlightAirlines(fromData.code, toData.code) );
		if(airlines) {
			if($('#flight_is_direct_yes').attr('checked')) {
				$('#flight_airline_field').removeClass('collapsed');
				$('#flight_airline').removeAttr('disabled');
			} else {
				$('#flight_airline_field').addClass('collapsed');
				$('#flight_airline').attr('disabled', 'disabled');
			}
			var $select = $('#flight_airline');
			for(var key in airlines) {
				$select.append('<option value="' + key + '">' + airlines[key] + '</option>' );
			}
		}
	},

	enableFlightAdd: function() {
		var isSimpleMode = TPCalc.Air.State.simpleMode();
		if(!isSimpleMode && TPCalc.Air.State.areAllFlightsSaved()) {
			$('#add_flight').removeClass('disabled').removeAttr('disabled');
		}
	},

	resetFlightAdd: function() {
		$('#add_flight').addClass('disabled').attr('disabled', 'disabled');
	},

	enableFlightDetail: function() {
		var isSimpleMode = TPCalc.Air.State.simpleMode();
		if(isSimpleMode) {
			$('#air_summary .flight-detail').removeClass('hidden');
		}
	},

	resetFlightDetail: function() {
		$('#air_summary .flight-detail').addClass('hidden');
	}
},

State: {
	// State variables //

	_subtotalFootprint: -1,
	_useSimpleMode: false,
	_flights: [],
	_activeFlightIdx: 0,

	simpleMode: function(flag) {
		if(flag !== undefined) {
			TPCalc.Air.State._useSimpleMode = Boolean(flag);
			TPCalc.Air.State._subtotalFootprint = -1;
		}
		return TPCalc.Air.State._useSimpleMode;
	},

	activeFlightIdx: function(newIdx) {
		if(newIdx !== undefined) {
			TPCalc.Air.State._activeFlightIdx = newIdx;
		}
		return TPCalc.Air.State._activeFlightIdx;
	},

	calcFootprint: function(forceRecalc) {
		if(forceRecalc || TPCalc.Air.State._subtotalFootprint < 0) {
			var subtotal = 0;
			if(TPCalc.Air.State.simpleMode()) {
				var counts = TPCalc.Air.Data.getUserSimpleFlightCounts();
				var factors = TPCalc.Air.SIMPLE_FLIGHT_FACTORS;
				subtotal += counts.numShort * factors.co2LbsPerShortFlight;
				subtotal += counts.numMedium * factors.co2LbsPerMediumFlight;
				subtotal += counts.numLong * factors.co2LbsPerLongFlight;
			} else {
				var flights = TPCalc.Air.State._flights;
				if(flights) {
					var numFlights = flights.length;
					for(var i=0; i < numFlights; i++) {
						subtotal += flights[i].calcCo2Lbs();
					}
				}
			}
			TPCalc.Air.State._subtotalFootprint = subtotal;
		}
		return TPCalc.Air.State._subtotalFootprint;
	},

	addFlight: function(flight) {
		if(!flight) {
			flight = new TPCalc.Air.Flight();
		}
		TPCalc.Air.State._flights.unshift(flight);
	},

	deleteFlight: function(idx) {
		TPCalc.Air.State._flights.splice(idx, 1);
	},

	getFlight: function(idx) {
		return TPCalc.Air.State._flights[idx];
	},

	getFlightIdxById: function(id) {
		for(var i=0, max=TPCalc.Air.State._flights.length; i<max; i++) {
			if(TPCalc.Air.State._flights[i].id == id) {
				return i;
			}
		}
		return false;
	},

	getFlightCount: function() {
		return TPCalc.Air.State._flights.length;
	},

	getActiveFlight: function() {
		var idx = TPCalc.Air.State.activeFlightIdx();
		return TPCalc.Air.State._flights.length > 0 ? TPCalc.Air.State._flights[idx] : null;
	},

	updateActiveFlight: function() {
		var activeFlight = TPCalc.Air.State.getActiveFlight();
		if(!activeFlight) {
			return;
		}

		var fromDisplayName = $('#flight_dept_airport').val();
		var toDisplayName = $('#flight_dest_airport').val();

		var fromDefaultDisplayName = $('#flight_dept_airport').data('defaultValue');
		var toDefaultDisplayName = $('#flight_dest_airport').data('defaultValue');

		if(fromDisplayName != '' && fromDisplayName != fromDefaultDisplayName) {
			var fromData = TPCalc.Air.Data.getAirportData(fromDisplayName);
			if(!fromData) {
				TPCalc.showError("We were unable to find your departure city. Try entering an airport code, or just typing the first few letters of the city name.");
				TPCalc.printDebug("Bad departure airport display name lookup for '"+fromDisplayName+"': " + fromData);

				return false;
			}
		}
		if(toDisplayName != '' && toDisplayName != toDefaultDisplayName) {
			var toData = TPCalc.Air.Data.getAirportData(toDisplayName);
			if(!toData) {
				TPCalc.showError("We were unable to find your destination city. Try entering an airport code, or just typing the first few letters of the city name.");
				return false
			}
		}

		var fromDisplayName = $('#flight_dept_airport:enabled').val();
		var toDisplayName = $('#flight_dest_airport:enabled').val();
		var fromDefault = $('#flight_dept_airport:enabled').data('defaultValue');
		var toDefault = $('#flight_dest_airport:enabled').data('defaultValue');

		fromDisplayName = fromDisplayName == fromDefault ? '' : fromDisplayName;
		toDisplayName = toDisplayName == toDefault ? '' : toDisplayName;

		activeFlight.revise(
		  fromDisplayName,
		  toDisplayName,
		  $('#flight_num_ways:enabled').val(),
		  $('#flight_num_times:enabled').val(),
		  $('#flight_num_stops:enabled').val() || '0',
		  $('#flight_class:enabled').val(),
		  $('#flight_airline:enabled').val()
		);

		if(TPCalc.DEBUG >= 4) {
			TPCalc.printDebug("TPCalc.Air.State.updateActiveFlight():\n" + JSON.stringify(TPCalc.Air.State._flights, null, ' '));
		}
	},

	areAllFlightsSaved: function() {

		// Do not enable if edit focus is on a saved vehicle but an unsaved home exists

		var allSaved = true;
		var flights = TPCalc.Air.State._flights;

		for(var i=0, max=flights.length; i < max; i++) {
			if(!flights[i].isSaved) {
				allSaved = false;
				break;
			}
		}

		return allSaved;
	}

},  // End TPCalc.Air.State //

Data: {
	saveUserFlight: function() {
		var flight = TPCalc.Air.State.getActiveFlight();

		// Save this flight, provided all its required features have been specified

		if(!flight || !flight.isComplete()) {
			return false;
		}

		// Save the JSON representation of the flight to the user profile

		var jsonObj = flight.toJSONObject();
		var activeIdx = TPCalc.Air.State.activeFlightIdx();
		var success;

		if(!flight.isSaved) {
			flight.id = TPCalc.User.addFlight(jsonObj);
			success = flight.isSaved = Boolean(flight.id);
		} else {
			success = TPCalc.User.updateFlightById(jsonObj, flight.id);
		}

		flight.isDirty = !success;

		if(!success) {
			TPCalc.showError("There was a problem saving this flight to your profile.");
		}

		if(TPCalc.DEBUG >= 2) {
			TPCalc.printDebug("<h2>TPCalc.Air.Data.saveUserFlight(): User Data Cookie</h2>"
			  + JSON.stringify(TPCalc.User.retrieveAirData(), null, " "));
		}

		return success;
	},

	deleteUserFlight: function(flightIdx) {
		var success = TPCalc.User.deleteFlight(flightIdx);
		if(TPCalc.DEBUG >= 2) {
			TPCalc.printDebug("<h2>TPCalc.Air.Data.deleteUserFlight(): User Data Cookie</h2>"
			  + JSON.stringify(TPCalc.User.retrieveAirData(), null, " "));
		}
		return success;
	},

	getUserSimpleFlightCounts: function() {
		return TPCalc.User.getSimpleFlightCounts();
	},

	saveUserSimpleFlightCounts: function(numShort, numMedium, numLong) {
		var success = TPCalc.User.updateSimpleFlightCounts(numShort, numMedium, numLong);
		if(TPCalc.DEBUG >= 2) {
			TPCalc.printDebug("<h2>TPCalc.Air.Data.saveUserSimpleFlightCounts(): User Data Cookie</h2>"
			  + JSON.stringify(TPCalc.User.retrieveAirData(), null, " "));
		}
		return success;
	},

	getFlightCo2Data: function(fromCode, toCode) {
		return TPCalc.Sys.getFlightCo2Data(fromCode, toCode)
	},

	getFlightAirlines: function(fromCode, toCode) {
		return TPCalc.Sys.getFlightAirlines(fromCode, toCode)
	},

	getFlightClasses: function(fromCode, toCode, airlineCode) {
		return TPCalc.Sys.getFlightClasses(fromCode, toCode, airlineCode)
	},

	getAirlineName: function(airlineCode) {
		return TPCalc.Sys.getAirlineName(airlineCode);
	},

	getAirportData: function(displayName) {
		return TPCalc.Sys.getAirportData(displayName);
	},

	fetchAirportsByKey: function(key) {
		return TPCalc.Sys.queryAirportData(key, false);
	},

	fetchAirportByCode: function(code) {
		var airports = TPCalc.Sys.queryAirportData(code, true);
		return airports ? airports[0] : false;
	},

	fetchAirportsByKey: function(key) {
		return TPCalc.Sys.queryAirportData(key, false);
	},

	fetchAirportByCode: function(code) {
		var airports = TPCalc.Sys.queryAirportData(code, true);
		return airports ? airports[0] : false;
	},

	fetchKeywords: function(key) {
		var airports = TPCalc.Air.Data.fetchAirportsByKey(key);
		if(!airports) {
			return false;
		}
		// Build list of keywords from airport display names
		var keywords = [];
		for(var i=0, max=airports.length; i < max; i++) {
			keywords.push(airports[i].display);
		}

		// Remove dupes
		var prev = '';
		for(var j=0; j < keywords.length; j++) {
			if(prev == keywords[j]) {
				keywords.splice(j, 1);
				j--;
			} else {
				prev = keywords[j];
			}
		}

		return keywords.length > 0 ? keywords : false;
	}

}, // End TPCalc.Air.Data //

Util: {

	distance: function(lat1, lng1, lat2, lng2) {

		var earthRadius = TPCalc.Air.EARTH_RADIUS;

		// Convert to radians
		var radlat1 = Math.PI * (lat1)/180;
		var radlat2 = Math.PI * (lat2)/180;

		var radlng1 = Math.PI * (lng1)/180;
		var radlng2 = Math.PI * (lng2)/180;

		radlat1 += Math.PI/2;
		radlat2 += Math.PI/2;

		if (radlng1 < 0) {
			radlng1 += Math.PI*2;
		}
		if (radlng2 < 0) {
			radlng2 += Math.PI*2;
		}

		var x1 = earthRadius * Math.cos(radlng1) * Math.sin(radlat1);
		var y1 = earthRadius * Math.sin(radlng1) * Math.sin(radlat1);
		var z1 = earthRadius * Math.cos(radlat1);

		var x2 = earthRadius * Math.cos(radlng2) * Math.sin(radlat2);
		var y2 = earthRadius * Math.sin(radlng2) * Math.sin(radlat2);
		var z2 = earthRadius * Math.cos(radlat2);

		var d = Math.sqrt( (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)+(z1-z2)*(z1-z2) );

		// Side, side, side, law of cosines and arccos
		var theta = Math.acos((earthRadius * earthRadius + earthRadius * earthRadius - d * d)/(2 * earthRadius * earthRadius));
		var distance = theta * earthRadius;

		var distMiles = distance * TPCalc.Air.KM_TO_MILES_FACTOR;	// in miles

		return distMiles;
	},

	getWRICo2Factor: function(distMiles) {
		var lbsCo2PerMile = TPCalc.Air.WRI_CO2_FACTORS[0].lbsCo2PerMile;
		for(var i=0; i < TPCalc.Air.WRI_CO2_FACTORS.length; i++) {
			if(distMiles >= TPCalc.Air.WRI_CO2_FACTORS[i].mileThreshold) {
				lbsCo2PerMile = TPCalc.Air.WRI_CO2_FACTORS[i].lbsCo2PerMile;
			}
		}
		return lbsCo2PerMile;
	}

}  // End TPCalc.Air.Util //

};  // End TPCalc.Air //

/**
 * TPCalc.Residential application object
 *
 * This singleton defines the settings and functionality specific to
 * the residential calculator portion of the unified calculator.
 *
 * Depends on jQuery (external) and AutoComplete.
 */

TPCalc.Residential = {

///////////////
// Constants //
///////////////

HOME_CO2_DATA_URL: '/wp-content/themes/terrapass'+'/home/models/home-model.php',
DETAILS_PAGE_URL:  './home-details',

BILL_ID_TO_TYPE_MAP: {
	'home_avg_combined_bill':     'eleGasCombo',
	'home_avg_electricity_bill':  'electricity',
	'home_avg_gas_bill':          'gas',
	'home_avg_oil_bill':          'heatingOil',
	'home_avg_propane_bill':      'propane'
},

/////////////
// Members //
/////////////

isInitialized: false,
subtotalFootprint: -1,
activeHomeIdx: 0,
homes: [],
co2Data: {},
billIdToTypeMap: {},

/////////////
// Classes //
/////////////

Home: function(zip, city, state, energyBills) {
	this.isSaved = false;
	this.isDirty = true;
	this.id = null;

	this.zip = zip;
	this.city = city;
	this.state = state;
	this.energyBills = energyBills || {};

	//////////////////////
	// Constructor main //
	//////////////////////

	var _this = this;

	////////////////////
	// Public methods //
	////////////////////

	this.fromJSONObject = function(usrObj) {
		if(!usrObj.zip || !usrObj.bills) {
			if(TPCalc.DEBUG >= 3) {
				TPCalc.printDebug("Failed to load user object in the a Home object.");
			}
			return;
		}

		_this.id = usrObj.id
		_this.zip = usrObj.zip;
		_this.city = usrObj.city;
		_this.state = usrObj.state;

		var energyBill;

		for(var i=0, max=usrObj.bills.length; i < max; i++) {
			energyBill = new TPCalc.Residential.EnergyBill();
			energyBill.fromJSONObject(usrObj.bills[i]);
			_this.energyBills[energyBill.getBillType()] = energyBill;
		}

		_this.isSaved = true;
		_this.isDirty = false;
	};

	this.getZip = function() {
		return _this.zip;
	};

	this.getCity = function() {
		return _this.city;
	};

	this.getState = function() {
		return _this.state;
	};

	this.getCityState = function() {
		return _this.getCity() + ', ' + _this.getState();
	};

	this.getEnergyBillCount = function() {
		return TPCalc.objLength(_this.energyBills);
	};

	this.getEnergyBills = function() {
		var arr = [];
		for(var p in _this.energyBills) {
			arr.push(_this.energyBills[p]);
		}
		return arr.length > 0 ? arr : false;
	};

	this.getEnergyBill = function(billType) {
		return _this.energyBills[billType];
	};

	this.calcCo2LbsPerYear = function() {
		var sum = 0;
		for(var billType in _this.energyBills) {
			sum += _this.energyBills[billType].calcCo2LbsPerYear();
		}
		return sum;
	};

	this.isComplete = function() {
		return	_this.zip && _this.city && _this.state && _this.getEnergyBillCount() > 0;
	};

	this.toJSONObject = function() {
		var jsonObj = {
			id: _this.id,
			zip: _this.zip,
			city: _this.city,
			state: _this.state,
			bills: []
		};

		var bill;

		for(var billType in _this.energyBills) {
			bill = _this.energyBills[billType].toJSONObject();
			if(bill) {
				jsonObj.bills.push(bill);
			}
		}

		return jsonObj;
	};

	this.revise = function(zip) {
		if(zip && _this.zip != zip) {
			_this.zip = zip;
			if(TPCalc.Residential.co2Data[zip] === undefined && !TPCalc.Residential.fetchHomeCo2Data(zip)) {
				TPCalc.showError('There was a problem loading home CO2 data.');
				return;
			}
			if(!TPCalc.Residential.co2Data[zip]) {
				return;
			}
			_this.city = TPCalc.Residential.co2Data[zip].location.city;
			_this.state = TPCalc.Residential.co2Data[zip].location.state;
		}
	};

	this.reviseEnergyBill = function(billType, amount) {
		var bill = _this.getEnergyBill(billType);
		if(bill) {
			bill.revise(amount);
		} else {
			var usdToCo2Lbs = TPCalc.Residential.co2Data[_this.zip][billType].usdToCo2Lbs;
			_this.energyBills[billType] = new TPCalc.Residential.EnergyBill(billType, amount, usdToCo2Lbs);
		}

	};

	this.removeEnergyBills = function() {
		_this.energyBills= {};
	};
},

EnergyBill: function(billType, amount, usdToCo2Lbs) {

	// Public Properties //

	this.billType    = billType;
	this.amount      = amount ? parseFloat(amount) : 0.00;
	this.usdToCo2Lbs = usdToCo2Lbs;
	this.annualFreq  = _getBillFrequency(billType);

	// Private properties //

	var _this = this;

	// Public Methods //

	this.fromJSONObject = function(bill) {
		_this.billType = bill.type;
		_this.amount = bill.amt ? parseFloat(bill.amt) : 0.00;
		_this.usdToCo2Lbs = bill.usdToCo2;
		_this.annualFreq = bill.freq;
	};

	this.getAmount = function() {
		return _this.amount;
	};

	this.getUSDToCo2Lbs = function() {
		return _this.usdToCo2Lbs;
	};

	this.getBillType = function() {
		return _this.billType;
	};

	this.calcCo2LbsPerYear = function() {
		var EnergyBill = TPCalc.Residential.EnergyBill;
		return _this.annualFreq * _this.amount * _this.usdToCo2Lbs;
	};

	this.toJSONObject = function() {
		if(_this.amount < 1) {
			return null;
		}
		var jsonObj = {
			type     : _this.billType,
			amt      : _this.amount ? _this.amount.toFixed(2): 0.00,
			freq     : _this.annualFreq,
			usdToCo2 : _this.usdToCo2Lbs
		}
		return jsonObj;
	};

	this.revise = function(amount) {
		_this.amount = parseFloat(amount) || 0.00;
	};

	// Private methods //

	function _getBillFrequency(billType) {
		switch(billType) {
			case 'heatingOil':
			case 'propane':
				return 1;
			default:
				return 12;
		}
	};

},

/////////////
// Methods //
/////////////

init: function() {
	var exc;
	if(TPCalc.Residential.isInitialized) {
		return;
	}
	try {
		TPCalc.Residential.initDOMNodes();
		TPCalc.Residential.initDOMEvents();
		TPCalc.Residential.initDOMClones();
		TPCalc.Residential.loadUserData();
		TPCalc.Residential.isInitialized = true;
	} catch(exc) {
		if(TPCalc.DEBUG > 0){
			TPCalc.handleException(exc);
		} else {
			TPCalc.showError("There was an error with loading the residential carbon calculator.");
		}
	}
},
initDOMNodes: function(){
	// Suppress display of email newsletter signup if the user has already
	// signed up in the past

	if(Cookie.get('nwsltr_signup') > 0) {
		$('#home_email').val('').parents('.data-pair').eq(0).css('display', 'none');
	}
},
initDOMEvents: function() {

	// zip submit button

	$('#home_zip_submit').click(TPCalc.Residential.handleHomeZip);

	$('#home_zip').keydown(function(evt){
		var keyCode = evt.keyCode;
		if (keyCode == AutoComplete.KEY_ENTER){
			TPCalc.Residential.handleHomeZip();
			this.blur();
		}
	});

	// When focus returns to ZIP "unlock"
	$('#home_zip').focus(function(){
		$('#home_zip_field').removeClass('lock');
	});

	// 1st energy use question
	$('#home_use_gas_electricity_field input[type=radio]').click(function(){
		TPCalc.Residential.resetHomeBillType();
		TPCalc.Residential.enableHomeBillType();
		TPCalc.Residential.updateHomeSummary();
	});

	// 2nd energy use Qs
	$('#home_get_combined_bill_field input[type=radio]').click(function(){
		TPCalc.Residential.resetHomeAvgBills();
		TPCalc.Residential.enableHomeAvgBills();
		TPCalc.Residential.updateHomeSummary();
	});

	$('#home_get_combined_bill_field input[type=radio], #home_get_separate_bill_field input[type=checkbox]').click(function(){
		//TPCalc.Residential.resetHomeAvgBills();
		TPCalc.Residential.enableHomeAvgBills();
		TPCalc.Residential.updateHomeSummary();
		if(TPCalc.Residential.validateInputs()) {
			TPCalc.Residential.enableHomeCalculate();
		} else {
			TPCalc.Residential.resetHomeCalculate();
		}
	});

	// Monitor avg bill boxes for complete form
	$('#residential_calculator .avg-bill :text').bind('blur keyup', function() {
		if(TPCalc.Residential.validateInputs()) {
			TPCalc.Residential.enableHomeCalculate();
		} else {
			TPCalc.Residential.resetHomeCalculate();
		}
	});

	// Calc button
	$('#home_calculate').click(function(){
		if(!TPCalc.Residential.validateInputs()) {
			return false;
		}
		TPCalc.Residential.updateActiveHome();
		TPCalc.Residential.saveUserHome();
		TPCalc.Residential.updateHomeSummary();
		TPCalc.Residential.updateFootprintSubtotal();
		TPCalc.Residential.enableHomeAdd();
		if(TPCalc.submitEmailSignup($('#home_email').val(), 'homecalc')){
			$('#home_email').parents('.data-pair').eq(0).slideUp('slow');
		}

		return false;
	});

	// Add home button
	$('#add_home').click(function(){
		var exc;
		try {
			if($(this).attr('disabled') || $(this).hasClass('disabled')) {
				return false;
			}
			TPCalc.Residential.activeHomeIdx = 0;
			TPCalc.Residential.addHome();
			TPCalc.Residential.addHomeSummary();
			TPCalc.Residential.resetHomeControls();
		} catch(exc) {
		}
		return false;
	});

	// Filter chars
	AutoComplete.bindInputFilter($('#home_zip'), AutoComplete.filterForDigit)
	AutoComplete.bindInputFilter($('#residential_calculator .avg-bill :text'), AutoComplete.filterForCurrency);

	// Home summary controls (Edit/Delete buttons)
	$('#residential_summary .edit').click(function() {
		var liContainer = $(this).parents('li').get(0);
		var homeIdx = $('#residential_summary ul li').index(liContainer);
		TPCalc.Residential.focusHomeSummary(homeIdx);
	});

	$('#residential_summary .delete').click(function(){

		var homeIdx = $('#residential_summary ul li').index($(this).parents('li').get(0));
		var home = TPCalc.Residential.getHome(homeIdx);

		if(home.isSaved) {
			TPCalc.Residential.deleteUserHome(homeIdx);
		}
		TPCalc.Residential.deleteHome(homeIdx);		// Remove from application state
		if(TPCalc.Residential.getHomeCount() < 1) {
			TPCalc.Residential.addHome();		// Always keep at least one empty vehicle in application state
		}
		TPCalc.Residential.removeHomeSummary(home, homeIdx);
		TPCalc.Residential.updateActiveHome();
		TPCalc.Residential.updateFootprintSubtotal();
	});
},

initDOMClones: function() {

	// Save canonical DOM nodes used in cloning
	$('#residential_summary ul').each(function(i, list){
		$(list).data('defaultItem', $('li:first-child', list).clone(true).removeClass('only-child'));
	});
},

handleHomeZip: function(){
		var zip = $('#home_zip').val();
		if(!TPCalc.Residential.validateZip(zip)) {
			TPCalc.showError('Please enter a valid zip code.');
			return false;
		}
		if(TPCalc.Residential.co2Data[zip] === undefined && !TPCalc.Residential.fetchHomeCo2Data(zip)) {
			TPCalc.showError('There was a problem loading home CO2 data.');
			return false;
		}
		if(TPCalc.Residential.co2Data[zip] === null) {
			TPCalc.showError('You entered an unrecognized zip code.');
			return false;
		}
		var savedZip = $('#home_zip').data('prevValue');
		if(savedZip && savedZip == zip) {
			$('#home_zip_field').addClass('lock');
			return false;
		}

		$('#home_zip').data('prevValue', zip);
		TPCalc.Residential.resetHomeUseGasElectricity();
		TPCalc.Residential.enableHomeUseGasElectricity();
		TPCalc.Residential.updateActiveHome();

		TPCalc.Residential.updateHomeSummary();

		var loc = TPCalc.Residential.getActiveHome().getCityState();
		$('#home_zip_field').addClass('lock');
		$('#home_location').html(loc);

		return false;
},

loadUserData: function() {

	// Migrate old data formats to current data format

	TPCalc.User.migrateResidentialData();

	// Get saved user data

	var usrHomes = TPCalc.User.getHomes();
	var home;
	if(usrHomes && usrHomes.length > 0) {
		$('#residential_summary ul li:only-child.active').remove();
		for(var i=usrHomes.length-1; i >= 0; i--) {
			// Create and init Home object
			home = new TPCalc.Residential.Home();
			home.fromJSONObject(usrHomes[i]);

			TPCalc.Residential.addHome(home);
			TPCalc.Residential.addHomeSummary(home);
		}

		TPCalc.Residential.loadHomeControls(home);	// Load the last one into the controls
		TPCalc.Residential.updateFootprintSubtotal(true);
	}

	if(TPCalc.Residential.getHomeCount() < 1) {
		TPCalc.Residential.addHome();
	}

	TPCalc.Residential.loadSubmittedHome();
},

// These methods manage the res calc data model state

getHomes: function(idx) {
	return TPCalc.Residential.homes;
},

getHome: function(idx) {
	return TPCalc.Residential.homes.length > 0 ? TPCalc.Residential.homes[idx] : false;
},

getHomeIdxById: function(id) {
	for(var i=0, max=TPCalc.Residential.homes.length; i<max; i++) {
		if(TPCalc.Residential.homes[i].id == id) {
			return i;
		}
	}
	return false;
},

getActiveHome: function() {
	return TPCalc.Residential.getHome(TPCalc.Residential.activeHomeIdx);
},

updateActiveHome: function() {
	var activeHome = TPCalc.Residential.getActiveHome();
	if(!activeHome) {
		return;
	}

	activeHome.revise($('#home_zip:enabled').val());
	activeHome.removeEnergyBills();

	$("#residential_calculator .avg-bill :text:enabled").each(function(){
		var billType = TPCalc.Residential.mapEnergyBillIdToType(this.id);
		activeHome.reviseEnergyBill(billType, this.value);
	});

	if(TPCalc.DEBUG >= 4) {
		TPCalc.printDebug("TPCalc.Residential.updateActiveHome():\n" + JSON.stringify(TPCalc.Residential.homes, null, ' '));
	}
},

addHome: function(home) {
	if(!home) {
		home = new TPCalc.Residential.Home();
	}

	TPCalc.Residential.homes.unshift(home);

	if(TPCalc.DEBUG >= 4) {
		TPCalc.printDebug("TPCalc.Residential.addHome():\n" + JSON.stringify(TPCalc.Residential.homes, null, ' '));
	}
	return home;
},

deleteHome: function(idx) {
	TPCalc.Residential.homes.splice(idx, 1);

	if(TPCalc.DEBUG >= 4) {
		TPCalc.printDebug("TPCalc.Residential.deleteHome():\n" + JSON.stringify(TPCalc.Residential.homes, null, ' '));
	}
},

getHomeCount: function() {
	return TPCalc.Residential.homes.length;
},

fetchHomeCo2Data: function(zip) {
	var url = TPCalc.Residential.HOME_CO2_DATA_URL + '?zip=' + zip;

	var reqObj = TPCalc.getJSON(url, function(json) {
		TPCalc.Residential.co2Data[zip] = json;
	});

	if(!reqObj) {
		return false;
	}

	if(!reqObj.responseText) {
		TPCalc.Residential.co2Data[zip] = null;
	}
	return true;
},

//methods update ui

updateFootprintSubtotal: function() {
	var total = Math.round(TPCalc.Residential.calcFootprint(true));
	$('#residential_carbon_footprint').html(total.toFormattedString());
	TPCalc.updateFootprintTotal();
	TPCalc.setCalculatorProgress(TPCalc.TYPE_RESIDENTIAL, total > 0);
},

calcFootprint: function(forceRecalc) {
	if(forceRecalc || TPCalc.Residential.subtotalFootprint < 0) {
		var subtotal = 0;
		var homes = TPCalc.Residential.getHomes();
		var bills;
		if(homes) {
			for(var i=0, numHomes = homes.length; i < numHomes; i++) {
				subtotal += homes[i].calcCo2LbsPerYear();
			}
		}
		TPCalc.Residential.subtotalFootprint = subtotal;
	}
	return TPCalc.Residential.subtotalFootprint;
},

addHomeSummary: function( home ) {

	// Find original default list item node, clone & update
	var $list = $('#residential_summary ul');
	var $li = $list.data('defaultItem').clone(true);
	var $header = $('.home-id', $li);
	var hdrStr = $header.html();

	// Make note of list height when there are exactly two list items

	if($('li', $list).length == 2) {
		var listHeight = $list.height();
	}

	$('li.active', $list).removeClass('active');
	$header.html(hdrStr.replace(/\d+\s*$/, $('li', $list).length+1));
	$list.prepend($li);

	if(home) {
		TPCalc.Residential.updateHomeSummary(home, 0);
	}

	// The max height of the vehicle summary list
	// should be whatever the height when there are
	// exactly two vehicle summaries

	if($('li', $list).length > TPCalc.SCROLL_THRESHOLD) {
		if(!$list.hasClass('scrolling')) {
			$list.height(listHeight).addClass('scrolling');
		}
	}
},

updateHomeSummary: function(home, hIdx) {
	var zip, localData;

	if(hIdx === undefined) {
		hIdx = TPCalc.Residential.activeHomeIdx;
	}
	if(!home) {
		TPCalc.Residential.updateActiveHome();
		home = TPCalc.Residential.getActiveHome();
	}

	var descrStr = '';
	var summary = $("#residential_summary ul li").get(hIdx);

	var $header = $('.home-id', summary);
	if(!$header.data('defaultInnerHTML')) {
		$header.data('defaultInnerHTML', $header.html());
	}

	var zip = home.getZip();

	if(zip) {
		$header.html('Home in ' + home.getCityState() + ' ' + zip);
	} else {
		$header.html($header.data('defaultInnerHTML'));
	}

	var comboBill = home.getEnergyBill('eleGasCombo');
	var electricBill = home.getEnergyBill('electricity');
	var gasBill = home.getEnergyBill('gas');
	var oilBill = home.getEnergyBill('heatingOil');
	var propaneBill = home.getEnergyBill('propane');

	if(comboBill) {
		descrStr = 'Gas &amp; electricity';
	} else {
		if(electricBill) {
			descrStr += 'electricity ';
		}
		if(gasBill) {
			descrStr += 'gas ';
		}
		if(oilBill) {
			descrStr += 'heating oil ';
		}
		if(propaneBill) {
			descrStr += 'propane ';
		}
	}

	if(descrStr) {
		descrStr = $.trim(descrStr.charAt(0).toUpperCase() + descrStr.substr(1));
		$('.home-description', summary).html(descrStr).removeClass('hidden');
	} else {
		$('.home-description', summary).empty().addClass('hidden');
	}

	var co2LbsPerYear = 0;
	if(hIdx !== undefined || (TPCalc.Residential.validateInputs() && home.isSaved)) {
		co2LbsPerYear = home.calcCo2LbsPerYear();
	}
	if(co2LbsPerYear > 0) {
		$('.home-detail, .home-bottom-line', summary).removeClass('hidden');
		$('.home-carbon-total', summary).html(Math.round(co2LbsPerYear).toFormattedString());

		// Bind click event handler to details link

		var url = TPCalc.Residential.DETAILS_PAGE_URL + '?id=' + home.id;
		$('.detail', summary).unbind('click').click(function() {
			var exc;
			try {
				TPCalc.openDetailsWindow(url);
			} catch(exc) {
				// ignore //
			}
			return false;
		});

	} else {
		$('.home-detail, .home-bottom-line', summary).addClass('hidden')
		$('.home-carbon-total', summary).html('0');
	}
},

removeHomeSummary: function(home, homeIdx) {

	var $list = $('#residential_summary ul li');

	// Different behavior if the list has only one summary item

	if($list.length > 1) {

		// Remove summary item from UI

		$list.eq(homeIdx).remove();
		$('#residential_summary ul li:only-child').addClass('only-child');

		// Update application state

		if(homeIdx < TPCalc.Residential.activeHomeIdx) {
			TPCalc.Residential.activeHomeIdx--;
		} else if(TPCalc.Residential.activeHomeIdx == homeIdx) {
			TPCalc.Residential.focusHomeSummary(TPCalc.Residential.activeHomeIdx);
		}
	} else {
		home.isSaved = false;
		home.isDirty = true;
		TPCalc.Residential.resetHomeZip();
		TPCalc.Residential.updateHomeSummary();
	}

	if($('#residential_summary ul li').length <= TPCalc.SCROLL_THRESHOLD) {
		$('#residential_summary ul').height('').removeClass('scrolling');
	}
},

focusHomeSummary: function(homeIdx){
	TPCalc.Residential.activeHomeIdx = homeIdx;

	var home = TPCalc.Residential.getHome(homeIdx);
	if(!home) {
		return;
	}

	TPCalc.Residential.loadHomeControls(home);

	$('#residential_summary ul li').eq(homeIdx)
	  .siblings('.active').removeClass('active').end()
	  .addClass('active');
},

resetHomeControls: function() {
	TPCalc.Residential.resetHomeZip();  // Cascades resets down the form
},

resetHomeZip: function() {
	$('#home_zip_field').removeClass('lock');
	$('#home_location').empty();
	$('#home_zip').val('').removeData('prevValue');
	TPCalc.Residential.resetHomeUseGasElectricity();
},

resetHomeUseGasElectricity: function() {
	$('#home_use_gas_electricity_field')
	  .addClass('hidden')
	  .find('input').attr('checked', false).attr('disabled','disabled');
	TPCalc.Residential.resetHomeBillType();
},

resetHomeBillType: function() {
	$('#home_get_combined_bill_field, #home_get_separate_bill_field')
	  .addClass('hidden')
	  .find('input').attr('checked', false).attr('disabled','disabled');
	TPCalc.Residential.resetHomeAvgBills();
},

resetHomeAvgBills: function() {
	$('#residential_calculator .avg-bill')
	  .addClass('hidden')
	  .find(':text').val('').attr('disabled','disabled');
	TPCalc.Residential.resetHomeCalculate();
},

resetHomeCalculate: function() {
	$('#home_calculate').attr('disabled','disabled').addClass('disabled');
	TPCalc.Residential.resetHomeAdd();
},

resetHomeAdd: function() {
	$('#add_home').attr('disabled', 'disabled').addClass('disabled');
},

enableHomeUseGasElectricity: function() {
	$('#home_use_gas_electricity_field').removeClass('hidden')
	  .find(':input').removeAttr('disabled');
},

enableHomeBillType: function() {

	var useGasElectric = $('input[type=radio][name=home_use_gas_electricity]:checked:enabled').val();
	if(useGasElectric === undefined) {
		return;
	} else if(useGasElectric > 0) {
		$('#home_get_combined_bill_field').removeClass('hidden')
		   .find(':input').removeAttr('disabled');
		$('#home_get_separate_bill_field').addClass('hidden')
		  .find(':input').attr('disabled','disabled');
	} else {
		$('#home_get_combined_bill_field').addClass('hidden')
		  .find(':input').attr('disabled','disabled');
		$('#home_get_separate_bill_field').removeClass('hidden')
		  .find(':input').removeAttr('disabled');
	}
},

enableHomeAvgBills: function() {
	var useGasElectric = $('input[type=radio][name=home_use_gas_electricity]:checked:enabled').val();
	if(useGasElectric === undefined) {
		return;
	}
	var zip = $('#home_zip').val();
	if(TPCalc.Residential.co2Data[zip] === undefined && !TPCalc.Residential.fetchHomeCo2Data(zip)) {
		TPCalc.showError('There was a problem loading home CO2 data.');
		return;
	}
	if(TPCalc.Residential.co2Data[zip] === null) {
		return;
	}
	var localData = TPCalc.Residential.co2Data[zip];
	var locName = localData.location.city + ', ' + localData.location.state;
	if(useGasElectric == '1') {
		var isCombined = $('input[type=radio][name=home_get_combined_bill]:checked:enabled').val();
		if(isCombined == '1') {
			$('#home_avg_combined_bill_field').removeClass('hidden')
			  .find(':input').removeAttr('disabled').end()
			  .find('.data-note .location').html(locName).end()
			  .find('.data-note .cost').html(localData.eleGasCombo.avgMonthlyBill).end();
			$('#residential_calculator .avg-bill:not(#home_avg_combined_bill_field)').addClass('hidden')
			  .find(':input').attr('disabled','disabled').end()
			  .find('.data-note .location, .data-note .cost').empty().end();
		} else if (isCombined == '0'){
			$('#home_avg_electricity_bill_field, #home_avg_gas_bill_field').removeClass('hidden')
			  .find(':input').removeAttr('disabled').end()
			  .find('.data-note .location').html(locName).end();

			$('#home_avg_electricity_bill_field .data-note .cost').html(localData.electricity.avgMonthlyBill);
			$('#home_avg_gas_bill_field .data-note .cost').html(localData.gas.avgMonthlyBill);

			$('#residential_calculator .avg-bill:not(#home_avg_electricity_bill_field,#home_avg_gas_bill_field)').addClass('hidden')
			  .find(':input').attr('disabled','disabled').end()
			  .find('.data-note .location, .data-note .cost').empty().end();
		}
	} else if(useGasElectric == '0') {
		$('#home_avg_combined_bill_field').addClass('hidden');
		$('input[type=checkbox][name=home_get_separate_bill]').each(function(){
			var billType = this.value;
			var inputId = TPCalc.Residential.mapEnergyBillTypeToId(billType);
			var fieldIdStr = '#' + inputId + '_field';
			var amt = localData[billType].avgMonthlyBill || localData[billType].avgYearlyBill;
			if(this.checked) {
				$(fieldIdStr).removeClass('hidden')
				  .find(':input').removeAttr('disabled').end()
				  .find('.data-note .location').html(locName).end()
				  .find('.data-note .cost').html(amt).end();
			} else {
				$(fieldIdStr).addClass('hidden')
				  .find(':input').attr('disabled','disabled').end()
				  .find('.data-note .location, .data-note .cost').empty().end();
			}
		});
	}
},

enableHomeCalculate: function() {
	$('#home_calculate').removeAttr('disabled').removeClass('disabled');
},

enableHomeAdd: function() {
	// Do not enable if edit focus is on a saved home but an unsaved home exists
	var allHomesSaved = true;
	var homes = TPCalc.Residential.getHomes();
	for(var i=0, max=homes.length; i < max; i++) {
		if(!homes[i].isSaved) {
			allHomesSaved = false;
			break;
		}
	}
	if(allHomesSaved) {
		$('#add_home').removeAttr('disabled').removeClass('disabled');
	}
},

// util methods

mapEnergyBillIdToType: function(id) {
	if(TPCalc.Residential.BILL_ID_TO_TYPE_MAP[id]) {
		return TPCalc.Residential.BILL_ID_TO_TYPE_MAP[id];
	} else {
		return false;
	}
},

mapEnergyBillTypeToId: function(key) {
	for(var id in TPCalc.Residential.BILL_ID_TO_TYPE_MAP) {
		if(TPCalc.Residential.BILL_ID_TO_TYPE_MAP[id] == key) {
			return id;
		}
	}
	return false;
},

validateInputs: function() {
	var allSet = true;
	$('#residential_calculator .avg-bill :text:enabled').each(function(){
		if(!TPCalc.Residential.validateCurrency(this.value)) {
			return allSet = false;
		}
		return true;
	});
	return allSet;
},

validateCurrency: function(cost) {
	var real = parseFloat(cost);
	return !isNaN(real);
},

validateZip: function(zip) {
	if(!zip) {
		return false;
	}
	return zip.match(/^[0-9]{5}$/);
},

// These methods save home data to the user profile

saveUserHome: function() {

	TPCalc.Residential.updateActiveHome();
	var home = TPCalc.Residential.getActiveHome();
	if(!home.isComplete()) {
		TPCalc.printDebug(JSON.stringify(home.toJSONObject(), null, ' '));
		TPCalc.showError("You cannot save a home before specifying all its features.");
		return false;
	}

	// Save to profile
	var jsonObj = home.toJSONObject();
	var activeIdx = TPCalc.Residential.activeHomeIdx;
	var success;
	if(!home.isSaved) {
		home.id = TPCalc.User.addHome(jsonObj);
		success = home.isSaved = Boolean(home.id);
	} else {
		success = TPCalc.User.updateHomeById(jsonObj, home.id);
	}

	home.isDirty = !success;

	if(!success) {
		TPCalc.showError("There was a problem saving this home to your profile.");
	}

	if(TPCalc.DEBUG >= 2) {
		TPCalc.printDebug("<h2>TPCalc.Road.saveUserHome(): User Data Cookie</h2>"
		  + JSON.stringify(TPCalc.User.retrieveResidentialData(), null, " "));
	}

	return true;
},

deleteUserHome: function(homeIdx) {
	if(homeIdx === undefined) {
		homeIdx = TPCalc.Residential.activeHomeIdx;
	}

	var home = TPCalc.Residential.getHome(homeIdx);
	TPCalc.User.deleteHomeById(home.id);

	if(TPCalc.DEBUG >= 2) {
		TPCalc.printDebug("<h2>TPCalc.Residential.deleteUserHome(): User Data Cookie</h2>"
		  + JSON.stringify(TPCalc.User.retrieveResidentialData(), null, " "));
	}

	return true;
},

loadHomeControls: function(home) {
	if(!home) {
		home = TPCalc.Residential.getActiveHome();
	}
	TPCalc.Residential.resetHomeZip();

	var zip = home.getZip();
	var city = home.getCity();
	var state = home.getState();

	var comboBill = home.getEnergyBill('eleGasCombo');
	var electricBill = home.getEnergyBill('electricity');
	var gasBill = home.getEnergyBill('gas');
	var allBills = home.getEnergyBills();

	if(zip) {
		$('#home_zip').data('prevValue', zip);
		$('#home_zip_field').addClass('lock');
		$('#home_zip').val(zip);
		if(city && state) {
			$('#home_location').html(home.getCityState());
		}

		if(comboBill) {
			$('#home_use_gas_electricity_yes').attr('checked', true);
			$('#home_get_combined_bill_yes').attr('checked', true);
			$('#home_avg_combined_bill').val(comboBill.getAmount().toFixed(2));
		} else {
			var numBills = home.getEnergyBillCount();
			if(electricBill && gasBill && numBills == 2) {
				$('#home_use_gas_electricity_yes').attr('checked', true);
				$('#home_get_combined_bill_no').attr('checked', true);
				$('#home_avg_electricity_bill').val(electricBill.getAmount().toFixed(2));
				$('#home_avg_gas_bill').val(gasBill.getAmount().toFixed(2));
			} else if(numBills > 0) {
				$('#home_use_gas_electricity_no').attr('checked', true);
				for(var i=0, max=allBills.length; i < max; i++) {
					var bill = allBills[i];
					var billType = bill.getBillType();
					var inputId = TPCalc.Residential.mapEnergyBillTypeToId(billType);
					var amt = bill.getAmount();
					$('input[type=checkbox][value='+billType+']').attr('checked', true);
					$('#'+inputId).val(amt.toFixed(2));
				}
			}
		}

		TPCalc.Residential.enableHomeUseGasElectricity();
		TPCalc.Residential.enableHomeBillType();
		TPCalc.Residential.enableHomeAvgBills();
		if(TPCalc.Residential.validateInputs()) {
			TPCalc.Residential.enableHomeCalculate();
		} else {
			TPCalc.Residential.resetHomeCalculate();
		}
		TPCalc.Residential.enableHomeAdd();
	}
},

loadSubmittedHome: function() {
	var params = TPCalc.parseQueryString();
	if(!params || !params['zip']) {
		return;
	}
	var activeHome = TPCalc.Residential.getActiveHome();
	var newHome;

	if(!activeHome || activeHome.isSaved) {
		TPCalc.Residential.activeHomeIdx = 0;
		TPCalc.Residential.addHome();
		TPCalc.Residential.addHomeSummary();
		TPCalc.Residential.resetHomeZip();
	}

	$('#home_zip').val(params['zip']);
	$('#home_zip_submit').trigger('click');
}

};  // End TPCalc.Residential //

/**
 * AutoComplete utility class
 *
 * Depends on jQuery (external).
 */

/////////////////
// Constructor //
/////////////////

function AutoComplete(input, listFunc, completeFunc) {

// Public Members //

this.maxListElems =		// # elements autocomplete can show (-1: no limit)
  AutoComplete.MAX_LIST_ELEMS;
this.charThreshold = 		// Show only after this # chars typed
  AutoComplete.DEFAULT_CHAR_THRESHOLD;

this.timeout = -1;		// Ain ms (-1: never time out)
this.keywordList = [];		// List of keywords to be used for autocompletion
this.pastKeywordLists = {};	// Hash of cached lists, keyed by user input strings
this.firstTextOnly = true;	// Should limit to beginning of keyword?
this.mouseEnabled = true;	// Enable Mouse Support
this.delimiters = '';		// Delimiter for multiple autocomplete. Set it to empty string for single autocomplete.

this.getKeywordList = null;	// Function that returns list of keywords
this.completionHandler = null;

// Private Members //

var _delimWords = [];
var _currDelimWord = 0;
var _delimChar = [];
var _display = false;
var _pos = 0;
var _total = 0;
var _curr = null;
var _rangeUp = 0;
var _rangeDown = 0;
var _doesMatch = [];
var _pre = 0;
var _timeoutId;
var _toMake = false;
var _getPre = "";
var _mouseOnList = 0;
var _keywordCount = 0;
var _caretMove = false;
var _mimicDropDown = false;
var _suspended = false;

// Main //

var _self = this;

this.getKeywordList = listFunc;
this.completionHandler = completeFunc;

_curr = $(input).get(0);
$(_curr).bind('focus', _setup);
$(_curr).bind('blur', _clear);

// Private Methods //

function _setup(){
	$(document).bind('keydown', _checkKey);
	$(_curr).bind('blur', _clear);
	$(_curr).bind('blur', _rewriteExactMatch);
	$(document).bind('keypress', _keypress);
}

function _clear(){
	$(document).unbind('keydown', _checkKey);
	$(_curr).unbind('blur', _rewriteExactMatch);
	$(_curr).unbind('blur', _clear);
	$(document).unbind('keypress', _keypress);
	_removeDisplay();
}

function _parse( keyword ){
	var re, escQuery, escQueryLen;
	if (_self.delimiters.length > 0){
		escQuery = $.trim(_addSlashes(_delimWords[_currDelimWord]));
		escQueryLen = $.trim(_delimWords[_currDelimWord]).length;
	} else {
		escQuery = _addSlashes(_curr.value);
		escQueryLen = _curr.value.length;
	}

	if (_self.firstTextOnly){
		re = new RegExp("^" + escQuery, "i");
	} else {
		re = new RegExp(escQuery, "i");
	}

	var toBuild = '';
	var pos = keyword.search(re);

	if( pos < 0 ) {
		toBuild += keyword;
	} else {
		for (var i=0; i < pos; i++){
			toBuild += keyword.substr(i,1);
		}
		if(_self._highlightStyle) {
			toBuild += '<strong class="autocomplete-match" style="' + _self._highlightStyle + '">';
		} else {
			toBuild += '<strong class="autocomplete-match">';
		}
		for (var i=pos; i < escQueryLen+pos; i++){
			toBuild += keyword.substr(i,1);
		}
		toBuild += "</strong>";
		for (var i=escQueryLen+pos; i < keyword.length; i++){
			toBuild += keyword.substr(i,1);
		}
	}

	return toBuild;
}

function _generate(){
	var acTable = document.getElementById('autocomplete');
	if (acTable){
		_display = false;
		acTable.parentNode.removeChild(acTable);
	}
	if (_keywordCount == 0){
		_display = false;
		return;
	}
	var table = document.createElement('table');
	table.id = 'autocomplete';
	table.cellSpacing='0px';
	table.cellPadding='0px';
	table.style.position='absolute';
	table.style.top = parseInt(AutoComplete.currTop(_curr) + _curr.offsetHeight) + "px";
	table.style.left = AutoComplete.currLeft(_curr) + "px";
	if(_self._bgColor) {
		table.style.backgroundColor = _self._bgColor;
	}
	document.body.appendChild(table);

	var first = true;
	var j = 1;
	var row, cell, counter = 0;
	if (_self.mouseEnabled){
		$(table).mouseout(_tableBlur);
		$(table).mouseover(_tableFocus);
	}
	for (var i=0; i < _self.keywordList.length && counter < _self.maxListElems; i++){
		if (_doesMatch[i]){
			counter++;
			row = table.insertRow(-1);
			if (first && !_toMake){
				if( _self._highlightColor ) {
					row.style.backgroundColor = _self._highlightColor;
				}
				$(row).addClass('autocomplete-highlight');
				first = false;
				_pos = counter;
			}else if(_pre == i){
				if( _self._highlightColor ) {
					row.style.backgroundColor = _self._highlightColor;
				}
				$(row).addClass('autocomplete-highlight');
				first = false;
				_pos = counter;
			} else {
				if( _self._bgColor ) {
					row.style.backgroundColor = _self._bgColor;
				}
				$(row).removeClass('autocomplete-highlight');
			}
			row.id = 'autocomplete_tr' + j;
			cell = row.insertCell(-1);
			cell.innerHTML = _parse(_self.keywordList[i]);
			cell.id = 'autocomplete_td' + j;
			cell.setAttribute('pos', j);
			if (_self.mouseEnabled){
				cell.style.cursor = 'pointer';
				$(cell).mouseover(_tableHighlight);
				$(cell).click(_mouseClick);


				// We need to set a flag to signal to the blur handler for the text input
				// that the mouse-click handler code should execute before the
				// the blur handler.

				// For clarity, the setting and unsetting of the flag would be
				// specified here. However, because there is not symmetry with the
				// MSIE setting/unsetting -- i.e. flag set on mouseover but cannot
				// be unset on mouseout because the mouseout event does not fire
				// in the right order -- the flag unsetting for IE must happen
				// in _enterCompletion().

				if( !$.browser.msie ) {
					$(cell).mousedown(function() {
						$(_curr).data('acMouseClicked', true);
						return false;
					});
					/*
					$(cell).mouseup(function() {
						$(_curr).removeData('acMouseClicked');
					});
					*/
				} else {
					$(cell).mouseover(function(){
						$(_curr).data('acMouseClicked', true);
					});
					$(cell).mouseup(function(e){
						$(this).click();
						$(_curr).removeData('acMouseClicked').blur();
						//$(_curr).blur();
					});
				}
			}
			j++;
		}
	}
	_rangeUp = 1;
	_rangeDown = j-1;
	_display = true;
	if (_pos <= 0) {
		_pos = 1;
	}

	if($.browser.msie && $.browser.version == 6) {
		_hideSelects();
	}
}

function _regenerate(){
	var acTable = document.getElementById('autocomplete');
	if( acTable ) {
		acTable.parentNode.removeChild(acTable);
	}
	var table = document.createElement('table');
	table.cellSpacing='0px';
	table.cellPadding='0px';
	table.style.position='absolute';
	table.style.top = parseInt(AutoComplete.currTop(_curr) + _curr.offsetHeight) + "px";
	table.style.left = AutoComplete.currLeft(_curr) + "px";
	if( _self._bgColor ) {
		table.style.backgroundColor = _self._bgColor;
	}
	table.id = 'autocomplete';
	if (_self.mouseEnabled){
		$(table).mouseout(_tableBlur);
		$(table).mouseover(_tableFocus);
	}
	document.body.appendChild(table);

	var first = true;
	var j = 1;
	var row, cell;
	if (_rangeUp > 1){
		row = table.insertRow(-1);
		if( _self._bgColor ) {
			row.style.backgroundColor = _self._bgColor;
		}
		cell = row.insertCell(-1);
		cell.className = 'autocomplete-nav';
		$(cell).html('[up]');
		if (_self.mouseEnabled){
			cell.style.cursor = 'pointer';
			$(cell).click(_mouseUp);
		}
	}
	for (var i=0; i < _self.keywordList.length; i++){
		if (_doesMatch[i]){
			if (j >= _rangeUp && j <= _rangeDown){
				row = table.insertRow(-1);
				if( _self._bgColor ) {
					row.style.backgroundColor = _self._bgColor;
				}
				row.id = 'autocomplete_tr'+(j);
				cell = row.insertCell(-1);
				cell.innerHTML = _parse(_self.keywordList[i]);
				cell.id = 'autocomplete_td'+(j);
				cell.setAttribute('pos',j);
				if (_self.mouseEnabled){
					cell.style.cursor = 'pointer';
					$(cell).mouseover(_tableHighlight);
					$(cell).click(_mouseClick);

					// We need to set a flag to signal to the blur handler for the text input
					// that the mouse-click handler code should execute before the
					// the blur handler.

					// For clarity, the setting and unsetting of the flag would be
					// specified here. However, because there is not symmetry with the
					// MSIE setting/unsetting -- i.e. flag set on mouseover but cannot
					// be unset on mouseout because the mouseout event does not fire
					// in the right order -- the flag unsetting for IE must happen
					// in _enterCompletion().

					if( !$.browser.msie ) {
						$(cell).mousedown(function() {
							$(_curr).data('acMouseClicked', true);
							return false;
						});
						/*
						$(cell).mouseup(function() {
							$(_curr).removeData('acMouseClicked');
						});
						*/
					} else {
						$(cell).mouseover(function(){
							$(_curr).data('acMouseClicked', true);
						});
						$(cell).mouseup(function(){
							$(this).click();
							//$(_curr).removeData('acMouseClicked').blur();
							$(_curr).blur();
						});
					}
				}
				j++;
			} else {
				j++;
			}
		}
		if (j > _rangeDown) break;
	}
	if (j-1 < _total){
		row = table.insertRow(-1);
		if( _self._bgColor ) {
			row.style.backgroundColor = _self._bgColor;
		}
		cell = row.insertCell(-1);
		cell.className = 'autocomplete-nav';
		$(cell).html('[down]');
		if (_self.mouseEnabled){
			cell.style.cursor = 'pointer';
			$(cell).click(_mouseDown);
		}
	}

	if($.browser.msie && $.browser.version == 6) {
		_hideSelects();
	}
}

function _addSlashes(str){
	return str.replace(/(["\\\.\|\[\]\^\*\+\?\$\(\)])/g, '\\$1');
}

function _goUp(){
	if (!_display) {
		return;
	}
	if (_pos == 1) {
		return;
	}
	if(_self._bgColor) {
		document.getElementById('autocomplete_tr'+_pos).style.backgroundColor = _self._bgColor;
	}
	$('#autocomplete_tr'+_pos).removeClass('autocomplete-highlight');
	_pos--;
	if (_pos < _rangeUp) {
		_moveUp();
	}
	if(_self._highlightColor) {
		document.getElementById('autocomplete_tr'+_pos).style.backgroundColor = _self._highlightColor;
	}
	$('#autocomplete_tr'+_pos).addClass('autocomplete-highlight');
	if (_timeoutId) {
		clearTimeout(_timeoutId);
	}
	if (_self.timeout > 0) {
		var callback = function(){
			_mouseOnList=0;
			_removeDisplay();
		};
		_timeoutId = setTimeout(callback, _self.timeout);
	}
}

function _goDown(){
	if (!_display) {
		return;
	}
	if (_pos == _total) {
		return;
	}
	if(_self._bgColor) {
		document.getElementById('autocomplete_tr'+_pos).style.backgroundColor = _self._bgColor;
	}
	$('#autocomplete_tr'+_pos).removeClass('autocomplete-highlight');
	_pos++;
	if (_pos > _rangeDown) {
		_moveDown();
	}
	if(_self._highlightColor) {
		$('#autocomplete_tr'+_pos).get(0).style.backgroundColor = _self._highlightColor;
	}
	$('#autocomplete_tr'+_pos).addClass('autocomplete-highlight');
	if (_timeoutId) {
		clearTimeout(_timeoutId);
	}
	if (_self.timeout > 0) {
		var callback = function(){
			_mouseOnList=0;
			_removeDisplay();
		};
		_timeoutId = setTimeout(callback, _self.timeout);
	}
}

function _moveDown(){
	_rangeUp++;
	_rangeDown++;
	_regenerate();
}

function _moveUp(){
	_rangeUp--;
	_rangeDown--;
	_regenerate();
}

//mouse support
function _mouseDown(){
	if(_self._bgColor) {
		document.getElementById('autocomplete_tr'+_pos).style.backgroundColor = _self._bgColor;
	}
	$('#autocomplete_tr'+_pos).removeClass('autocomplete-highlight');
	_pos++;
	_moveDown();
	if(_self._highlightColor) {
		document.getElementById('autocomplete_tr'+_pos).style.backgroundColor = _self._highlightColor;
	}
	$('#autocomplete_tr'+_pos).addClass('autocomplete-highlight');
	_curr.focus();
	_mouseOnList = 0;
	if (_timeoutId) {
		clearTimeout(_timeoutId);
	}
	if (_self.timeout > 0) {
		var callback = function(){
			_mouseOnList=0;
			_removeDisplay();
		};
		_timeoutId = setTimeout(callback,_self.timeout);
	}
}

function _mouseUp(evt){
	if (!evt) {
		evt = event;
	}
	if (evt.stopPropagation){
		evt.stopPropagation();
	} else {
		evt.cancelBubble = true;
	}
	if(_self._bgColor) {
		document.getElementById('autocomplete_tr'+_pos).style.backgroundColor = _self._bgColor;
	}
	$('#autocomplete_tr'+_pos).removeClass('autocomplete-highlight');
	_pos--;
	_moveUp();
	if(_self._highlightColor) {
		document.getElementById('autocomplete_tr'+_pos).style.backgroundColor = _self._highlightColor;
	}
	$('#autocomplete_tr'+_pos).addClass('autocomplete-highlight');
	_curr.focus();
	_mouseOnList = 0;
	if (_timeoutId) {
		clearTimeout(_timeoutId);
	}
	if (_self.timeout > 0) {
		var callback = function(){
			_mouseOnList=0;
			_removeDisplay();
		};
		_timeoutId = setTimeout(callback, _self.timeout);
	}
}

function _mouseClick(evt){
	if (!evt) {
		evt = event;
	}
	if (!_display) {
		return;
	}
	_mouseOnList = 0;
	_pos = this.getAttribute('pos');
	_enterCompletion();

	return false;
}

function _tableFocus(){
	_mouseOnList = 1;
}

function _tableBlur(){
	_mouseOnList = 0;
	if (_timeoutId) {
		clearTimeout(_timeoutId);
	}
	if (_self.timeout > 0) {
		var callback = function(){
			_mouseOnList = 0;
			_removeDisplay();
		};
		_timeoutId = setTimeout(callback, _self.timeout);
	}
}

function _tableHighlight(){
	_mouseOnList = 1;
	if(_self._bgColor) {
		document.getElementById('autocomplete_tr'+_pos).style.backgroundColor = _self._bgColor;
	}
	$('#autocomplete_tr'+_pos).removeClass('autocomplete-highlight');
	_pos = this.getAttribute('pos');
	while (_pos < _rangeUp) {
		_moveUp();
	}
	while (_pos > _rangeDown) {
		_moveDown();
	}
	if(_self._highlightColor) {
		document.getElementById('autocomplete_tr'+_pos).style.backgroundColor = _self._highlightColor;
	}
	$('#autocomplete_tr'+_pos).addClass('autocomplete-highlight');
	if (_timeoutId) {
		clearTimeout(_timeoutId);
	}
	if (_self.timeout > 0) {
		var callback = function() {
			_mouseOnList = 0;
			_removeDisplay();
		};
		_timeoutId = setTimeout(callback, _self.timeout);
	}
}

function _insertWord( keyword ){

	if (_self.delimiters.length > 0){
		var str = '';
		var strLen = 0;
		for (var i=0; i < _delimWords.length; i++){
			if (_currDelimWord == i){
				preSpace = postSpace = '';
				gotBreak = false;
				for (var j=0; j < _delimWords[i].length; ++j){
					if (_delimWords[i].charAt(j) != ' '){
						gotBreak = true;
						break;
					}
					preSpace += ' ';
				}
				for (var j=_delimWords[i].length-1; j >= 0; --j){
					if (_delimWords[i].charAt(j) != ' ') {
						break;
					}
					postSpace += ' ';
				}
				str += preSpace;
				str += keyword;
				strLen = str.length;
				if (gotBreak) {
					str += postSpace;
				}
			} else {
				str += _delimWords[i];
			}
			if (i != _delimWords.length - 1){
				str += _delimChar[i];
			}
		}
		_curr.value = str;
		AutoComplete.setCaret(_curr, strLen);
	} else {
		_curr.value = keyword;
	}
	_mouseOnList = 0;
	_removeDisplay();
}

function _enterCompletion( fullMatch ){
	if (!_display) {
		return;
	}
	_display = false;
	var word = '';
	var hitCount = 0;
	for (var i=0; i <= _self.keywordList.length; i++){
		if (_doesMatch[i]) {
			hitCount++;
		}
		if (hitCount == _pos){
			word = $.trim(_self.keywordList[i]);
			break;
		}
	}

	// Remove any keyword comments, i.e. a substring
	// enclosed in [] at the end
	word = word.replace(/\s+\[.*]*\]\s*$/, '');
	var currEditWord = _self.delimiters.length > 0 ? $.trim(_delimWords[_currDelimWord]) : _curr.value;

	if( !fullMatch || (word.toLowerCase() == currEditWord.toLowerCase()) ) {
		_insertWord(word);
		_self.suspend();

		// Clear immediately and then embed the finishing code
		// in a setTimeout so it doesn't hold up the _clear() call.

		_clear();
		setTimeout(function(){
			_curr.blur();
			if(_self.completionHandler) {
				_self.completionHandler(_curr, word);
			}
		}, 0);

		$(_curr).removeData('acMouseClicked');
	}

	AutoComplete.getCaretStart(_curr);
}

function _removeDisplay(){
	if (_mouseOnList == 0){
		_display = 0;
		var acTable = document.getElementById('autocomplete');
		if (acTable){
			acTable.parentNode.removeChild(acTable);
			if($.browser.msie && $.browser.version == 6) {
				_showSelects();
			}
		}
		if (_timeoutId) {
			clearTimeout(_timeoutId);
		}
		_self.keywordList = [];
	}
}

function _keypress(evt){
	if (!evt) {
		evt = event;
	}
	if (_caretMove) {
		evt.stopPropagation();
		evt.preventDefault();
	}
	return !_caretMove;
}

function _checkKey(evt){
	if (!evt) {
		evt = event;
	}
	var keyCode = evt.keyCode;
	var caretPosStart = AutoComplete.getCaretStart(_curr);
	_caretMove = false;

	if(_self._suspended && AutoComplete.keyCodeIsPrintable(keyCode)) {
		_curr.value = '';
		_self.resume();
		return true;
	}

	switch (keyCode){
		case AutoComplete.KEY_ESC:
			_clear();
			return false;
		case AutoComplete.KEY_UP:
			if(_display) {
				_goUp();
				_caretMove = true;
				return false;
			} else {
				return true;
			}

		case AutoComplete.KEY_DOWN:
			if(_display) {
				_goDown();
				_caretMove = true;
				return false;
			} else {
				return true;
			}

		case AutoComplete.KEY_TAB:
		case AutoComplete.KEY_ENTER:
			if (_display){
				_caretMove = true;
				_enterCompletion();
				return false;
			} else {
				return true;
			}
		default:
			if(!_self._suspended) {
				setTimeout(function(){_suggestCompletions(keyCode)}, 5);
			}
			return true;
	}
}

function _suggestCompletions(keyCode){

	// Ignore these chars
	if (keyCode == AutoComplete.KEY_UP
	 || keyCode == AutoComplete.KEY_DOWN
	 || keyCode == AutoComplete.KEY_SPACE
	 || keyCode == AutoComplete.KEY_SHIFT) {
		return;
	}

	var hitCount = 0;

	if (_display){
		var pos = 0;
		for (var i=0; i <= _self.keywordList.length; i++){
			if (_doesMatch[i]) {
				hitCount++;
			}
			if (hitCount == _pos){
				pos = i;
				break;
			}
		}
		_pre = pos;
	} else {
		_pre = -1;
	}

	if (!_mimicDropDown && _curr.value == ''){
		_mouseOnList = 0;
		_removeDisplay();
		return;
	}
	if (_self.delimiters.length > 0){
		var caretPosStart = AutoComplete.getCaretStart(_curr);
		var caretPosEnd = AutoComplete.getCaretEnd(_curr);

		var delimSplitRegExp = new RegExp( "([" + _self.delimiters + "])" );
		var match, segment;
		var kwIndex = 0;
		_delimWords = [''];

		for (var lpos=0, rpos=_curr.value.length; lpos < _curr.value.length; lpos++, rpos--){
			if (_curr.value.substr(lpos, rpos).search(delimSplitRegExp) === 0){
				match = _curr.value.substr(lpos, rpos).match(delimSplitRegExp);
				_delimChar[kwIndex] = match[1];
				_delimWords[++kwIndex] = '';
			} else {
				_delimWords[kwIndex] += _curr.value.charAt(lpos);
			}
		}

		var strLen = 0;
		_currDelimWord = -1;
		for (var i=0; i < _delimWords.length; i++){
			if (caretPosEnd >= strLen && caretPosEnd <= strLen + _delimWords[i].length){
				_currDelimWord = i;
			}
			strLen += _delimWords[i].length + 1;
		}
		var query = $.trim(_delimWords[_currDelimWord]);
		var escQuery = _addSlashes(query);
	} else {
		var query = _curr.value;
		var escQuery = _addSlashes(query);
	}
	if( !_mimicDropDown ) {
		if (query.length == 0){
			_mouseOnList = 0;
			_removeDisplay();
		}
		if (query.length < _self.charThreshold) {
			return;
		}
	}
	if (_self.firstTextOnly){
		var re = new RegExp("^" + escQuery, "i");
	} else {
		var re = new RegExp(escQuery, "i");
	}

	// Retrieve keyword list from server for the given key
	// (use cached keyword list if available)
	var key = _curr.value;
	if(key.length == _self.charThreshold) {
		if(_self.pastKeywordLists[key]) {
			_self.keywordList = _self.pastKeywordLists[key];
		} else {
			_self.keywordList = _self.pastKeywordLists[key] = _self.getKeywordList(key);
		}
	}

	if(!_self.keywordList || _self.keywordList.length < 1) {
		return;
	}

	_total = 0;
	_toMake = false;
	_keywordCount = 0;
	for ( var i=0; i < _self.keywordList.length; i++ ){
		_doesMatch[i] = false;
		if ( _mimicDropDown || re.test(_self.keywordList[i])){
			_doesMatch[i] = true;
			_total++;
			_keywordCount++;
			if (_pre == i) {
				_toMake = true;
			}
		}
	}

	if (_timeoutId) {
		clearTimeout(_timeoutId);
	}
	if (_self.timeout > 0) {
		var callback = function(){
			_mouseOnList = 0;
			_removeDisplay();
		};
		_timeoutId = setTimeout(callback, _self.timeout);
	}

	if(_currentExactMatch() == 1) {
		_rewriteExactMatch();
		_removeDisplay();
	} else {
		_generate();
	}
}

function _rewriteExactMatch() {
	if(!_display) {
		return false;
	}
	var exactMatchPos = _currentExactMatch();
	if (exactMatchPos < 0){
		return false;
	}

	_pos = exactMatchPos;
	_enterCompletion(true);
	return true;
}

function _currentExactMatch(){

	var currEditWord = _self.delimiters.length > 0 ? $.trim(_delimWords[_currDelimWord]) : _curr.value;
	var keyword, hitCount = 0;

	for (var i=0; i < _self.keywordList.length; i++){
		keyword = _self.keywordList[i].replace(/\s+\[.*]*\]\s*$/, '');
		if (_doesMatch[i]) {
			hitCount++;
		}
		if (keyword.toLowerCase() == currEditWord.toLowerCase()){
			return hitCount;
		}
	}

	return -1;
}

function _hideSelects() {
	var $table = $('#autocomplete');
/*
	// Is _isBoundBy() implemented incorrectly?

	$('select').each(function(i){
		var $sel = $(this);
		if(_isBoundBy($sel, $table)) {
			$sel.data('__acHide', true).css('visibility', 'hidden');
		}
	});
*/
	$('#air_controls fieldset select').each(function(i){
		var $sel = $(this);
		$sel.data('__acHide', true).css('visibility', 'hidden');
	});
}

function _showSelects() {
	$('select').each(function(){
		var $sel = $(this);
		if($sel.data('__acHide')) {
			$sel.removeData('__acHide').css('visibility', '');
		}
	});
}

function _isBoundBy(elem, container) {

	var $elem = $(elem);
	var elemOffset = $elem.offset();
	var elemTop = parseInt(elemOffset.top);
	var elemLeft = parseInt(elemOffset.left);
	var elemBot = elemTop + parseInt($elem.height());
	var elemRight = elemLeft + parseInt($elem.width());

	var $container = $(container);
	var conOffset = $container.offset();
	var conTop = parseInt(conOffset.top);
	var conLeft = parseInt(conOffset.left);
	var conBot = conTop + parseInt($container.height());
	var conRight = conLeft + parseInt($container.width());

	return
	    ((conLeft <= elemLeft && elemLeft <= conRight)
	  || (conLeft <= elemRight && elemRight <= conRight))
	 && ((conTop <= elemTop && elemTop <= conBot)
	  || (conTop <= elemBot && elemBot <= conBot));
}

this.suspend = function() {
	_self._suspended = true;
}

this.resume = function() {
	_self._suspended = false;
}

}  // End AutoComplete class //


////////////////////////////////
// Static Members (Constants) //
////////////////////////////////

AutoComplete.KEY_BACKSPACE= 8;
AutoComplete.KEY_TAB  =     9;
AutoComplete.KEY_ENTER=    13;
AutoComplete.KEY_SHIFT=    16;
AutoComplete.KEY_CTRL =    17;
AutoComplete.KEY_ESC  =    27;
AutoComplete.KEY_SPACE  =  32;
AutoComplete.KEY_LEFT =    37;
AutoComplete.KEY_UP   =    38;
AutoComplete.KEY_RIGHT=    39;
AutoComplete.KEY_DOWN =    40;
AutoComplete.KEY_PLUS =    43;
AutoComplete.KEY_MINUS=    45;
AutoComplete.KEY_DELETE=   46;
AutoComplete.KEY_F1   =   112;
AutoComplete.KEY_F5=      116;
AutoComplete.KEY_DOT =    190;
AutoComplete.KEY_PRINTABLE_RANGES = [	// (Incomplete?) list of keycode ranges for characters
	{min: 32,  max: 32},		// that affect strings (excluding tab and enter)
	{min: 46,  max: 90},
	{min: 96,  max: 111},
	{min: 186, max: 222}
];


AutoComplete.MAX_LIST_ELEMS = 10;
AutoComplete.DEFAULT_CHAR_THRESHOLD = 3;

////////////////////
// Static Methods //
////////////////////

AutoComplete.keyCodeIsPrintable = function(keyCode) {
	var max = AutoComplete.KEY_PRINTABLE_RANGES.length;

	for(var i=0; i < max; i++) {
		if( keyCode >= AutoComplete.KEY_PRINTABLE_RANGES[i].min
		 && keyCode <= AutoComplete.KEY_PRINTABLE_RANGES[i].max ) {
			return true;
		}
	}
	return false;
}
AutoComplete.bindInputFilter = function(input, filter) {
	var func = function(event) {
		return AutoComplete.filterInput(event, filter);
	};

	$(input).focus(function() {
		$(input).bind('keydown',func);
	});
	$(input).blur(function() {
		$(input).unbind('keydown',func);
	});
};

AutoComplete.filterInput = function(e, filter) {

	var exc, input = e.target;
	var code =  e.keyCode;

	switch (code) {
		case AutoComplete.KEY_LEFT:
		case AutoComplete.KEY_RIGHT:
		case AutoComplete.KEY_UP:
		case AutoComplete.KEY_DOWN:
		case AutoComplete.KEY_DELETE:
		case AutoComplete.KEY_BACKSPACE:
		case AutoComplete.KEY_TAB:
		case AutoComplete.KEY_ESC:
		case AutoComplete.KEY_F5:
			return true;

		case AutoComplete.KEY_TAB:
		case AutoComplete.KEY_ENTER:
			return true;

		default:
			return filter(e);
	}
};

AutoComplete.filterForDigit = function(event) {
	var code = event.keyCode;
	return (code >= 48 && code <= 57) || (code>=96 && code<=105);
};

AutoComplete.filterForCurrency = function(event) {
	var code = event.keyCode;
	var input = event.target;

	return (AutoComplete.filterForDigit(event) || code == AutoComplete.KEY_DOT)
	  && !input.value.match(/\.\d\d+$/);
};

AutoComplete.bindInputCompleter = function(input, completer) {
	var $menu = $('<div><ul></ul></div>');
	$menu.addClass('autocomplete');
	$(input).data('autocompleter', $menu);
};

AutoComplete.getCaretEnd = function(obj){
	var exc, M, Lp, rb;
	if(typeof obj.selectionEnd != "undefined"){
		return obj.selectionEnd;
	} else if (document.selection && document.selection.createRange){
		M = document.selection.createRange();
		try {
			Lp = M.duplicate();
			Lp.moveToElementText(obj);
		} catch(exc) {
			Lp = obj.createTextRange();
		}
		Lp.setEndPoint("EndToEnd", M);
		rb = Lp.text.length;
		if(rb > obj.value.length){
			return -1;
		}
		return rb;
	}

	return -1;
}

AutoComplete.getCaretStart = function(obj){
	var exc, M, Lp, rb;

	if(obj.selectionStart !== undefined) {
		return obj.selectionStart;
	} else if(document.selection && document.selection.createRange) {
		M = document.selection.createRange();
		try {
			Lp = M.duplicate();
			Lp.moveToElementText(obj);
		} catch(exc) {
			Lp = obj.createTextRange();
		}
		try {
			Lp.setEndPoint("EndToStart", M);
			rb = Lp.text.length;
			if(rb <= obj.value.length){
				return rb;
			}
		} catch(exc) {
		}
	}
	return -1;
}

AutoComplete.setCaret = function(obj){
	obj.focus();
	if (obj.setSelectionRange){
		obj.setSelectionRange(l,l);
	}else if(obj.createTextRange){
		var m = obj.createTextRange();
		m.moveStart('character',l);
		m.collapse();
		m.select();
	}
}

AutoComplete.currTop = function(obj){
	var toreturn = 0;
	while(obj){
		toreturn += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return toreturn;
}

AutoComplete.currLeft = function(obj){
	var toreturn = 0;
	while(obj){
		toreturn += obj.offsetLeft;
		obj = obj.offsetParent;
	}
	return toreturn;
}

// End AutoComplete object //