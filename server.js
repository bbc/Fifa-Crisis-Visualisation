var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/'));

// views is directory for all template files
app.set('css', __dirname + '/css');
app.set('data', __dirname + '/data');
app.set('js', __dirname + '/js');
app.set('img', __dirname + '/img');
app.set('node_modules', __dirname + '/node_modules');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
