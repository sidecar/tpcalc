var $ = require('jquery')
, Marionette = require('backbone.marionette')
, App = require('../../app')
, template = require("../../templates/shared/welcome-template.hbs");
  
module.exports = Marionette.ItemView.extend({
  className: 'welcome',
	template: template,
  events: {
    'click .calculator-start-btn': 'calcBtnClicked'
  },
  calcBtnClicked: function(event) {
    var calcName = $(event.target).data('calc');
    App.vent.trigger('startCalculator', calcName);
  }
});