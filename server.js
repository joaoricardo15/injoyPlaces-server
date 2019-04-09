var express = require('express')
  , bodyParser = require('body-parser')
  , app = express()
  , env = { Local: 0, Azure: 1 }
  , envMode = env.Azure
  , port
  , minimumPrecision = 0.0001
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
    
    console.log('req: ', req.body[0]);
    
    let newPosition = req.body[0]

    let index = userPositions.findIndex(userPosition => userPosition.user === newPosition["user"]);

    if(index > -1) {

        user = userPositions[index]

        if(Math.abs(newPosition.lng - user.locations[user.locations.length - 1].lng) > minimumPrecision || Math.abs(newPosition.lat - user.locations[user.locations.length - 1].lat) > minimumPrecision)
        {
            if (user.locations.length >= maxPositionsPerUser) {
                user.locations.push({ lng: newPosition.lng, lat: newPosition.lat});
                user.locations.splice(0, 1)
            }
            else {
                user.locations.push({ lng: newPosition.lng, lat: newPosition.lat});
            }
        }
    }
    else
        userPositions.push({ user: newPosition.user, locations: [{ lng: newPosition.lng, lat: newPosition.lat }]});

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

process.argv.forEach((val, index, array) => {
    if (val === 'local') {
        envMode = env.Local;
    }
});
  
if (envMode === env.Local)
    port = 80;
else
    port = process.env.PORT;

app.listen(port, function (error) {
    if(!error)
        console.log('Find server is listen to port: '+port);
    else
        console.log('error on find server inicialization: '+error);
});