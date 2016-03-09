var fs = require('fs');
var request = require('request');
var Q = require('q');
var placesArray = [];

console.log('hello world');
fs.readFile('worldMapOriginal.json','utf8', function (err, data) {
  if (err) throw err;
  var jsonObj=JSON.parse(data);

  var promises = [];
  for (i = 0; i < jsonObj.features.length; i++) { 
    var countryName=jsonObj.features[i].properties.name;
    var query=countryName + " fifa corruption";
    var promise = makeRequest(jsonObj.features[i], query);
    promises.push(promise);
  
  }

  var coordinate = {};
  fs.readFile('coordinate.json','utf8', function (err, data) {
        if (err) throw err;
        coordinate=JSON.parse(data);
  });

  Q.all(promises)
  .then(function(countries) {
    console.log("All requsts done");

    countries.sort(function(a, b) {
     return parseFloat(b.properties.mentions) - parseFloat(a.properties.mentions);
    });

    var top10Countries = countries.slice(0,10);

    for (var i = 0; i < top10Countries.length; i++) { 
        var countryName=top10Countries[i].properties.name;
        var articles=top10Countries[i].properties.articles;

        console.log(countryName);

        console.log('LOOP NUMBER: ' + i);

        function getLatLon (country) {
          console.log('finding coord for ' + country);
          var result = {};
          for (j = 0; j < coordinate.length; j++) {
            if (coordinate[j].SHORT_NAME == country) {
                //console.log ('lat for ' + coordinate[j].SHORT_NAME + ' is ' + coordinate[j].LAT + coordinate[j].LONG);
                result.lat = coordinate[j].LAT;
                result.lon = coordinate[j].LONG;
            }
          }

          return result;
        }

        var latlon = getLatLon(countryName);
        console.log ('coordinate for ' + countryName + ' is ' + latlon);

        var country = countryName;
        var lat = latlon.lat;
        var lon = latlon.lon;

        var descriptionHtml = 'Fifa Corruption News Headlines: <ul class="pagination1">';
        
        for (var k = 0; k < articles.length; k++){
          descriptionHtml += '<li><a href="'+articles[k].url+'">'+articles[k].title+'</a><p>Source: '+articles[k].source+'</p><p>Publish time: '+articles[k].time+'</p></li>';
        }

        descriptionHtml += '</ul>';

        var placesObj = {
          "type": "Feature",
          "geometry": {
              "type": 'Point',
              "coordinates": [lon, lat]
          },
          "properties": {
              "title": country,
              "description": descriptionHtml 
          }
        };

        placesArray.push(placesObj);
    } 

    fs.writeFile("data/placesGenerated.js", "var geoJsonData = " + JSON.stringify(placesArray), function(err) {
        if (err) {
         return console.log(err);
        }
        console.log("The file2 was saved!");
    }); 

    var newWorldMap = {};
    newWorldMap.type = 'FeatureCollection';
    newWorldMap.features = top10Countries;

    var jsonString=JSON.stringify(newWorldMap);
    fs.writeFile("data/countryMentions.json",jsonString, function(err) {
      if (err) {
       return console.log(err);
      }
      console.log("The file was saved!");
    }); 

  }).fail(function (err){
    console.log(err);
    return Q.reject(err);
  });

});

  function makeRequest(country, query) {
    var deferred  = Q.defer();
    var lineNumber = i;
    var juicer= "http://juicer.api.bbci.co.uk/articles?q="+query+"&published_after=1900-01-01T00:00:00.000Z&size=40&recent_first=yes&api_key=yrbiyyGvQTVQjUAaiQj9nxFxDCIllPPS";
    request(juicer, function (error, response, body) {
      country.properties.mentions = 0;
      if (!error && response.statusCode == 200) {
        ///console.log(query, juicerObj.total);
        var juicerObj=JSON.parse(body);
        country.properties.mentions = juicerObj.total;
        country.properties.articles = [];
        for (var j = 0; j < juicerObj.hits.length; j++){
          country.properties.articles.push({
            title : juicerObj.hits[j].title,
            url: juicerObj.hits[j].url,
            time: juicerObj.hits[j].published,
            source: juicerObj.hits[j].source["source-name"]

          }); 
        }

        juicerObj.hits;
        console.log (juicerObj.hits.length);
        console.log(query);

      }
      deferred.resolve(country);
    });
    return deferred.promise;
  }




