var express = require('express')
  , bodyParser = require('body-parser')
  , app = express()
  , port = 3000
  , geoLocations = [];

app.use(express.static('www'));
app.use(bodyParser.json());

var positions = [
    {
        "id":100,
        "lat":-30.0288587,
        "lng": -51.2108967
    },
    {
        "id":200,
        "lat":-30.0288587,
        "lng": -51.2208967
    },
    {
        "id":300,
        "lat":-30.0288587,
        "lng": -51.2308967
    }
];

app.post('/positions', function(req, res) {
    
    var index = positions.findIndex(position => position.id === req.body["id"]);

    if(index > -1)
        positions[index] = req.body;
    else
        positions.push(req.body);

    res.send(positions);
});

app.get('/positions', function(req, res) {
    res.send(positions);
});

app.listen(port, function (error) {
    if(!error)
        console.log('Find server is listen to port: '+port);
    else
        console.log('error on find server inicialization: '+error);
});