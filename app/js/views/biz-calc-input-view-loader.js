bizCalcViews = (function() {
  var views = {};
  views.site = (function() {
    var defaultView = require('../views/biz-site-views').default
    , energyView = require('../views/biz-site-views').energy;
    return [
      {name: 'default',  view: new defaultView()},
      {name: 'energy',  view: new energyView()}
    ];
  }());

  views.fleet = (function() {
    var defaultView = require('../views/biz-fleet-views').default
    , carView = require('../views/biz-fleet-views').car
    , ecarView = require('../views/biz-fleet-views').ecar
    , boatView = require('../views/biz-fleet-views').boat
    , planeView = require('../views/biz-fleet-views').plane
    , listView = require('../views/biz-fleet-views').list;
    return [
      {name: 'default',  view: new defaultView()},
      {name: 'car',  view: new carView()},
      {name: 'ecar',  view: new ecarView()},
      {name: 'boat',  view: new boatView()},
      {name: 'list',  view: new listView()}
    ];
  }());

  views.travel = (function() {
    var defaultView = require('../views/biz-travel-views').default
    , employeeView = require('../views/biz-travel-views').employee
    , milesView = require('../views/biz-travel-views').miles;
    return [
      {name: 'default',  view: new defaultView()}, 
      {name: 'employee',  view: new employeeView()}, 
      {name: 'miles',  view: new milesView()}
    ];
  }());

  views.commute = (function() {
    var defaultView = require('../views/biz-commute-views').default;
    return [
      {name: 'default',  view: new defaultView()}
    ];
  }());

  views.shipping = (function() {
    var defaultView = require('../views/biz-shipping-views').default;
    return [
      {name: 'default',  view: new defaultView()}
    ];
  }());

  views.server = (function() {
    var defaultView = require('../views/biz-server-views').default;
    return [
      {name: 'default',  view: new defaultView()}
    ];
  }());
  
  return views;
}());

module.exports = bizCalcViews;