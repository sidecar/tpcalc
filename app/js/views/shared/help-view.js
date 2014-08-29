var Backbone = require('backbone')
  , Marionette = require('backbone.marionette')
  , App = require('../../app')
  , individualTemplate = require('../../templates/shared/individual-methodology-template.hbs')
  , businessTemplate = require('../../templates/shared/business-methodology-template.hbs')
  , eventsTemplate = require('../../templates/shared/events-methodology-template.hbs')
  , template = require('../../templates/shared/help-template.hbs');

module.exports = Marionette.Layout.extend({
  onBeforeRender: function(){
    switch(this.model.get('slug')) {
      case 'individual':
        template = individualTemplate;
      break;
      case 'business':
        template = businessTemplate;
      break;
      case 'events':
        template = eventsTemplate;
      break;
    }
  }
});
