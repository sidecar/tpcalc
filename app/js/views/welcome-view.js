var Marionette = require('backbone.marionette')
, template = require("../templates/welcome-template.hbs");
  
module.exports = Marionette.ItemView.extend({
	template: template,
});