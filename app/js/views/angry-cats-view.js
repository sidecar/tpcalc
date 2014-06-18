var $ = require('jquery'); //included via bower > packeged in libs.js via gulpfile.js > exposed as CommonJS module by browserify-shim in packag.json with the alias used here
var _ = require('underscore'); //included via bower > packeged in libs.js via gulpfile.js > exposed as CommonJS module by browserify-shim in packag.json with the alias used here
var Backbone = require('backbone'); //included via bower > packeged in libs.js via gulpfile.js > exposed as CommonJS module by browserify-shim in packag.json with the alias used here
var Marionette = require('backbone.marionette'); //included via bower > packeged in libs.js via gulpfile.js > exposed as CommonJS module by browserify-shim in packag.json with the alias used here
Marionette.$ = Backbone.$ = $;

var tmpl = require('../templates/angry_cat-template.hbs');
var tmpl2 = require('../templates/angry_cats-template.hbs');

var AngryCatView = Marionette.ItemView.extend({
  // I can just specify the template type because I am running...hbsfy I think
  type: 'handlebars',
  template: tmpl,
  tagName: 'tr',
  className: 'angry_cat'
});

var AngryCatsView = Marionette.CompositeView.extend({
  tagName: "table",
  id: "angry_cats",
  className: "table-striped table-bordered",
  type: 'handlebars',
  template: tmpl2,
  itemView: AngryCatView,
  initialize: function(){
    console.log('initialized AngryCatsView');
    this.listenTo(this.collection, "sort", this.renderCollection);
  },
  appendHtml: function(collectionView, itemView){
    collectionView.$("tbody").append(itemView.el);
  }
});

module.exports = AngryCatsView;