evtCalcViews = (function() {
  var views = {};
  views.travel = (function() {
    var defaultView = require('../views/evt-travel-views').default
    , flightAverageView = require('../views/evt-travel-views').flightAverage
    , flightLengthView = require('../views/evt-travel-views').flightLength
    , groundView = require('../views/evt-travel-views').ground
    , hotelView = require('../views/evt-travel-views').hotel;
    return [
      {name: 'default',  view: new defaultView()},
      {name: 'flightAverage',  view: new flightAverageView()}, 
      {name: 'flightLength',  view: new flightLengthView()}, 
      {name: 'ground',  view: new groundView()}, 
      {name: 'hotel',  view: new hotelView()}
    ];
  }());

  views.venue = (function() {
    var defaultView = require('../views/evt-venue-views').default;
    return [
      {name: 'default',  view: new defaultView()}
    ];
  }());

  views.water = (function() {
    var defaultView = require('../views/evt-water-views').default;
    return [
      {name: 'default',  view: new defaultView()}
    ];
  }());

  views.meals = (function() {
    var defaultView = require('../views/evt-meals-views').default;
    return [
      {name: 'default',  view: new defaultView()}
    ];
  }());

  return views;
}());

module.exports = evtCalcViews;