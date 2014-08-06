describe("Individual - Vehicle Total CO2e Emissions", function() {

	var oVehicle = vehicle;


	var oVehicleCar = function() {

		var o = {};
		o.vehicle = vehicle;
		o.vehicle.vehicleClass = 'car';
		o.vehicle.car.annMiles.gasoline = 10000;
		o.vehicle.car.fuelEconomy.gasoline = 23.5;
		o.vehicle.year = 2000;
		console.log('spec oVehicleCar o.vehicle',o.vehicle);
		return o.vehicle;

	};

	var oVehicleCarOld = function() {

		var o = {};
		o.vehicle = vehicle;
		o.vehicle.vehicleClass = 'car';
		o.vehicle.car.annMiles.gasoline = 10000;
		o.vehicle.car.fuelEconomy.gasoline = 23.5;
		o.vehicle.year = 1982;
		console.log('spec oVehicleCarOld o.vehicle',o.vehicle);
		return o.vehicle;

	};

	var oVehicleBoat = function() {

		var o = {};
		o.vehicle = vehicle;
		o.vehicle.vehicleClass = "boat";
		o.vehicle.boat.annGallons = 500;
		o.vehicle.boat.fuel = 'diesel';
		console.log('spec oVehicleBoat o.vehicle',o.vehicle);
		return o.vehicle;

	}

	var oVehicleEcar = function() {

		var o = {};
		o.vehicle = vehicle;
		o.vehicle.vehicleClass = "ecar";
		o.vehicle.ecar.annMiles = 5000;
		o.vehicle.ecar.zipCode = 94710;
		console.log('spec oVehicleEcar o.vehicle',o.vehicle);
		return o.vehicle;

	}

	var oVehicleMotorcycle = function() {

		var o = {};
		o.vehicle = vehicle;
		o.vehicle.vehicleClass = "motorcycle";
		o.vehicle.car.annMiles.gasoline = 10000;
		o.vehicle.car.fuelEconomy.gasoline = 30;
		console.log('spec oVehicleMotorcycle o.vehicle',o.vehicle);
		return o.vehicle;

	}


	var oVehicleTruck = function() {

		var o = {};
		o.vehicle = vehicle;
		o.vehicle.vehicleClass = 'truck';
		o.vehicle.car.annMiles.diesel = 10000;
		o.vehicle.car.fuelEconomy.diesel = 25;
		o.vehicle.year = 2000;
		console.log('spec oVehicleTruck o.vehicle',o.vehicle);
		return o.vehicle;

	};


	var oVehicleTruckOld = function() {

		var o = {};
		o.vehicle = vehicle;
		o.vehicle.vehicleClass = 'truck';
		o.vehicle.car.annMiles.diesel = 10000;
		o.vehicle.car.fuelEconomy.diesel = 25;
		o.vehicle.year = 1980;
		console.log('spec oVehicleTruck o.vehicle',o.vehicle);
		return o.vehicle;

	};



    it("checks CO2e for a 2000 model year car / gasoline / 10,000 annual miles / 23.5 mpg - 3.84", function() {

        expect(Math.round(oVehicleCar().totalEmissions('gasoline') * 100) / 100).toEqual(3.84);

    });

    it("checks CH4 for a 2000 model year car / gasoline / 10,000 annual miles / 23.5 mpg - 0.0178", function() {

        expect(oVehicleCar().gasolineFactors.gCH4permile('2000','car')).toEqual(0.0178);

    });


    it("checks CO2e for a 1982 model year car / gasoline / 10,000 annual miles / 23.5 mpg - 3.96", function() {

        expect(Math.round(oVehicleCarOld().totalEmissions('gasoline') * 100) / 100).toEqual(3.96);

    });

    it("checks CH4 for a 1982 model year car / gasoline / 10,000 annual miles / 23.5 mpg - 0.0704", function() {

        expect(oVehicleCarOld().gasolineFactors.gCH4permile('1982','car')).toEqual(0.0704);

    });

    it("checks to see if CH4 values for gasoline have been called", function() {

    	spyOn(oVehicle.gasolineFactors, 'gCH4permile');
    	oVehicle.totalEmissions('gasoline');
    	expect(oVehicle.gasolineFactors.gCH4permile).toHaveBeenCalled();

    });

    it("checks to see if the gallons of gas used in a car annually has been calculated correctly - 425.53", function() {

    	expect(Math.round(oVehicleCar().carGallonsUsed().gasoline * 100) / 100).toEqual(425.53);

    });

    it("checks CO2e for a boat / diesel / 500 annual miles - 5.12", function() {

        expect(Math.round(oVehicleBoat().totalEmissions('diesel') * 100) / 100).toEqual(5.12);

    });

    it("checks CO2e for an electric car / 94710 / 5000 annual miles - 0.49", function() {

        expect(Math.round(oVehicleEcar().totalEmissions() * 100) / 100).toEqual(0.49);

    });

    it("checks CO2e for a 1982 model year motorcycle / gasoline / 5,000 annual miles / 30 mpg - 2.97", function() {

        expect(Math.round(oVehicleMotorcycle().totalEmissions('gasoline') * 100) / 100).toEqual(2.97);

    });

    it("checks CH4 for a 1982 model year motorcycle / gasoline / 5,000 annual miles / 30 mpg - 0.07", function() {

        expect(oVehicleMotorcycle().gasolineFactors.gCH4permile('1982','motorcycle')).toEqual(0.07);

    });

    it("checks CO2e for a 2000 model year truck / diesel / 10,000 annual miles / 25 mpg - 4.06", function() {

        expect(Math.round(oVehicleTruck().totalEmissions('diesel') * 100) / 100).toEqual(4.06);

    });

    it("checks CH4 for a 2000 model year truck / diesel / 10,000 annual miles / 25 mpg - 0.001", function() {

        expect(oVehicleTruck().dieselFactors.gCH4permile('2000','truck')).toEqual(0.001);

    });

    it("checks N2O for a 2000 model year truck / diesel / 10,000 annual miles / 25 mpg - 0.0015", function() {

        expect(oVehicleTruck().dieselFactors.gN2Opermile('2000','truck')).toEqual(0.0015);

    });

    it("checks CO2e for a 1980 model year truck / diesel / 10,000 annual miles / 25 mpg - 4.07", function() {

        expect(Math.round(oVehicleTruck().totalEmissions('diesel') * 100) / 100).toEqual(4.07);

    });

    it("checks CH4 for a 1980 model year truck / diesel / 10,000 annual miles / 25 mpg - 0.0011", function() {

        expect(oVehicleTruck().dieselFactors.gCH4permile('1980','truck')).toEqual(0.0011);

    });


});