var App = require('../app'),
  Marionette = require('backbone.marionette'),
	template = require('../templates/footer-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
	events: {
    "click #nextBtn": "next",
    "click #prevBtn": "prev"
	},
  next: function(event) {
    event.preventDefault();
    App.vent.trigger('next');
  },
  prev: function(event) {
    event.preventDefault();
    App.vent.trigger('prev');
  }
	// serializeData: function(){
 //      return this.model.data
 //    } 
});
