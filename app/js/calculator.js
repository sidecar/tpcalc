'use strict';
var _ = require('underscore') 
  , $ = require('jquery')
  , Backbone = require('backbone')
  , Marionette = require('backbone.marionette')
  , App = require('./app');

module.exports = App.calculator =  App.module('individual', function(Calc) {

  // Calculator must be manually started
  Calc.startWithParent = false;

  // var Controller = require('./router').controller;
  // var Router = require('./router').router;
  // Calc.controller = new Controller();
  // Calc.router = new Router({controller: Calc.controller});

  Calc.initCalcModel = function() {
    var calcModel = this.model;
    calcModel.set({currentCategory: calcModel.get('categories').first()});
  }
  
  Calc.addInitializer(function(calculator){
    Calc.baseRoute = '#/individual';
    //Calc.initModels(options);
    Calc.model = require('./ind-calc-model');
    Calc.initCalcModel();
    Calc.initCalcLayout = require('./init-calc-layout');
    Calc.initCalcLayout(Calc);
    Calc.initGlobalEvents = require('./init-global-calc-events');
    Calc.initGlobalEvents(Calc);
    Calc.initRouter = require('./init-calc-router');
    Calc.initRouter(Calc);
  });

  Calc.on('start', function(options) {
    //console.log(options.slug + 'Calc  started');
  });

  Calc.addFinalizer(function(){
    Calc.controller.hide();
    Calc.stopListening();
  });

}); //end App.module Calc

  // Calc.initModels = function(options) {
    
  //   var Calculator = Backbone.Model.extend({      
  //     getCategoryBySlug: function(slug) {
  //       var categories = this.get('categories')
  //       , category = categories.findWhere({slug: slug});
  //       return category;
  //     },
  //     getViewModelBySlug: function(slug) {
  //       var currentCategory = this.get('currentCategory')
  //       , views = currentCategory.get('viewList')
  //       , view = views.findWhere({name: slug});
  //       return view;
  //     }
  //   });

  //   var Category = Backbone.Model.extend({      
  //     getCurrentInputView: function() {
  //       var views = this.get('viewList');
  //       if(this.get('currentInputView') === undefined) {
  //         return views.first();
  //       } else {
  //         return this.get('currentInputView')
  //       }
  //     }
  //   });

  //   var Categories = Backbone.Collection.extend({      
  //     model: Category
  //   });

  //   var ViewModel = Backbone.Model;
  //   var ViewList = Backbone.Collection.extend({
  //     model: ViewModel
  //   });

  //   /////////////////////////////////////////////
  //   var calcModel = Calc.model = new Calculator({
  //     displayName: options.displayName, 
  //     slug: options.slug,
  //     thankYouView: options.thankYouView
  //   });

  //   var categories = Calc.categories = new Categories();

  //   _.each(options.categories, function(category) {
  //     var viewList = new ViewList();
      
  //     // new instances of ViewModel model for each view associated with the category
  //     _.each(category.views, function(view) {
  //       var viewModel = new ViewModel({
  //         name: view.name,
  //         view: view.view
  //       });
  //       // add each ViewModel the collection of ViewModels that is set on the Category model
  //       viewList.add(viewModel);
  //     });

  //     // new instance of the Category model
  //     var category = new Category({
  //       displayName: category.displayName,
  //       slug: category.slug,
  //       views: category.views,
  //       // add the collection of ViewModel models
  //       viewList: viewList,
  //       currentInputView: viewList.first(),
  //       calculator: Calc.model.get('slug'),
  //       completed: false
  //     });
  //     // add the Category instance to the collectin of catgories set on the Calculator model
  //     categories.add(category);
  //   });

  //   calcModel.set({categories: categories});
  //   calcModel.set({currentCategory: categories.first()}); 

  // };//end Calc.initModels