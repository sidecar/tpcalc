'use strict';
var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app')
, Typeahead = require('../../utils/typeahead-modified')
, utils = require('../../utils/utility');

var flightsTemplate = require('../../templates/individual/ind-travel-flights-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: flightsTemplate,
  ui: {
    roundTrip: '[name="round_trip"]',
    to: '[name="to"]',
    from: '[name="from"]'
  },
  onShow: function() {
    var self = this;
    self.utils = utils;

    self.flight = self.category.get("currentFlight") || undefined;

    if(self.flight === undefined) {
      var Flight = require('../../models/air-travel-models').flight
      self.category.set({currentFlight: new Flight()});
      self.flight = self.category.get('currentFlight');
    } else {
      var from = self.flight.get('from'); 
      var to = self.flight.get('to'); 
      self.modelBinder = new Databinding.ModelBinder(this, self.flight);
      if(from && from.length > 0) {
        self.modelBinder.watch('value: from', {selector: '[name="from"]'});   
      }
      if(to && to.length > 0) {
        self.modelBinder.watch('value: to', {selector: '[name="to"]'});   
      }
    }

    this.flight.validate = function(attrs, options) {
      if(!attrs.from || attrs.from === '') {
        self.displayError(self.ui.from);
        return false;
      } else {
        self.displaySuccess(self.ui.from);
      }

      if(!attrs.to || attrs.to === '') {
        self.displayError(self.ui.to);
        return false;
      } else {
        self.displaySuccess(self.ui.to);
      }

      return true;
    }  

    var airports = require('../../utils/airports');

    //modified from NPM module panther
    function searchJSON(callback, searchTerm, inputArray) {
      var arrayOfMatches = [];
      for (var e = 0; e < inputArray.length; e++) {
        
        // convert the object to an array so that a for loop can be used
        var tempArray = [];
        for (var y in inputArray[e]) {
          if(inputArray[e].hasOwnProperty(y)) {
            tempArray.push(inputArray[e][y]);
          }
        } // end for in loop

        for(var l = 0; l < tempArray.length; l++ ) {
          if(typeof tempArray[l] === 'string'){
            // t will be an int indicating the position of the search term if it exists in th search
            var posOfSearchTerm = tempArray[l].toLowerCase().replace(/\s+/g, '').indexOf(searchTerm.toLowerCase().replace(/\s+/g, ''));
            if (posOfSearchTerm !== -1) {
              //if a match is found, add it to the matches array and don't look at other members of the temp array to avoid adding the same object twice to the final array of matches
              arrayOfMatches.push(inputArray[e]);
              break;
            } 
          }          
        } // end for loop

      } // end for loop
      if (arrayOfMatches.length > 0) {
        callback(null, arrayOfMatches);
      } else {
        callback(new Error("No item found"));
      } 
    }

    function typeAheadCallback(query, result, noMatchesFoundCallback) {
      searchJSON(function(err, arrayOfMatches) {
        if (err) {
            noMatchesFoundCallback();
            return err;
        } else {
          var resultsArray = _.map(arrayOfMatches, function(obj) {
            var countryOrState = (obj.country === 'United States') ? obj.state : obj.country ;
            var city = obj.city;
            var icaoOrBlank = (obj.icao && obj.icao !== '\\N') ? ' ('+obj.icao+')' : '';
            var symbol = (obj.iata) ?  ' ('+obj.iata+')' : icaoOrBlank;
            obj.displayString = obj.name + symbol + ', ' + city;
            return obj;
          });
          result(resultsArray);
        }
      }, query, airports);
    }

    var fromInput = this.ui.from.get(0);
    var typeAheadFrom = Typeahead(fromInput , {
      source: function(query, result, noMatchesFoundCallback) { typeAheadCallback(query, result, noMatchesFoundCallback); }
    });

    var toInput = this.ui.to.get(0);
    var typeAheadTo = Typeahead(toInput , {
      source: function(query, result, noMatchesFoundCallback) { typeAheadCallback(query, result, noMatchesFoundCallback); }
    });

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
    function getSymbol(obj) {
      if(obj.iata) return obj.iata;
      if(obj.icao && obj.icao.indexOf("\N") === -1 ) return obj.icao;
      return obj.city;
    }

    if(this.flight.validate({from: this.ui.from.val(), to: this.ui.to.val() })) {
      var from = JSON.parse(this.ui.from.attr('data-object'));
      var to = JSON.parse(this.ui.to.attr('data-object'));
      var fromLatitude = from.latitude;
      var fromLongitude = from.longitude;    
      var toLatitude = to.latitude;
      var toLongitude = to.longitude;
      var fromIATA = getSymbol(from);
      var toIATA = getSymbol(to);
      var attrs = {
        roundTrip: $('[name="round_trip"]:checked').val(),
        fromLatitude: fromLatitude, 
        fromLongitude: fromLongitude, 
        toLatitude: toLatitude, 
        toLongitude: toLongitude,
        fromIATA: fromIATA,
        toIATA: toIATA 
      }
      this.flight.set(attrs);
      this.flight.calculateDistance();
      App.vent.trigger('showInputView', 'list');
    }
  }
});