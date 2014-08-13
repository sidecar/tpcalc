var $ = require('jquery')
, Marionette = require('backbone.marionette')
, template = require('../../templates/individual/vehicle-list-item-template.hbs')
,numeral = require('numeral');

module.exports = Marionette.ItemView.extend({
  template: template,
  //THIS SOLUTION IS SO NOT DOCUMENTED!
  //http://stackoverflow.com/questions/14656068/turning-off-div-wrap-for-backbone-marionette-itemview
  onRender: function () {
    // Get rid of that pesky wrapping-div.
    // Assumes 1 child element present in template.
    this.$el = this.$el.children();
    // Unwrap the element to prevent infinitely 
    // nesting elements during re-render.
    this.$el.unwrap();
    //setElement is the key
    this.setElement(this.$el);
  },
  fuelTypeDisplayNames: {
    gasoline: 'Gasoline',
    diesel: 'Diesel',
    biodiesel_b20: 'Biodiesel B20',
    biodiesel_b100: 'Biodiesel B100',
    cng: 'CNG',
    e85_ethanol: 'Ethanol'
  },
  vehicleClassDisplayNames: {
    car: 'Car',
    truck: 'Truck',
    suv: 'SUV',
    van: 'Van'
  },
  fitListItemString: function(str) {
    var result = str;
    if(typeof str !== 'string') return;
    if(str.length > 20) result = str.slice(0,20) + '...';
    return result;
  },
  serializeData: function(){
    var vehicle = this.model
    , isCar = vehicle.get('isCar')
    , isBoat = vehicle.get('isBoat')
    , isMotorcycle = vehicle.get('isMotorcycle')
    , isEcar = vehicle.get('isEcar')
    , makeModelIsUnknown = vehicle.get('makeModelIsUnknown')
    , year = vehicle.get('year')
    , make = this.fitListItemString(vehicle.get('make'))
    , model = this.fitListItemString(vehicle.get('model'))
    , mileage = numeral(vehicle.get('mileage')).format('0,0')
    , vehicleClass = this.vehicleClassDisplayNames[vehicle.get('vehicleClass')]
    , isBoat = vehicle.get('isBoat')
    , fuelType = this.fuelTypeDisplayNames[vehicle.get('fuelType')]
    , fuelQty = vehicle.get('fuelQty');
    return {
      isCar: isCar,
      isBoat: isBoat,
      isMotorcycle: isMotorcycle,
      isEcar: isEcar,
      makeModelIsUnknown: makeModelIsUnknown,
      year: year,
      make: make,
      model: model,
      mileage: mileage,
      vehicleClass: vehicleClass,
      isBoat: isBoat,
      fuelType: fuelType,
      fuelQty: fuelQty
    }
  }
});
