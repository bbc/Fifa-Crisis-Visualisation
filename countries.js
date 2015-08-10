var fs = require('fs');
var request = require('request');
var Q = require('q');

console.log('hello world');
fs.readFile('data/worldMapOriginal.json','utf8', function (err, data) {
  if (err) throw err;
  var jsonObj=JSON.parse(data);

  var promises = [];
  for (i = 0; i < jsonObj.features.length; i++) { 
    var countryName=jsonObj.features[i].properties.name;
    var query=countryName + " fifa";
    var promise = makeRequest(jsonObj.features[i], query);
    promises.push(promise);
  
  }

  Q.all(promises)
  .then(function(countries) {
    console.log("All requsts done");

    countries.sort(function(a, b) {
     return parseFloat(b.properties.mentions) - parseFloat(a.properties.mentions);
    });

    var top10Countries = countries.slice(0,10);

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

  });

});

  function makeRequest(country, query) {
    var deferred  = Q.defer();
    var lineNumber = i;
    var juicer= "http://data.test.bbc.co.uk/bbcrd-juicer/articles?q="+query+"&apikey=9OHbOpZpVh9tQZBDjwTlTmsCF2Ce0yGQ";
    request(juicer, function (error, response, body) {
      country.properties.mentions = 0;
      if (!error && response.statusCode == 200) {
        ///console.log(query, juicerObj.total);
        var juicerObj=JSON.parse(body);
        country.properties.mentions = juicerObj.total;
        country.properties.articles = juicerObj.hits;
      }
      deferred.resolve(country);
    });
    return deferred.promise;
  }

