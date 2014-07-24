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
    usesBiodieselRegion: "[data-region=usesBiodiesel]",
    biodieselBlendRegion: "[data-region=biodieselBlend]"
  },
  ui: {
    descriptionSelect: 'select[name="description"]',
    usesBiodiesel: 'input[name="usesBiodiesel"]',
    biodieselBlendSelect: 'select[name="biodieselBlend"]'
  },
  events: {
    'change select[name="description"]': 'descriptionSelectChanged',
    'change input[name="usesBiodiesel"]': 'usesBiodieselChanged',
    'change select[name="biodieselBlend"]': 'biodieselBlendChanged'
  },
  onShow: function() {
    this.vehicle = this.category.get('currentVehicle');
    this.modelBinder = new Databinding.ModelBinder(this, this.vehicle);
    
    var description = this.vehicle.get('description') || undefined;
    var isDiesel = this.vehicle.get('isDiesel') || undefined;
    var usesBiodiesel = this.vehicle.get('usesBiodiesel') || undefined;
    var fuelType = this.vehicle.get('fuelType') || undefined;

    if(fuelType) {
      this.loadDescriptionSelect();
      this.modelBinder.watch('value: description', {selector: '[name="description"]'});
      if(isDiesel) {
        this.loadUsesBiodiesel();
        this.modelBinder.watch('value: usesBiodiesel', {selector: '[name="usesBiodiesel"]'});
        if(usesBiodiesel) {
          $('#usesBiodiesel-yes').prop('checked', true);
          this.loadBiodieselBlendSelect();
          this.modelBinder.watch('value: fuelType', {selector: '[name="biodieselBlend"]'});
        } else { $('#usesBiodiesel-no').prop('checked', true); }
      }
    } else {
      this.loadDescriptionSelect();
    }

  },
  biodieselBlendChanged: function() {
    this.vehicle.set({fuelType: this.ui.biodieselBlendSelect.val()});
  },
  usesBiodieselChanged: function() {
    if($("input[name=usesBiodiesel]:checked").val() === 'yes') {
      if (_.isUndefined(this.biodieselBlendRegion.currentView)) this.loadBiodieselBlendSelect();
      this.biodieselBlendRegion.$el.show();
      this.vehicle.set({usesBiodiesel: true});
    } else {
      this.biodieselBlendRegion.$el.hide();
      this.vehicle.set({usesBiodiesel: false});
    }
  },
  isDiesel: function(str) {
    var matched = str.match(/\bDiesel\b/g);
    if (matched) {
      this.vehicle.set({isDiesel: true});
      return true;
    } else {
      this.vehicle.set({isDiesel: false});
      return false;
    }
  },
  descriptionSelectChanged: function(event) {
    var target = event.target;
    this.vehicle.set({description: $(event.target).val()});
    if(this.isDiesel(target.options[target.selectedIndex].text)) {
      if (_.isUndefined(this.usesBiodieselRegion.currentView)) this.loadUsesBiodiesel();
      this.usesBiodieselRegion.$el.show();
      //this.modelBinder.watch('value: description', {selector: '[name="description"]'});
      this.vehicle.set({fuelType: 'diesel'});
    } else {
      if(this.usesBiodieselRegion.$el) this.usesBiodieselRegion.$el.hide();
      if(this.biodieselBlendRegion.$el) this.biodieselBlendRegion.$el.hide();
      //this.modelBinder.watch('value: description', {selector: '[name="description"]'});
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
  loadUsesBiodiesel: function() {
    this.usesBiodieselRegion.show( new YesNoView({
      json: {
        'name': 'usesBiodiesel',
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