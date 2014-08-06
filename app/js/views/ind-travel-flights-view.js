'use strict';
var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app')
, Typeahead = require('typeahead')
, utils = require('../utils/utility');

var flightsTemplate = require('../templates/ind-travel-flights-template.hbs');

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
      var Flight = require('../models/air-travel-models').flight
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
      console.log('validate');
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

    var airports = require('../utils/airports');

    //modified from NPM module panther
    function searchJSON(callback, searchTerm, inputArray) {
      var arrayOfMatches = [];
      for (var e in inputArray) {
        (function(i) {
          for (var y in inputArray[i]) {
            if(typeof inputArray[e][y] === 'string'){
              var t = inputArray[e][y].toLowerCase().replace(/\s+/g, '').indexOf(searchTerm.toLowerCase().replace(/\s+/g, ''));
              if (t !== -1) {
                arrayOfMatches.push(inputArray[e]);
              } else {
                
              }
            }
          }
        })(e)
      }
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
            return obj.iata +' | '+ obj.name;
          });
          result(resultsArray);
        }
      }, query, airports);
    }


    var fromInput = this.ui.from.get(0);
    var taFrom = Typeahead(fromInput , {
      source: function(query, result) { typeAheadCallback(query, result); }
    });

    var toInput = this.ui.to.get(0);
    var taTo = Typeahead(toInput , {
      source: function(query, result) { typeAheadCallback(query, result); }
    });

  },
  displaySuccess: function($elem) {
    console.log('displaySuccess');
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