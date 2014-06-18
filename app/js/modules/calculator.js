"use strict";
var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  App = require('../app'),
  DesktopLayout = require('../views/desktop-layout'),
  HeaderView = require('../views/header-view'),
  FooterView = require('../views/footer-view'),
  MenuView = require('../views/menu-view');

module.exports = App.module('Calc', function(Calc) {
  // Calculator must be manually started
  Calc.startWithParent = false;
  var Router = Marionette.AppRouter.extend({
    appRoutes: {
        ':categories/:calculator/test': 'test',
    }
  }); 

  var Controller = Marionette.Controller.extend({
    loadNextView: function() {
      console.log('Calc.controller loadNextView');
    },
    loadPrevView: function() {
      console.log('Calc.controller loadPrevView');
    },
    // When the module starts, we need to make sure we have
    // the correct view showing
    show: function(calcModel) {
      var desktopLayout = new DesktopLayout();
      App.body.show(desktopLayout);
      desktopLayout.headerRegion.show(new HeaderView({model: calcModel}));
      desktopLayout.menuRegion.show(new MenuView({model: calcModel}));
      desktopLayout.footerRegion.show(new FooterView({model: calcModel}));
    },
    // When the module stops, we need to clean up our views
    hide: function() {
      App.body.close();
      this.data = this.view = null;
    },
    test: function() {
      this._ensureAppModuleIsRunning();
    },
    // Makes sure that this subapp is running so that we can
    // perform everything we need to
    _ensureAppModuleIsRunning: function() {
        App.execute('appModule:start', 'Calc');
    }
  }); 
  var controller = new Controller();
  var router = new Router({controller: controller});

  Calc.addInitializer(function(options){
    console.log('Calc.addInitializer');
    var calcModel = new Backbone.Model(options);
    
    controller.show(calcModel);
    
    App.vent.on('next', function() {
      controller.loadNextView();
    });
    
    App.vent.on('prev', function() {
      controller.loadPrevView();
    });
  });

  Calc.on('start', function(options) {
  });

  Calc.addFinalizer(function(){
      controller.hide();
      Calc.stopListening();
  }); 


});


    // var MenuItemModel = Backbone.Model.extend({});
    // var MenuItemsCollection = Backbone.Collection.extend({model: MenuItem});
    // var menuItems = new MenuItemsCollection([
    //   { name: 'Wet Cat' },
    //   { name: 'Bitey Cat' },
    //   { name: 'Surprised Cat' }
    // ]);
    // var MenuItemsViewObj = require('./views/angry-cats-view');
    // var menuItemsView = new MenuItemsViewObj({
    //   collection: menuItems
    // });
    // desktopLayout.menuRegion.show(menuItemsView);
