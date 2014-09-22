var $ = require('jquery')
, Marionette = require('backbone.marionette')
, template = require('../../templates/business/fleet-list-item-template.hbs')
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
  vehicleTypeDisplayNames: {
    car: 'Car',
    truck: 'Pickup Truck',
    deliveryTruck: 'Delivery Truck',
    semi: 'Semi Truck',
    ecar: 'Electric Car',
    boat: 'Boat',
    plane: 'Plane'
  },
  serializeData: function(){
    var vehicle = this.model
    , isCar = vehicle.get('isCar')
    , isDeliveryTruck = vehicle.get('isDeliveryTruck')
    , isSemi = vehicle.get('isSemi')
    , isTruck = vehicle.get('isTruck')
    , isEcar = vehicle.get('isEcar')
    , isBoat = vehicle.get('isBoat')
    , isPlane = vehicle.get('isPlane')
    , mileage = (vehicle.get('mileage') >= 1) ? numeral(vehicle.get('mileage')).format('0,0') : false
    , vehicleType = this.vehicleTypeDisplayNames[vehicle.get('vehicleType')]
    , fuelType = (this.fuelTypeDisplayNames[vehicle.get('fuelType')] === '' || !this.fuelTypeDisplayNames[vehicle.get('fuelType')]) ? false : this.fuelTypeDisplayNames[vehicle.get('fuelType')]
    , fuelQty = vehicle.get('fuelQty')
    , numVehicles = vehicle.get('numVehicles')
    , displayPlural = vehicle.get('displayPlural');
    return {
      isCar: isCar,
      isBoat: isBoat,
      isDeliveryTruck: isDeliveryTruck,
      isSemi: isSemi,
      isTruck: isTruck,
      isEcar: isEcar,
      isBoat: isBoat,
      isPlane: isPlane,
      mileage: mileage,
      vehicleType: vehicleType,
      fuelType: fuelType,
      fuelQty: fuelQty,
      numVehicles: numVehicles,
      displayPlural: displayPlural
    }
  }
});
