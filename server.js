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

var latitudeThreshold = 0.018
var longitudeThreshold = 0.021

app.post('/positions', function(req, res) {
    
    addLocation(req.body[0])

    res.send({
        message: 'É uz Guri'
    })
})

app.get('/positions', function(req, res) {
    
    // locations.forEach(location => {
        
    //     addLocation(location) 

    // });
    
    res.send(userPositions)

    //userPositions = []
})

app.delete('/positions', function(req, res) {
    userPositions = []
    res.send("ok")
})

var localMinimunInterval = 600

function addLocation(position) {

    let index = userPositions.findIndex(userPosition => userPosition.user === position["user"])

    if(index > -1) {

        user = userPositions[index]

        user.locations.push({ lng: position.lng, lat: position.lat, timeStamp: Date.now() })

    }
    else
        userPositions.push({ user: position.user, locations: [{ lng: position.lng, lat: position.lat, timeStamp: Date.now() }]});

    // //let index = userPositions.findIndex(userPosition => userPosition.user === position["user"])
    // let index = userPositions.findIndex(userPosition => userPosition.user === "dao")

    // if(index < 0) {
    //     userPositions.push({ user: "dao", currentLocal: { arrival: Date.now(), lng: position.lng, lat: position.lat, samples: 1, departure: null }, locals: []});
    //     //userPositions.push({ user: position.user, currentLocal: { arrival: new Date().toISOString(), lng: position.lng, lat: position.lat }, locals: []});
    // }
    // else {

    //     user = userPositions[index]

    //     if (Math.abs(position.lat - user.currentLocal.lat) < latitudeThreshold && Math.abs(position.lng - user.currentLocal.lng) < longitudeThreshold) {
    //         let lastLatitude = user.currentLocal.lat
    //         let lastLongitude = user.currentLocal.lng
    //         user.currentLocal.lat = (lastLatitude*user.currentLocal.samples + position.lat) / (user.currentLocal.samples + 1)
    //         user.currentLocal.lng = (lastLongitude*user.currentLocal.samples + position.lng) / (user.currentLocal.samples + 1)
    //         user.currentLocal.samples++
    //         user.currentLocal.departure = Date.now()

    //         if(user.currentLocal.departure - user.currentLocal.arrival > localMinimunInterval*1000) {
    //             user.locals.push({ arrival: new Date(user.currentLocal.arrival), departure: new Date(user.currentLocal.departure), lat: user.currentLocal.lat, lng: user.currentLocal.lng })

    //             user.currentLocal = { arrival: Date.now(), lng: position.lng, lat: position.lat, samples: 1, departure: null }
    //         }
    //     }
    //     else {
    //         user.currentLocal = { arrival: Date.now(), lng: position.lng, lat: position.lat, samples: 1, departure: null }
    //     }
    // }
}



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

var locations = [{
        "lng": -51.2033971,
        "lat": -30.0275931
    }, {
        "lng": -51.2034259,
        "lat": -30.0276198
    }, {
        "lng": -51.2033676,
        "lat": -30.0276053
    }, {
        "lng": -51.203999,
        "lat": -30.0273642
    }, {
        "lng": -51.2040352,
        "lat": -30.0273115
    }, {
        "lng": -51.2040157,
        "lat": -30.0273527
    }, {
        "lng": -51.2040018,
        "lat": -30.0271568
    }, {
        "lng": -51.2039991,
        "lat": -30.0273327
    }, {
        "lng": -51.2040296,
        "lat": -30.0273388
    }, {
        "lng": -51.2039802,
        "lat": -30.0273026
    }, {
        "lng": -51.2040341,
        "lat": -30.0272564
    }, {
        "lng": -51.203999,
        "lat": -30.0273642
    }, {
        "lng": -51.2040323,
        "lat": -30.027282
    }, {
        "lng": -51.2040951,
        "lat": -30.0271557
    }, {
        "lng": -51.2040426,
        "lat": -30.0273634
    }, {
        "lng": -51.2040455,
        "lat": -30.0272333
    }, {
        "lng": -51.2037397,
        "lat": -30.0269406
    }, {
        "lng": -51.2032828,
        "lat": -30.0265818
    }, {
        "lng": -51.2032068,
        "lat": -30.0267737
    }, {
        "lng": -51.203185,
        "lat": -30.0264693
    }, {
        "lng": -51.2029092,
        "lat": -30.0262364
    }, {
        "lng": -51.2025155,
        "lat": -30.0258716
    }, {
        "lng": -51.2020578,
        "lat": -30.0255418
    }, {
        "lng": -51.2020343,
        "lat": -30.0253615
    }, {
        "lng": -51.2017653,
        "lat": -30.0254585
    }, {
        "lng": -51.201236,
        "lat": -30.0248924
    }, {
        "lng": -51.201093,
        "lat": -30.0248048
    }, {
        "lng": -51.1993566,
        "lat": -30.024476
    }, {
        "lng": -51.2011085,
        "lat": -30.0249134
    }, {
        "lng": -51.2009311,
        "lat": -30.0246844
    }, {
        "lng": -51.200272,
        "lat": -30.0241924
    }, {
        "lng": -51.2001151,
        "lat": -30.0240702
    }, {
        "lng": -51.1997853,
        "lat": -30.0238802
    }, {
        "lng": -51.1994403,
        "lat": -30.0237245
    }, {
        "lng": -51.1990585,
        "lat": -30.023726
    }, {
        "lng": -51.1988226,
        "lat": -30.0236873
    }, {
        "lng": -51.1979582,
        "lat": -30.0235208
    }, {
        "lng": -51.198243,
        "lat": -30.0235841
    }, {
        "lng": -51.1981922,
        "lat": -30.0235501
    }, {
        "lng": -51.1979189,
        "lat": -30.0234795
    }, {
        "lng": -51.1979125,
        "lat": -30.0234162
    }, {
        "lng": -51.1972822,
        "lat": -30.0233288
    }, {
        "lng": -51.196982,
        "lat": -30.0232269
    }, {
        "lng": -51.1968375,
        "lat": -30.0234293
    }, {
        "lng": -51.1968261,
        "lat": -30.023907
    }, {
        "lng": -51.1967912,
        "lat": -30.024022
    }, {
        "lng": -51.1968035,
        "lat": -30.0240272
    }, {
        "lng": -51.1968332,
        "lat": -30.0240583
    }, {
        "lng": -51.1968187,
        "lat": -30.0240431
    }, {
        "lng": -51.1968111,
        "lat": -30.0240335
    }, {
        "lng": -51.1968224,
        "lat": -30.0240511
    }, {
        "lng": -51.1967853,
        "lat": -30.0240265
    }, {
        "lng": -51.1967969,
        "lat": -30.0240377
    }, {
        "lng": -51.1967911,
        "lat": -30.0240223
    }, {
        "lng": -51.1967786,
        "lat": -30.0240368
    }, {
        "lng": -51.1967683,
        "lat": -30.0241084
    }, {
        "lng": -51.1967775,
        "lat": -30.0240529
    }, {
        "lng": -51.1967963,
        "lat": -30.0240266
    }, {
        "lng": -51.1967664,
        "lat": -30.0240394
    }, {
        "lng": -51.196769,
        "lat": -30.024049
    }, {
        "lng": -51.19686,
        "lat": -30.0240675
    }, {
        "lng": -51.1968046,
        "lat": -30.0240185
    }, {
        "lng": -51.1967964,
        "lat": -30.0240367
    }, {
        "lng": -51.1967799,
        "lat": -30.0240398
    }, {
        "lng": -51.1967766,
        "lat": -30.0240536
    }, {
        "lng": -51.1968004,
        "lat": -30.0240525
    }, {
        "lng": -51.196782,
        "lat": -30.024039
    }, {
        "lng": -51.1967512,
        "lat": -30.0240791
    }, {
        "lng": -51.1967679,
        "lat": -30.0241021
    }, {
        "lng": -51.1967741,
        "lat": -30.0240277
    }, {
        "lng": -51.196777,
        "lat": -30.0240248
    }, {
        "lng": -51.1967899,
        "lat": -30.0240259
    }, {
        "lng": -51.1968019,
        "lat": -30.0240283
    }, {
        "lng": -51.1968161,
        "lat": -30.0240362
    }, {
        "lng": -51.1968015,
        "lat": -30.0240256
    }, {
        "lng": -51.1967787,
        "lat": -30.0240397
    }, {
        "lng": -51.1967913,
        "lat": -30.0240431
    }, {
        "lng": -51.1967787,
        "lat": -30.0240306
    }, {
        "lng": -51.1967709,
        "lat": -30.0240405
    }, {
        "lng": -51.1967086,
        "lat": -30.0240977
    }, {
        "lng": -51.1967783,
        "lat": -30.0240354
    }, {
        "lng": -51.1967978,
        "lat": -30.0240174
    }, {
        "lng": -51.196778,
        "lat": -30.0240394
    }, {
        "lng": -51.1968051,
        "lat": -30.024042
    }, {
        "lng": -51.1967798,
        "lat": -30.02404
    }, {
        "lng": -51.1967929,
        "lat": -30.0240283
    }, {
        "lng": -51.1968121,
        "lat": -30.0240512
    }, {
        "lng": -51.1967925,
        "lat": -30.0240235
    }, {
        "lng": -51.1967797,
        "lat": -30.0241119
    }, {
        "lng": -51.1967915,
        "lat": -30.0240549
    }, {
        "lng": -51.1967209,
        "lat": -30.0240963
    }, {
        "lng": -51.1967608,
        "lat": -30.024078
    }, {
        "lng": -51.1967872,
        "lat": -30.024039
    }, {
        "lng": -51.1967759,
        "lat": -30.0239723
    }, {
        "lng": -51.1967719,
        "lat": -30.0236188
    }, {
        "lng": -51.1970606,
        "lat": -30.0232767
    }, {
        "lng": -51.197355,
        "lat": -30.0233788
    }, {
        "lng": -51.1978331,
        "lat": -30.0235103
    }, {
        "lng": -51.1983858,
        "lat": -30.0236746
    }, {
        "lng": -51.1986596,
        "lat": -30.0236317
    }, {
        "lng": -51.199179,
        "lat": -30.0235932
    }, {
        "lng": -51.1997841,
        "lat": -30.0238801
    }, {
        "lng": -51.1999765,
        "lat": -30.0238089
    }, {
        "lng": -51.2002499,
        "lat": -30.0240255
    }, {
        "lng": -51.2004268,
        "lat": -30.0241288
    }, {
        "lng": -51.2009461,
        "lat": -30.0246696
    }, {
        "lng": -51.2008955,
        "lat": -30.024638
    }, {
        "lng": -51.2012349,
        "lat": -30.0250145
    }, {
        "lng": -51.2015521,
        "lat": -30.0252568
    }, {
        "lng": -51.2016699,
        "lat": -30.0252989
    }, {
        "lng": -51.2021971,
        "lat": -30.0255711
    }, {
        "lng": -51.2022597,
        "lat": -30.0256908
    }, {
        "lng": -51.2024792,
        "lat": -30.0259184
    }, {
        "lng": -51.2030159,
        "lat": -30.026328
    }, {
        "lng": -51.2031395,
        "lat": -30.0264779
    }, {
        "lng": -51.2035198,
        "lat": -30.0267912
    }, {
        "lng": -51.203676,
        "lat": -30.0269072
    }, {
        "lng": -51.2038362,
        "lat": -30.0271109
    }, {
        "lng": -51.2040549,
        "lat": -30.0273453
    }, {
        "lng": -51.2040554,
        "lat": -30.0273701
    }, {
        "lng": -51.2040217,
        "lat": -30.0273662
    }, {
        "lng": -51.2040207,
        "lat": -30.0271913
    }, {
        "lng": -51.203999,
        "lat": -30.0273642
    }, {
        "lng": -51.2036113,
        "lat": -30.0277899
    }, {
        "lng": -51.2035475,
        "lat": -30.027286
    }, {
        "lng": -51.2036798,
        "lat": -30.0273545
    }, {
        "lng": -51.2036495,
        "lat": -30.0273818
    }, {
        "lng": -51.203585,
        "lat": -30.027503
    }, {
        "lng": -51.2035743,
        "lat": -30.0273649
    }, {
        "lng": -51.2039674,
        "lat": -30.0273962
    }, {
        "lng": -51.2036235,
        "lat": -30.027316
    }, {
        "lng": -51.2038159,
        "lat": -30.0273931
    }, {
        "lng": -51.2035633,
        "lat": -30.0274372
    }, {
        "lng": -51.2037701,
        "lat": -30.0273546
    }, {
        "lng": -51.2037326,
        "lat": -30.0273472
    }, {
        "lng": -51.2037599,
        "lat": -30.0273454
    }, {
        "lng": -51.2037092,
        "lat": -30.0273298
    }, {
        "lng": -51.2037442,
        "lat": -30.0274972
    }, {
        "lng": -51.2036975,
        "lat": -30.0273156
    }, {
        "lng": -51.2036892,
        "lat": -30.0273215
    }, {
        "lng": -51.2036112,
        "lat": -30.0273742
    }, {
        "lng": -51.2036324,
        "lat": -30.0274139
    }, {
        "lng": -51.2035085,
        "lat": -30.0274562
    }, {
        "lng": -51.2034703,
        "lat": -30.0274493
    }, {
        "lng": -51.2037834,
        "lat": -30.0273556
    }, {
        "lng": -51.2034844,
        "lat": -30.027456
    }, {
        "lng": -51.2039674,
        "lat": -30.0273962
    }, {
        "lng": -51.2034771,
        "lat": -30.0274915
    }, {
        "lng": -51.2035871,
        "lat": -30.0275997
    }, {
        "lng": -51.2033695,
        "lat": -30.0275102
    }, {
        "lng": -51.2032876,
        "lat": -30.0278425
    }
]