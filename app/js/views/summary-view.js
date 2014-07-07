var Marionette = require('backbone.marionette')
, template = require('../templates/summary-template.hbs');

module.exports = Marionette.ItemView.extend({
	template: template,
    modelEvents: {
      //"change:currentCategory": "render"
    },
	initialize: function(options){
		//this.options = options;
  },
  serializeData: function(){
  	// var calculatorName = this.model.get('displayName')
   //  , categoryModel = this.model.get('currentCategoryModel')
   //  , categoryName = categoryModel.getDisplayName();
  	// return {
  	// 	calculatorName: calculatorName,
  	// 	categoryName: categoryName
  	// }
  }
});
