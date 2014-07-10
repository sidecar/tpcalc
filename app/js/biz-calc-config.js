business = {};
  business.displayName = 'Business';
  business.slug = 'business';

  var thankYouView = require('./views/biz-thankyou-view');
  business.thankYouView = new thankYouView();

  var site = (function() {
    var defaultView = require('./views/biz-site-views').default
    , energyView = require('./views/biz-site-views').energy;
    return {
      displayName: 'Site',
      slug: 'site',
      icon: '',
      views: [
        {name: 'default',  view: new defaultView()},
        {name: 'energy',  view: new energyView()}
      ]
    } 
  }());

  var fleet = (function() {
    var defaultView = require('./views/biz-fleet-views').default
    , carView = require('./views/biz-fleet-views').car
    , ecarView = require('./views/biz-fleet-views').ecar
    , boatView = require('./views/biz-fleet-views').boat
    , planeView = require('./views/biz-fleet-views').plane
    , listView = require('./views/biz-fleet-views').list;
    return {
      displayName: 'Fleet',
      slug: 'fleet',
      icon: '',
      views: [
        {name: 'default',  view: new defaultView()},
        {name: 'car',  view: new carView()},
        {name: 'ecar',  view: new ecarView()},
        {name: 'boat',  view: new boatView()},
        {name: 'plane',  view: new planeView()},
        {name: 'list',  view: new listView()}
      ]
    } 
  }());

  var travel = (function() {
    var defaultView = require('./views/biz-travel-views').default
    , employeeView = require('./views/biz-travel-views').employee
    , milesView = require('./views/biz-travel-views').miles;
    return {
      displayName: 'Air Travel',
      slug: 'travel',
      icon: '',
      views: [
        {name: 'default',  view: new defaultView()}, 
        {name: 'employee',  view: new employeeView()}, 
        {name: 'miles',  view: new milesView()}
      ]
    } 
  }());

  var commute = (function() {
    var defaultView = require('./views/biz-commute-views').default;
    return {
      displayName: 'Commute',
      slug: 'commute',
      icon: '',
      views: [
        {name: 'default',  view: new defaultView()}
      ]
    } 
  }());

  var shipping = (function() {
    var defaultView = require('./views/biz-shipping-views').default;
    return {
      displayName: 'Shipping',
      slug: 'shipping',
      icon: '',
      views: [
        {name: 'default',  view: new defaultView()}
      ]
    } 
  }());

  var server = (function() {
    var defaultView = require('./views/biz-server-views').default;
    return {
      displayName: 'Server',
      slug: 'server',
      icon: '',
      views: [
        {name: 'default',  view: new defaultView()}
      ]
    } 
  }());

  business.categories = [site, fleet, travel, commute, shipping, server];

module.exports = business;