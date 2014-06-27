
var Marionette = require('backbone.marionette'),
  template = require('../templates/main-layout-template')
  App = require('../app');

module.exports = Marionette.Layout.extend({
  template: template,

  regions: {
    formRegion: '[data-region=form]',
    footerRegion: '[data-region=footer]'
  }
});
