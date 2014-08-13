 var Marionette = require('backbone.marionette')
, template = require('../../templates/shared/header-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
  modelEvents: {
    "change:currentCategory": "render"
  },
	initialize: function(options){
		this.options = options;
  },
  serializeData: function(){
  	var calculatorDisplayName = this.model.get('displayName')
    , calculatorSlug = this.model.get('slug')
    , categoryModel = this.model.get('currentCategory')
    , categoryDisplayName = categoryModel.get('displayName')
    , categorySlug = categoryModel.get('slug');
  	return {
      calculatorDisplayName: calculatorDisplayName,
  		calculatorSlug: calculatorSlug,
      categoryDisplayName: categoryDisplayName,
  		categorySlug: categorySlug
  	}
  }
});
