var $ = require('jquery')
, Qty = require('js-quantities');

module.exports.getJSON = function(reqUrl, callback) {
	var reqObj = $.ajax({url: reqUrl, dataType: "json", async: false, failure: function(){
	//try{console.log("ajax.failure")}catch(e){}
	}});
	//try{console.log(reqObj, reqObj.status)}catch(e){}
	if(reqObj.status != 200 && reqObj.status != 304){
		console.log('The server did not give a successful response to the Ajax request.');
		return false;
	}
	if(reqObj.responseText) {
		//try{console.log(reqObj.responseText)}catch(e){}
		var jsonObj = JSON.parse(reqObj.responseText);
		callback(reqObj.responseText);
		if(jsonObj) {
			callback(jsonObj);
		} else {
			console.log('The JSON response could not be parsed.');
		}
	} else {
		console.log('The JSON response was empty.');
	}
	return reqObj;
};

module.exports.getXML = function(reqUrl, callback) {
	var reqObj = $.ajax({url: reqUrl, dataType: "xml", async: false, failure: function(){
	//try{console.log("ajax.failure")}catch(e){}
	}});
	//try{console.log(reqObj, reqObj.status)}catch(e){}
	if(reqObj.status != 200 && reqObj.status != 304){
		console.log('The server did not give a successful response to the Ajax request.');
		return false;
	}
	if(reqObj.responseXML) {
		//try{console.log(reqObj.responseText)}catch(e){}
		var jsonObj = JSON.parse(xmltojson(reqObj));
		if(jsonObj) {
			callback(jsonObj);
		} else {
			console.log('The XML response could not be parsed.');
		}
	} else {
		console.log('The XML response was empty.');
	}
	return reqObj;
};

//based on http://davidwalsh.name/convert-xml-json
module.exports.xmltojson = function(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

module.exports.getTotalEmissions = function(MTC02, gCH4, gN20) {
	var num = MTC02 + (((21*gCH4 + 310*gN20)/1000)/1000);
	var qty = Qty(''+num); //for some damn reason has to be a string
	var rounded = qty.toPrec('0.01');
	return rounded.toFloat();
};

module.exports.getTotalCH4 = function(vehicleClass, year, mileage) {
	var factor = gCH4PerMile[vehicleClass][fuelType][year][0];
	return mileage * factor;
};

module.exports.getTotalN2O = function(vehicleClass, fuelType, year, mileage) {
	var factor = gN2OPerMile[vehicleClass][fuelType][year][0];
	return mileage * factor;
};

module.exports.getTotalCO2 = function(fuelType, annualFuelGallons) {
	var factor = kgCO2PerGallon[fuelType];
	return annualFuelGallons * factor;
};

module.exports.annualAutoEmissions = function(vehicle) {
	var fuelType = vehicle.fuelType;
	var year = vehicle.year;
	var miles = vehicle.miles;
	var annualFuelGallons = vehicle.miles/vehicle.mpg;
	var MTCO2 = getTotalCO2(fuelType, annualFuelGallons);
	var gCH4 = getTotalCH4(vehicleClass, year, mileage);
	var gN2O = getTotalN2O(vehicleClass, fuelType, year, mileage);
	var totalEmissions = getTotalEmissions(MTCO2, gCH4, gN20);
	return totalEmissions;
};

module.exports.gCH4PerMile = gCH4PerMile = {
	car: {
		gas: {
			1900: 0.0704,
			1993: 0.0704,
			1994: 0.0531,
			1995: 0.0358,
			1996: 0.0272,
			1997: 0.0268,
			1998: 0.0249,
			1999: 0.0216,
			2000: 0.0178,
			2001: 0.011,
			2002: 0.0107,
			2003: 0.0114,
			2004: 0.0145,
			2005: 0.0147
		},
		diesel: {
			1900: 0.0006,
			1983: 0.0005
		},
		unknown: {
			1900: 0.031
		}
	},
	truck: {
		gas: {
			1900: 0.0813,
			1993: 0.0813,
			1994: 0.0646,
			1995: 0.0517,
			1996: 0.0452,
			1997: 0.0452,
			1998: 0.0391,
			1999: 0.0321,
			2000: 0.0346,
			2001: 0.0151,
			2002: 0.0178,
			2003: 0.0155,
			2004: 0.0152,
			2005: 0.0157
		},
		diesel: {
			1900: 0.0011,
			1983: 0.0009,
			1996: 0.001
		},
		CNG: {
			1900: 0.737
		},
		LPG: {
			1900: 0.037
		},
		ethanol: {
			1900: 0.055
		},
		unknown: {
			1900: 0.047
		}
	},
	bus: {
		gas: {
			1900: 0.021
		},
		diesel: {
			1900: 0.0051
		},
		CNG: {
			1900: 1.966
		},
		ethanol: {
			1900: 0.197
		}
	}, 
	motorbike: {1900: 0.07}
};

module.exports.gN2OPerMile = gN2OPerMile = {
	car: {
		gas: {
			1900: 0.0647,
			1994: 0.056,
			1995: 0.0473,
			1996: 0.0426,
			1997: 0.0422,
			1998: 0.0393,
			1999: 0.0337,
			2000: 0.0273,
			2001: 0.0158,
			2002: 0.0153,
			2003: 0.0135,
			2004: 0.0083,
			2005: 0.0079
		},
		diesel: {
			1900: 0.0012,
			1983: 0.001
		},
		unknown: {
			1900: 0.032
		}
	},
	truck: {
		gas: {
			1900: 0.1035,
			1994: 0.0982,
			1995: 0.0908,
			1996: 0.0871,
			1997: 0.0871,
			1998: 0.0728,
			1999: 0.0564,
			2000: 0.0621,
			2001: 0.0164,
			2002: 0.0228,
			2003: 0.0114,
			2004: 0.0132,
			2005: 0.0101
		},
		diesel: {
			1900: 0.0017,
			1983: 0.0014,
			1996: 0.0015
		},
		CNG: {
			1900: 0.05
		},
		LPG: {
			1900: 0.067
		},
		ethanol: {
			1900: 0.067
		},
		unknown: {
			1900: 0.047
		}
	},
	bus: {
		gas: {
			1900: 0.017
		},
		diesel: {
			1900: 0.0048
		},
		CNG: {
			1900: 0.175
		},
		ethanol: {
			1900: 0.175
		}
	}, 
	motorbike: {1900: 0.007}
};

module.exports.kgCO2PerGallon = kgCO2PerGallon = {
	jetFuel: 9.57,
	avaitiaon: 8.32,
	gasoline: 8.81,
	diesel: 10.15,
	residual: 11.8,
	lpg: 5.79,
	cng: 0.00721875,
	lng: 4.46,
	E85: 1.3215,
	ethanol: 0,
	B20: 8.12,
	B100: 0
};






