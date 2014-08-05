'use strict';
var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app')
, Typeahead = require('typeahead')
, utils = require('../utils/utility')
, icao = require('icao')
, Distance = require('geo-distance');

var flightsTemplate = require('../templates/ind-travel-flights-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: flightsTemplate,
  ui: {
    roundTrip: '[name="round_trip"]',
    to: '[name="to"]',
    from: '[name="from"]'
  },
  onShow: function() {

    console.log(icao['KOAK']);

    var self = this;
    self.utils = utils;

    var currentFlight = self.flight = self.category.get("currentFlight") || undefined;

    if(typeof(currentFlight) == 'undefined') {
      var Flight = require('../models/air-travel-models').flight
      self.category.set({currentFlight: new Flight()});
      self.flight = self.category.get('currentFlight');
    } else {
      self.modelBinder = new Databinding.ModelBinder(this, self.flight);
      self.modelBinder.watch('checked: roundTrip', {selector: '[name="round_trip"]'});
      self.modelBinder.watch('value: to', {selector: '[name="to"]'});    
      self.modelBinder.watch('value: from', {selector: '[name="from"]'});   
    }

    this.flight.validate = function(attrs, options) {

      if(!attrs.from || attrs.from == '') {
        self.displayError(self.ui.from);
        return false;
      } else {
        self.displaySuccess(self.ui.from);
      }

      if(!attrs.to || attrs.to == '') {
        self.displayError(self.ui.to);
        return false;
      } else {
        self.displaySuccess(self.ui.to);
      }

      return true;
    }  

    var fromInput = this.ui.from.get(0);

    var taFrom = Typeahead(fromInput , {
      source: function(query, result) {
        var that = self;
        that.utils.getJSON('/airport/'+query , function(response) {
          if(typeof response === 'string') return;
          var resultsArray = _.map(response, function(obj) {
            return obj.code +' | '+ obj.name;
          });
          result(resultsArray);
        }); 
      }
    });

    var toInput = this.ui.to.get(0);
    
    var taTo = Typeahead(toInput , {
      source: function(query, result) {
        var that = self;
        that.utils.getJSON('/airport/'+query , function(response) {
          if(typeof response === 'string') return;
          var resultsArray = _.map(response, function(obj) {
            return obj.code +' | '+ obj.name;
          });
          result(resultsArray);
        }); 
      }
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


    // var fromIACA = this.ui.from.val().slice(0,4)
    // , toIACA = this.ui.to.val().slice(0,4);
    //, fromCoords = icao[fromIACA]
    //, toCoords = icao[toIACA]
    //, fromLonLat = { lon: fromCoords[1], lat: fromCoords[0] } 
    //, toLonLat = { lon: toCoords[1], lat: toCoords[0] } 
    //, distance = Distance.between(fromLonLat, toLonLat);


    var attrs = {
      roundTrip: $('[name="round_trip"]:checked').val(),
      from: this.ui.from.val(),
      to: this.ui.to.val()
    }
    if(this.flight.validate(attrs)) {
      this.flight.set(attrs);
      console.log('this.flight just got set:');
      console.log(this.flight);
      App.vent.trigger('showInputView', 'list');
    }
  }
});