var Marionette = require('backbone.marionette')
, template = require('../templates/emissions-template.hbs');

module.exports = Marionette.CompositeView.extend({
  template: template,
  childViewContainer: '.offset'
});
