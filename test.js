var fs = require('fs');
var request = require('request');

console.log('hello world');
fs.readFile('data/worldMapOriginal.json','utf8', function (err, data) {
  if (err) throw err;
  var jsonObj=JSON.parse(data);

  for (i = 0; i < jsonObj.features.length; i++) { 
    var countryName=jsonObj.features[i].properties.name;
    console.log(countryName);
    var query=countryName + " fifa";
    console.log(query);

    makeRequest(query);
  }

  function makeRequest(query) {
    var lineNumber = i;
    var juicer= "http://data.test.bbc.co.uk/bbcrd-juicer/articles?q="+query+"&apikey=9OHbOpZpVh9tQZBDjwTlTmsCF2Ce0yGQ";
    request(juicer, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var juicerObj=JSON.parse(body);
        console.log(query, juicerObj.total);

        jsonObj.features[lineNumber].properties.mentions=juicerObj.total;

        // var sortedJsonObj = .....

        juicerObj.sort(function(a, b) {
            return parseFloat(b.total) - parseFloat(a.total);
        });

        var jsonString=JSON.stringify(jsonObj);
          fs.writeFile("data/jsonObj.json",jsonString, function(err) {
            if(err) {
             return console.log(err);
            }
          console.log("The file was saved!");
        }); 
      }
    })
  }

});

