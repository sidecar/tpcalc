var views = {
  individual: {},
  business: {},
  events: {}
}

views.individual = (function() {
  var views = {};
  views.vehicle = (function() {
    var defaultView = require('../views/ind-vehicle-views').default;
    var carView = require('../views/ind-vehicle-views').car;
    var ecarView = require('../views/ind-vehicle-views').ecar;
    var boatView = require('../views/ind-vehicle-views').boat;
    var motorcycleView = require('../views/ind-vehicle-views').motorcycle;
    var classView = require('../views/ind-vehicle-views').class;
    var optionsView = require('../views/ind-vehicle-views').options;
    return [
      {name: 'default',  view: new defaultView()},
      {name: 'car',  view: new carView()}, 
      {name: 'ecar',  view: new ecarView()}, 
      {name: 'boat',  view: new boatView()}, 
      {name: 'class',  view: new classView()}, 
      {name: 'options',  view: new optionsView()}
    ];
  }());
  views.transport = (function() {
    var defaultView = require('../views/ind-transport-views').default;
    return [
      {name: 'default',  view: new defaultView()}
    ];
  }());
  views.air = (function() {
    var defaultView = require('../views/ind-air-views').default;
    var addView = require('../views/ind-air-views').add;
    var averageView = require('../views/ind-air-views').average;
    var listView = require('../views/ind-air-views').list;
    return [
      {name: 'default',  view: new defaultView()}, 
      {name: 'add',  view: new addView()}, 
      {name: 'average',  view: new averageView()}, 
      {name: 'list',  view: new listView()}
    ];
  }());
  views.home = (function() {
    var defaultView = require('../views/ind-home-views').default;
    var addView = require('../views/ind-home-views').add;
    return [
      {name: 'default',  view: new defaultView()}, 
      {name: 'add',  view: new addView()}
    ];
  }());
  return views;
}());
views.business = (function() {
  var views = {};
  return views;
}());
views.events = (function() {
  var views = {};
  return views;
}());

module.exports = views;