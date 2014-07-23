var $ = require('jquery')
, _ = require('underscore')
, Marionette = require('backbone.marionette')
, Stickit = require('backbone.stickit')
, Databinding = require('backbone.databinding')
, App = require('../app')
, emissions = require('../utils/ind-vehicle-emissions');

var optionsTemplate = require('../templates/ind-vehicle-options-template.hbs');

var utils = require('../utils/utility');

var YesNoView = require('./yes-no-view');
var SelectView = require('./select-view');

module.exports = Marionette.Layout.extend({
  template: optionsTemplate,
  regions: {
    descriptionRegion: "[data-region=description]",
    biodieselYesNoRegion: "[data-region=biodieselYesNo]",
    biodieselBlendRegion: "[data-region=biodieselBlend]"
  },
  ui: {
    descriptionSelect: 'select[name="description"]',
    biodieselYesNo: 'input[name="biodieselYesNo"]',
    biodieselBlendSelect: 'select[name="biodieselBlend"]'
  },
  events: {
    'change select[name="description"]': 'descriptionSelectChanged',
    'change input[name="biodieselYesNo"]': 'biodieselYesNoChanged',
    'change select[name="biodieselBlend"]': 'biodieselBlendChanged'
  },
  onShow: function() {
    this.vehicle = this.category.get('currentVehicle');
    this.loadDescriptionSelect();
  },
  biodieselBlendChanged: function() {
    this.vehicle.set({fuelType: this.ui.biodieselBlendSelect.val() });
  },
  biodieselYesNoChanged: function() {
    if($("input[name=biodieselYesNo]:checked").val() === 'yes') {
      if (_.isUndefined(this.biodieselBlendRegion.currentView)) this.loadBiodieselBlendSelect();
      this.biodieselBlendRegion.$el.show();
    } else {
      this.biodieselBlendRegion.$el.hide();
    }
  },
  isDiesel: function(str) {
    var matched = str.match(/\bDiesel\b/g);
    return (matched) ? true : false;
  },
  descriptionSelectChanged: function(event) {
    var target = event.target;
    if(this.isDiesel(target.options[target.selectedIndex].text)) {
      if (_.isUndefined(this.biodieselYesNoRegion.currentView)) this.loadBiodieselYesNo();
      this.biodieselYesNoRegion.$el.show();
      this.vehicle.set({fuelType: 'diesel'});
    } else {
      if(this.biodieselYesNoRegion.$el) this.biodieselYesNoRegion.$el.hide();
      if(this.biodieselBlendRegion.$el) this.biodieselBlendRegion.$el.hide();
      this.vehicle.set({fuelType: 'gasoline'});
    }
  },
  loadBiodieselBlendSelect: function() {
    this.biodieselBlendRegion.show( new SelectView({
      json: {
        'selectName': 'biodieselBlend',
        'displayName': 'Biodiesel Blend',
        'selectedOptionText': 'Which blend of biodiesel does your car use?',
        'selectedOptionVal': '',
        'items': [
          {'text':'B100 (100%)', 'value':'b100'},
          {'text':'B99 (99%)', 'value':'b99'},
          {'text':'B80 (80%)', 'value':'b80'},
          {'text':'B50 (50%)', 'value':'b50'},
          {'text':'B20 (20%)', 'value':'b20'},
          {'text':'B5 (5%)', 'value':'b5'},
          {'text':'B2 (2%)', 'value':'b2'}
        ]
      }
    }));

    this.bindUIElements(); //re-implement the ui hash
  },
  loadBiodieselYesNo: function() {
    this.biodieselYesNoRegion.show( new YesNoView({
      json: {
        'name': 'biodieselYesNo',
        'label': 'Do you use biodiesel?'
      }
    }));
    this.bindUIElements(); //re-implement the ui hash
  },
  loadDescriptionSelect: function() {
    var self = this
    , vehicle = this.category.get('currentVehicle')
    , year = vehicle.get('year')
    , make = vehicle.get('make')
    , model = vehicle.get('model');

    utils.getJSON('/vehicle/options/'+year+'/'+make+'/'+model, function(jsonResponse) {
      if(!jsonResponse.menuItems) return;
      var data = {};
      data.items = jsonResponse.menuItems.menuItem;
      data.selectName = 'description';
      data.displayName = 'Description';
      data.selectedOptionText = 'Choose your vehicle\'s description';
      data.selectedOptionVal = '';
      self.descriptionRegion.show( new SelectView({json: data}) );
      self.bindUIElements(); //re-implement the ui hash
    }); 

  },
  getNextInputView: function() {
    var self = this, mpg;
    utils.getJSON('/vehicle/mpg/'+this.ui.descriptionSelect.val(), function(jsonResponse) {
      if(!jsonResponse) return;
      mpg = jsonResponse['comb08'];
    });
    self.vehicle.set({ mpg: mpg });
    App.vent.trigger('showInputView', 'list');
  }

});