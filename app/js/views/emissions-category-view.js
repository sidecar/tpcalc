var Marionette = require('backbone.marionette')
, template = require('../templates/emissions-category-template.hbs');

module.exports = Marionette.ItemView.extend({
  template: template,
});
