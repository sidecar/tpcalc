individual = {};
  individual.vehicle = (function() {
    var defaultView = require('../views/ind-vehicle-views').default
    , carView = require('../views/ind-vehicle-views').car
    , ecarView = require('../views/ind-vehicle-views').ecar
    , boatView = require('../views/ind-vehicle-views').boat
    , motorcycleView = require('../views/ind-vehicle-views').motorcycle
    , classView = require('../views/ind-vehicle-views').class
    , optionsView = require('../views/ind-vehicle-views').options
    , listView = require('../views/ind-vehicle-views').list;
    return{
      displayName: 'Vehicle',
      slug: 'vehicle',
      icon: '',
      views: [
        {name: 'default',  view: new defaultView()},
        {name: 'car',  view: new carView()}, 
        {name: 'ecar',  view: new ecarView()}, 
        {name: 'boat',  view: new boatView()}, 
        {name: 'class',  view: new classView()}, 
        {name: 'options',  view: new optionsView()},
        {name: 'list',  view: new listView()}
      ]
    } 
  }());

  individual.transit = (function() {
    var defaultView = require('../views/ind-transit-views').default;
    return {
      displayName: 'Public Transortation',
      slug: 'transit',
      icon: '', 
      views: [
        {name: 'default',  view: new defaultView()}
      ]
    };
  }());

  individual.travel = (function() {
    var defaultView = require('../views/ind-travel-views').default
    , addView = require('../views/ind-travel-views').add
    , averageView = require('../views/ind-travel-views').average
    , listView = require('../views/ind-travel-views').list;
    return {
      displayName: 'Air Travel',
      slug: 'travel',
      icon: '', 
      views: [
        {name: 'default',  view: new defaultView()}, 
        {name: 'add',  view: new addView()}, 
        {name: 'average',  view: new averageView()}, 
        {name: 'list',  view: new listView()}
      ]
    };
  }());

  individual.home = (function() {
    var defaultView = require('../views/ind-home-views').default
    , addView = require('../views/ind-home-views').add;
    return {
      displayName: 'Home Energy',
      slug: 'home',
      icon: '', 
      views: [
        {name: 'default',  view: new defaultView()}, 
        {name: 'add',  view: new addView()}
      ]
    }
  }());

module.exports = individual;