 var Marionette = require('backbone.marionette')
, template = require('../templates/header-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
    modelEvents: {
      "change:currentCategoryModel": "render"
    },
	initialize: function(options){
		this.options = options;
  },
  serializeData: function(){
    console.log('serialize data this.model');
    console.log(this.model);
  	var calculatorName = this.model.get('displayName')
    , categoryModel = this.model.get('currentCategoryModel')
    , categoryName = categoryModel.get('displayName');
  	return {
  		calculatorName: calculatorName,
  		categoryName: categoryName
  	}
  }
});
