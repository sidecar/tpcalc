
var Marionette = require('backbone.marionette'),
  template = require('../templates/desktop-layout-template')
  App = require('../app');

module.exports = Marionette.Layout.extend({
  template: template,

  regions: {
    headerRegion: '[data-region=header]',
    menuRegion: '[data-region=menu]',
    inputRegion: '[data-region=input]',
    footerRegion: '[data-region=footer]'
  }
});
