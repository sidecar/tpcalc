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

module.exports = function(Calc) {
  var calcModel = Calc.model
  , currentCategory = calcModel.get('currentCategory')
  , inputViewModel = currentCategory.getCurrentInputView();

  // instantiate views
  var mainLayout = Calc.mainLayout = new MainLayout();  
  var categoriesMenuView = Calc.categoriesMenuView = new CategoriesMenuView({
    collection: calcModel.get('categories'), 
    itemView: CategoryIconView
  });
  var headerView = Calc.headerView = new HeaderView({model: calcModel});
  var helpView = Calc.helpView = new HelpView({model: calcModel});
  var footerView = Calc.footerView = new FooterView({model: calcModel});

  // Set up main layout
  App.body.show(mainLayout); // have to call show on a layout before it can do anything else
  mainLayout.headerRegion.show(headerView);
  mainLayout.helpRegion.show(helpView);
  mainLayout.footerRegion.show(footerView);
  mainLayout.menuRegion.show(categoriesMenuView);
  mainLayout.inputRegion.show(inputViewModel.get('view'));

  // Set up the summary layout
  var summaryLayout = Calc.summaryLayout = new SummaryLayout({model: calcModel});

  var graphView = Calc.graphView = new GraphView({
    model: calcModel,
    collection: Calc.categories 
  });

  var emissionsView = Calc.emissionsView = new EmissionsView({
    model: calcModel,
    collection: Calc.categories 
  });

  mainLayout.summaryRegion.show(summaryLayout);
  summaryLayout.graphsRegion.show(graphView); 
  summaryLayout.emissionsRegion.show(emissionsView); 

  // Additional layout setup
  //Calc.controller.setFooterButtonStates(inputViewModel.get('name'));

};


