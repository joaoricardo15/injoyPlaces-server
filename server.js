var express = require('express')
  , bodyParser = require('body-parser')
  , app = express()
  , port = 80
  , geoLocations = [];

app.use(express.static('www'));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});    

var maxPositionsPerUser = 100;
var userPositions = [{ user: 'init', locations: [{ lng: -51.2206984, lat: -30.0390159 }]}];

app.post('/positions', function(req, res) {
    
    var index = userPositions.findIndex(userPosition => userPosition.user === req.body["user"]);

    console.log('req: ', req.body);

    if(index > -1) {

        user = userPositions[index]

        if(Math.abs(req.body.lng - user.locations[user.locations.length - 1].lng) > minimumPrecision || Math.abs(req.body.lat - user.locations[user.locations.length - 1].lat) > minimumPrecision)
        {
            if (user.locations.length >= maxPositionsPerUser) {
                user.locations.push({ lng: req.body.lng, lat: req.body.lat});
                user.locations.splice(0, 1)
            }
            else {
                user.locations.push({ lng: req.body.lng, lat: req.body.lat});
            }
        }
    }
    else
        userPositions.push({ user: req.body.user, locations: [{ lng: req.body.lng, lat: req.body.lat }]});

    res.send({
        message: 'É uz Guri'
    });
});

app.get('/positions', function(req, res) {
    res.send(userPositions);
});

app.delete('/positions', function(req, res) {
    userPositions = [];
    res.send("ok");
});

app.listen(port, function (error) {
    if(!error)
        console.log('Find server is listen to port: '+port);
    else
        console.log('error on find server inicialization: '+error);
});