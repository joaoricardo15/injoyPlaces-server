var express = require('express')
  , bodyParser = require('body-parser')
  , app = express()
  , port = 3000
  , geoLocations = [];

app.use(express.static('www'));
app.use(bodyParser.json());

var positions = [];

app.post('/positions', function(req, res) {
    
    var index = positions.findIndex(position => position.id === req.body["id"]);

    console.log('req: ',req.body);

    if(index > -1)
        positions[index] = req.body;
    else
        positions.push(req.body);

    res.send("ok");
});

app.get('/positions', function(req, res) {
    res.send(positions);
});

app.delete('/positions', function(req, res) {
    positions = [];
    res.send("ok");
});

app.listen(port, function (error) {
    if(!error)
        console.log('Find server is listen to port: '+port);
    else
        console.log('error on find server inicialization: '+error);
});