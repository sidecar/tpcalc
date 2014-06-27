// Require main js based on example here - https://github.com/amitayd/grunt-browserify-jasmine-node-example/blob/master/test/spec/browser/AppSpec.js
//var main = require('../dev/js/main');

describe( "The Vehicle model", function () {

    var Vehicle = require('../app/js/models/vehicle-model');

    var car1 = new Vehicle({
        year: 1982, //user entered
        make: '', //user entered
        model: '', //user entered
        mileage: 100000, //user entered
        mpg: 23.5, //will come from fueleconomy.gov
        fuelType: 'gas', //?!?!
        vehicleClass: 'car' //fueleconomy.gov and map
    });

    it("exists", function () {
        expect(car1).toBeDefined();
    });

    it("can calculate total emissions based on basic data", function() {
        expect(car1.getTotalEmissions).toEqual();
    });
});
