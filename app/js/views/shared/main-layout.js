
var $ = require('jquery')
, Marionette = require('backbone.marionette')
, template = require('../../templates/shared/main-layout-template');

module.exports = Marionette.Layout.extend({
  template: template,
  regions: {
    testRegion: '[data-region=test]',
    headerRegion: '[data-region=header]',
    methodologyRegion: '[data-region=methodology]',
    menuRegion: '[data-region=menu]',
    mainRegion: '[data-region=main]',
    footerRegion: '[data-region=footer]',
    summaryRegion: '[data-region=summary]'
  }
});
