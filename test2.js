var placesModule = require ('./data/places2.js');
var fs = require ('fs');

var places = placesModule.getPlaces();

places.forEach (function (place) {
	console.log(place.geometry.coordinates);
});


var changedPlaces = places.map (function (place) {
	place.geometry.coordinates = [0,0];
	return place;
});

var jsonString = JSON.stringify(changedPlaces);

var json = JSON.parse(jsonString);

 fs.writeFile("./data/output.json",jsonString, function(err) {
        if (err) {
         return console.log(err);
        }
        console.log("The file was saved!");
      }); 

//console.log(places);