var $ = require('jquery');

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