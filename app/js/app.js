'use strict';
// For some reason have to make jquery available
var $ = require('jquery')
  //why DON'T I need this ?!?
  //_ = require('underscore'),
, Backbone = require('backbone')
, Marionette = require('backbone.marionette');
// Have to assign the $ symbol in Marionette and Backbone to jquery
Marionette.$ = Backbone.$ = $;

var App = new Marionette.Application();

function isMobile() {
  var ua = (navigator.userAgent || navigator.vendor || window.opera, window, window.document);
  //console.log("Success...Useragent=="+ua);
  return (/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
}
App.mobile = isMobile();

App.addInitializer(function(options) {
  console.log('App.addInitializer');
  var calcModule = require('./calculator');
  var ModuleManager = require('./utils/module-manager');
  var modManager = new ModuleManager();
  App.commands.setHandler('appModule:start', modManager.startAppModule, modManager);
  App.commands.setHandler('appModule:stop', modManager.stopAppModule, modManager);
  // Set up a controller for the router to use
  var Controller = require('./router').controller;
  App.controller = new Controller();
  // Add the router to the app and app it the controller
  var Router = require('./router').router;
  App.router = new Router({controller: App.controller});
});

App.addRegions({
  body: 'body'
});

//may need to be on 'initialize:after'
App.on('start', function(options) {
  console.log('App.on start');
  if (Backbone.history) {
    Backbone.history.start();
  }
})

module.exports = App;


// App.addInitializer(function(options){
//   var MenuItemModel = Backbone.Model.extend({});
//   var MenuItemsCollection = Backbone.Collection.extend({model: MenuItem});
//   var menuItems = new MenuItemsCollection([
//     { name: 'Wet Cat' },
//     { name: 'Bitey Cat' },
//     { name: 'Surprised Cat' }
//   ]);
//   var MenuItemsViewObj = require('./views/angry-cats-view');
//   var menuItemsView = new MenuItemsViewObj({
//     collection: menuItems
//   });
//   desktopLayout.menuRegion.show(menuItemsView);
// });

// App.on("initialize:before", function(options){ 
//  console.log('initialize:before was called');
// });

// App.on("initialize:after", function(options){ 
//  console.log('initialize:after was called');
// });

//////////////////////////
// Individual Carbaon Calc
//////////////////////////
// App.module("IND", function(IND, App, Backbone, Marionette, $, _){
//   IND.startWithParent = false;
//   var myData = "this is private data";
//   var myFunction = function(){
//     console.log(myData);
//   }
//   // Public Data And Functions
//   // -------------------------
//   IND.someData = "public data";
//   IND.someFunction = function(){
//     console.log(IND.someData);
//   }
// });

//////////////////////////
// Business Carbon Calc
//////////////////////////
// App.module("BIZ", function(BIZ, App, Backbone, Marionette, $, _){
//   BIZ.startWithParent = false;
// });

//////////////////////////
// Event Carbon Calc
//////////////////////////
// App.module("EVT", function(EVT, App, Backbone, Marionette, $, _){
//   EVT.startWithParent = false;
// });


