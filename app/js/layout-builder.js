'use strict';
var App = require('./app');

var MainLayout = require('./views/main-layout')
  , HeaderView = require('./views/header-view')
  , FooterView = require('./views/footer-view')
  , CategoriesMenuView = require('./views/categories-menu-view')
  , CategoryIconView = require('./views/category-icon-view')
  , SummaryLayout = require('./views/summary-layout')
  , HelpView = require('./views/help-view')
  , GraphView = require('./views/graph-view')
  , EmissionsView = require('./views/emissions-view');

module.exports = function() {
  var calcModel = this.model
  , currentCategory = calcModel.get('currentCategory')
  , inputViewModel = currentCategory.getCurrentInputView();

  // instantiate views
  var mainLayout = this.mainLayout = new MainLayout();  
  var categoriesMenuView = this.categoriesMenuView = new CategoriesMenuView({
    collection: calcModel.get('categories'), 
    itemView: CategoryIconView
  });
  var headerView = this.headerView = new HeaderView({model: calcModel});
  var helpView = this.helpView = new HelpView({model: calcModel});
  var footerView = this.footerView = new FooterView({model: calcModel});

  // Set up main layout
  App.body.show(mainLayout); // have to call show on a layout before it can do anything else
  mainLayout.headerRegion.show(headerView);
  mainLayout.helpRegion.show(helpView);
  mainLayout.footerRegion.show(footerView);
  mainLayout.menuRegion.show(categoriesMenuView);
  mainLayout.inputRegion.show(inputViewModel.get('view'));

  // Set up the summary layout
  var summaryLayout = this.summaryLayout = new SummaryLayout({model: calcModel});

  var graphView = this.graphView = new GraphView({
    model: calcModel,
    collection: this.categories 
  });

  var emissionsView = this.emissionsView = new EmissionsView({
    model: calcModel,
    collection: this.categories 
  });

  mainLayout.summaryRegion.show(summaryLayout);
  summaryLayout.graphsRegion.show(graphView); 
  summaryLayout.emissionsRegion.show(emissionsView); 

  // Additional layout setup
  this.controller.setFooterButtonStates(inputViewModel.get('name'));

};


