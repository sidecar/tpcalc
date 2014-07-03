var $ = require('jquery')
, App = require('../app')
, Marionette = require('backbone.marionette')
, template = require('../templates/footer-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
	events: {
    "click .btn-next": "next",
    "click .btn-prev": "prev"
	},
  next: function(event) {
    event.preventDefault();
    App.vent.trigger('next', event);
  },
  prev: function(event) {
    event.preventDefault();
    App.vent.trigger('prev', event);
  },
  disablePrevBtn: function() {
    $('.btn-prev').attr('disabled', 'disabled');
    $('.btn-prev').removeClass('active');    
  },
  activatePrevBtn: function() {
    $('.btn-prev').removeAttr('disabled');
    $('.btn-prev').addClass('active');
  }
});
