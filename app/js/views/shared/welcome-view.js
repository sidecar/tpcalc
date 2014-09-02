var $ = require('jquery')
, _ = require('underscore')
, Backbone = require('backbone')
, Marionette = require('backbone.marionette')
, App = require('../../app')
, template = require("../../templates/shared/welcome-template.hbs");
  
module.exports = Marionette.ItemView.extend({
  className: 'welcome-view-buttons-container',
	template: template,
  events: {
    'click .calculator-start-btn': 'calcBtnClicked'
  },
  onRender: function() {
    $('html').addClass("welcome");
  },
  calcBtnClicked: function(event) {
    var calcName = $(event.target).data('calc');
    App.execute('calcModule:start', calcName, undefined);
    $('html').removeClass("welcome");
  }
});