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
    //'click [data-calc="individual"]': 'indBtnClicked'
  },
  onRender: function() {
    $('html').addClass("welcome");
  },
  indBtnClicked: function(event) {
    //var calcName = $(event.target).data('calc');
    App.router.navigate('/#/individual' , {trigger: true});
    //App.execute('calcModule:start', 'individual', undefined);
  }
});