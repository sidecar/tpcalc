'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, Databinding = require('backbone.databinding')
, App = require('../app');

var flightsTemplate = require('../templates/ind-travel-flights-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: flightsTemplate,
  onShow: function() {
    var self = this;

    var currentFlight = this.flight = this.category.get("currentFlight");

    this.flight.validate = function(attrs, options) {
      if(!attrs.to || attrs.to == '') {
        self.displayError(self.ui.toInput);
        return false;
      } else {
        self.displaySuccess(self.ui.toInput);
      }

      if(!attrs.from || attrs.from == '') {
        self.displayError(self.ui.fromInput);
        return false;
      } else {
        self.displaySuccess(self.ui.fromInput);
      }

      return true;
    }

    this.modelBinder = new Databinding.ModelBinder(this, this.category);

    var oneWayOrRoundTrip = currentFlight.get('oneWayOrRoundTrip') || undefined
    , to = currentFlight.get('to') || undefined;
    , from = currentFlight.get('from') || undefined;
    
    if(oneWayOrRoundTrip) this.modelBinder.watch('checked: oneWayOrRoundTrip', {selector: '[name="one_way_or_round_trip"]'});
    if(to) this.modelBinder.watch('value: to', {selector: '[name="to"]'});    
    if(from) this.modelBinder.watch('value: from', {selector: '[name="from"]'});    
  },
  getNextInputView: function() {
    this.category.flights.add({
      oneWayOrRoundTrip: $('[name="oneWayOrRoundTrip"]:checked').val(),
    })
    App.vent.trigger('showInputView', 'list');
  }
});