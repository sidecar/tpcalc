var Marionette = require('backbone.marionette')
, template = require('../templates/emissions-template.hbs');

module.exports = Marionette.CollectionView.extend({
  template: template,
});
