'use strict';
var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../../app')
, Typeahead = require('typeahead')
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
      //console.log('validate');
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
        }

        for(var l = 0; l < tempArray.length; l++ ) {
          if(typeof tempArray[l] === 'string'){
            // t will be an int indicating the position of the search term if it exists in th search
            var t = tempArray[l].toLowerCase().replace(/\s+/g, '').indexOf(searchTerm.toLowerCase().replace(/\s+/g, ''));
            if (t !== -1) {
              //if a match is found, add it to the matches array and don't look at other members of the temp array to avoid adding the same object twice to the final array of matches
              arrayOfMatches.push(inputArray[e]);
              break;
            } 
          }          
        }

      } //end for in
      if (arrayOfMatches.length > 0) {
        callback(null, arrayOfMatches);
      } else {
        callback(new Error("No item found"));
      } 
    }

    function typeAheadCallback(query, result) {
      var that = self;
      searchJSON(function(err, items) {
        if (err) {
          //console.log(err);
        } else {
          var resultsArray = _.map(items, function(obj) {
            return obj.iata +' - '+ obj.name;
          });
          result(resultsArray);
        }
      }, query, airports);
    }


    var fromInput = this.ui.from.get(0);
    var typeAheadFrom = Typeahead(fromInput , {
      source: function(query, result) { typeAheadCallback(query, result); }
    });

    var toInput = this.ui.to.get(0);
    var typeAheadTo = Typeahead(toInput , {
      source: function(query, result) { typeAheadCallback(query, result); }
    });

  },
  displaySuccess: function($elem) {
    //console.log('displaySuccess');
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
      roundTrip: $('[name="round_trip"]:checked').val(),
      from: this.ui.from.val(),
      to: this.ui.to.val()
    }
    if(this.flight.validate(attrs)) {
      this.flight.set(attrs);
      this.flight.calculateDistance();
      App.vent.trigger('showInputView', 'list');
    }
  }
});