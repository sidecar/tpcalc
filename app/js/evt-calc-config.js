events = {};
  events.displayName = 'Events';
  events.slug = 'events';

  var thankYouView = require('./views/evt-thankyou-view');
  individual.thankYouView = new thankYouView();

  var travel = (function() {
    var defaultView = require('./views/evt-travel-views').default
    , flightAverageView = require('./views/evt-travel-views').flightAverage
    , flightLengthView = require('./views/evt-travel-views').flightLength
    , groundView = require('./views/evt-travel-views').ground
    , hotelView = require('./views/evt-travel-views').hotel;
    return {
      displayName: 'Vehicle',
      slug: 'vehicle',
      icon: '',
      views: [
        {name: 'default',  view: new defaultView()},
        {name: 'flightAverage',  view: new flightAverageView()}, 
        {name: 'flightLength',  view: new flightLengthView()}, 
        {name: 'ground',  view: new groundView()}, 
        {name: 'hotel',  view: new hotelView()}
      ]
    } 
  }());

  var venue = (function() {
    var defaultView = require('./views/evt-venue-views').default;
    return {
      displayName: 'Venue',
      slug: 'venue',
      icon: '',
      views: [
        {name: 'default',  view: new defaultView()}
      ]
    }
  }());

  var water = (function() {
    var defaultView = require('./views/evt-water-views').default;
    return {
      displayName: 'Water',
      slug: 'water',
      icon: '',
      views: [
        {name: 'default',  view: new defaultView()}
      ]
    }
  }());

  var meals = (function() {
    var defaultView = require('./views/evt-meals-views').default;
    return {
      displayName: 'Meals',
      slug: 'meals',
      icon: '',
      views: [
        {name: 'default',  view: new defaultView()}
      ]
    }
  }());

  events.categories = [travel, venue, water, meals];

module.exports = events;
