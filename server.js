var express = require('express')
  , bodyParser = require('body-parser')
  , app = express()
  , env = { Local: 0, Azure: 1 }
  , envMode = env.Azure
  , port

app.use(express.static('www'))
app.use(bodyParser.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});    

var maxPositionsPerUser = 200
var userPositions = []

/*/////////////////// Conversão de precisão em graus para distancia /////////////////////

    1grau latitude = 111.12Km
    
    1grau longitude = 111.12km * cos(latitude) 
    
    nossa latitude = +- -30grau -> cos(-30) = +- 0.87

    -> para uma area quadrada de 20m:
    
    20m correspondem a +- 0.00018 graus de latitude
    
    20m correspondem a +- 0.00021 graus de longitude

/////////////////////////////////////////////////////////////////////////////////////////*/

var latitudeThreshold = 0.00018
var longitudeThreshold = 0.00021

app.post('/positions', function(req, res) {
    
    let newPosition = req.body[0]

    let index = userPositions.findIndex(userPosition => userPosition.user === newPosition["user"])

    if(index > -1) {

        user = userPositions[index]

        user.locations.push({ lng: newPosition.lng, lat: newPosition.lat})

        if (user.locations.length >= maxPositionsPerUser) {
            user.locations.splice(0, 1)
        }

        if (user.locals.length == 0 || 
            Math.abs(newPosition.lat - user.locals[user.locals.length - 1].lat) > latitudeThreshold ||
            Math.abs(newPosition.lng - user.locals[user.locals.length - 1].lng) > longitudeThreshold) {
            user.locals.push({ lng: newPosition.lng, lat: newPosition.lat})
        }
    }
    else
        userPositions.push({ user: newPosition.user, locations: [{ lng: newPosition.lng, lat: newPosition.lat }], locals: []});

    res.send({
        message: 'É uz Guri'
    });
});

app.get('/positions', function(req, res) {
    res.send(userPositions)
});

app.delete('/positions', function(req, res) {
    userPositions = []
    res.send("ok")
})

process.argv.forEach((val, index, array) => {
    if (val === 'local') {
        envMode = env.Local
    }
})
  
if (envMode === env.Local)
    port = 80
else
    port = process.env.PORT

app.listen(port, function (error) {
    if(!error)
        console.log('Find server is listen to port: '+port)
    else
        console.log('error on find server inicialization: '+error)
})