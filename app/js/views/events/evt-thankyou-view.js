'use strict';
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app')
, numeral = require('numeral')
, isEmail = require('sane-email-validation');

var template = require('../../templates/events/evt-thankyou-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: template,
  events : {
    'blur input[name="email"]': 'validateEmail',
    'click #send-results-btn': 'submitData'
  },
  ui: {
    emailInput: 'input[name="email"]'
  },
  validateEmail: function(event) {
    var $target = $(event.target)
    , email = $target.val();
    if(isEmail(email)) {
      this.displaySuccess($target);
      return true;
    } else {
      this.displayError($target);
      return false;
    }
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
    return;
  },
  submitData: function() {
    var self = this;
    var email = this.ui.emailInput.val();
    if(isEmail(email)) {
      this.displaySuccess(this.ui.emailInput);
      var trees = numeral(this.model.get('totalEmissions')/0.039).format('0,0');
      var categories = this.model.get('categories')
      , travel = categories.findWhere({slug: 'travel'})
      , venue = categories.findWhere({slug: 'venue'})
      , water = categories.findWhere({slug: 'water'})
      , meals = categories.findWhere({slug: 'meals'});

      var email = this.ui.emailInput.val();
      var url = '/result/events';
      var data = {
        travelAttendees: travel.get('attendees'),
        travelAverageEmissions: travel.get('averageEmissions'),
        travelBusAttendees: travel.get('busAttendees'),
        travelBusMileage: travel.get('busMileage'),
        travelCarAttendees: travel.get('carAttendees'),
        travelCarMileage: travel.get('carMileage'),
        travelFerryAttendees: travel.get('ferryAttendees'),
        travelFerryMileage: travel.get('ferryMileage'),
        travelGroundEmissions: travel.get('groundEmissions'),
        travelHotelEmissions: travel.get('hotelEmissions'),
        travelLengthEmissions: travel.get('lengthEmissions'),
        travelLongFlights: travel.get('longFlights'),
        travelMedFlights: travel.get('medFlights'),
        travelMethod: travel.get('method'),
        travelNights: travel.get('nights'),
        travelShortFlights: travel.get('shortFlights'),
        travelTaxiAttendees: travel.get('taxiAttendees'),
        travelTaxiMileage: travel.get('taxiMileage'),
        travelTrainAttendees: travel.get('trainAttendees'),
        travelTrainMileage: travel.get('trainMileage'),
        travelUseRFI: travel.get('useRFI'),
        travelTotalEmissions: numeral(travel.get('totalEmissions')).format('0.00'),
        venueDays: venue.get('days'),
        venueVenueSize: venue.get('venueSize'),
        venueZipCode: venue.get('zipCode'),
        venueTotalEmissions: numeral(venue.get('totalEmissions')).format('0.00'),
        waterBottles: water.get('bottles'),
        waterTotalEmissions: numeral(water.get('totalEmissions')).format('0.00'),
        mealsNumMeals: meals.get('numMeals'),
        mealsPercentVeg: meals.get('percentVeg'),
        mealsTotalEmissions: numeral(meals.get('totalEmissions')).format('0.00'),
        trees: trees,
        email: encodeURIComponent(email)
      };

      $.ajax({
        url: url,
        data: data,
        success: function() { 
          $('.send-results').hide(500, function() {$('#thankyou-message').show(300)});
        }
      });

    } else {
      this.displayError(this.ui.emailInput);
    }
  }
});
