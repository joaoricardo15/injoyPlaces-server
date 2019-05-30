var express = require('express')
  , file = require('fs')
  , bodyParser = require('body-parser')
  , imageDataURI = require('image-data-uri')
  , app = express()
  , env = { Local: 0, Azure: 1 }
  , envMode = env.Azure
  , port

app.use(express.static('www'))
app.use(bodyParser.json({limit: '5mb'})) //app.use(bodyParser.urlencoded({ extended: false }))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});

/*/////////////////// Conversão de precisão em graus para distancia /////////////////////

    1grau latitude = 111.12Km
    
    1grau longitude = 111.12km * cos(latitude) 
    
    nossa latitude = +- -30grau -> cos(-30) = +- 0.87

    -> para uma area quadrada de 20m:
    
    40m correspondem a +- 0.00036 graus de latitude
    
    40m correspondem a +- 0.00042 graus de longitude

/////////////////////////////////////////////////////////////////////////////////////////*/

var userPositions = []

var maxPositionsPerUser = 1000
var latitudeThreshold = 0.00036
var longitudeThreshold = 0.00042
var localMinimunInterval = 600

app.post('/positions', function(req, res) {
	for (let i = 0; i < req.body.length; i++) { addLocation(req.body[i]) }
    res.send({ message: 'É uz Guri' })
})

app.get('/positions', function(req, res) {
    res.send(userPositions)
})

app.delete('/positions', function(req, res) {
    userPositions = []
    res.send("ok")
})



function addLocation(position) {

	let index = userPositions.findIndex(userPosition => userPosition.user === position.user)

	let timeStamp = position['timeStamp'] ? position['timeStamp'] : Date.now()

	if(index < 0) {
		userPositions.push({ user: position.user, currentLocal: { arrival: timeStamp, lng: position.lng, lat: position.lat, samples: 1, departure: null }, locations: [{ lng: position.lng, lat: position.lat, timeStamp: timeStamp}], locals: []});
	}
	else {
			let user = userPositions[index]
			user.locations.push({ lng: position.lng, lat: position.lat , timeStamp: timeStamp})
			if (user.locations.length > maxPositionsPerUser) {
				user.locations.splice(0, 1)
			}

			let latitudeDifference = Math.abs(position.lat - user.currentLocal.lat)
			let longitudeDifference = Math.abs(position.lng - user.currentLocal.lng)
			
			if (latitudeDifference < latitudeThreshold && longitudeDifference < longitudeThreshold) {

					let lastLatitude = user.currentLocal.lat
					let lastLongitude = user.currentLocal.lng
					user.currentLocal.lat = (lastLatitude*user.currentLocal.samples + position.lat) / (user.currentLocal.samples + 1)
					user.currentLocal.lng = (lastLongitude*user.currentLocal.samples + position.lng) / (user.currentLocal.samples + 1)
					user.currentLocal.samples++
					user.currentLocal.departure = timeStamp

					let elapsedTime = user.currentLocal.departure - user.currentLocal.arrival
					
					if (elapsedTime > localMinimunInterval*1000) {
							
							let newLocal = { arrival: new Date(user.currentLocal.arrival), departure: new Date(user.currentLocal.departure), lat: user.currentLocal.lat, lng: user.currentLocal.lng }

							if (user.locals.length > 0) {

									latitudeDifference = Math.abs(user.currentLocal.lat - user.locals[user.locals.length-1].lat)
									longitudeDifference = Math.abs(user.currentLocal.lng - user.locals[user.locals.length-1].lng)

									if (latitudeDifference < latitudeThreshold && longitudeDifference < longitudeThreshold) {
											user.locals[user.locals.length-1].departure = new Date(timeStamp)
									}
									else {
											user.locals.push(newLocal)
											user.currentLocal = { arrival: timeStamp, lng: position.lng, lat: position.lat, samples: 1, departure: null }
									}
							}
							else {
									user.locals.push(newLocal)
									user.currentLocal = { arrival: timeStamp, lng: position.lng, lat: position.lat, samples: 1, departure: null }
							}
					}
			}
			else {
					user.currentLocal = { arrival: timeStamp, lng: position.lng, lat: position.lat, samples: 1, departure: null }
			}
	}
}

app.post('/role', (req, res) => { 

	req.body.pic.data = imageDataURI.decode('data:'+req.body.pic.contentType+';base64,'+req.body.pic.data).dataBuffer

	RoleModel.find({ name: req.body.name }, function(err, roles) { 
		if (roles.length == 0) {
			let newRole = new RoleModel(req.body)
			newRole.save(function(err) { if (err) throw err })
		}
		else if (err) {
			console.log('res: ' + err)
		}
		res.send({ message: "Éh uz Guri"})
	});
})

app.post('/experience', (req, res) => { 

	req.body.pic.data = imageDataURI.decode('data:'+req.body.pic.contentType+';base64,'+req.body.pic.data).dataBuffer

	req.body['user'] = 'dao'

	let newExperience = new ExperienceModel(req.body)
	newExperience.save(function(err) { if (err) throw err })

	RoleModel.find({ name: req.body.name }, function(err, roles) { 
		if (roles.length == 0) {
			let newRole = new RoleModel({
				name: req.body.name,
				ratting: req.body.ratting,
				location: req.body.location,
				address: req.body.location,
				pic: req.body.pic,
				pics: [],
				comments: [ req.body.comment ],
				tags: [ req.body.tag ]
			})
			newRole.save(function(err) { if (err) throw err })
		}
		else if (err) {
			console.log('res: ' + err)
		}
		res.send({ message: "Éh uz Guri"})
	});
})

app.get('/roles', function(request, response) {
	RoleModel.find({}, function(err, res) { 
		if (res) {
			response.send(res)
		}
		else if (err)
			console.log('res: ' + err)
	});
})

app.get('/experiences', function(request, response) {
	ExperienceModel.find({}, function(err, res) { 
		if (res) {
			response.send(res)
		}
		else if (err)
			console.log('res: ' + err)
	});
})

//////////////////////////////////////////////////////////
// http server operactions
//////////////////////////////////////////////////////////

process.argv.forEach((val, index, array) => {
    if (val === 'local') {
        envMode = env.Local
    }
})
  
if (envMode === env.Local)
    port = 1000
else
    port = process.env.PORT

app.listen(port, function (error) {
    if(!error)
        console.log('Find server is listen to port: ' + port)
    else
        console.log('error on find server inicialization: ' + error)
})

//////////////////////////////////////////////////////////
// data base operactions
//////////////////////////////////////////////////////////

var mongoose = require('mongoose')

mongoose.connect('mongodb://injoyserver:Yjjbr7SeP03oIKbHgvRAvO8lzEB4U2NNlPGx9IDIiqt3dnq5QQ32SjRVvQY3GFjhYOQf0gpCR393jiqrjnAawQ%3D%3D@injoyserver.documents.azure.com:10255/injoy?ssl=true', function(err, res) {
  if ( err )
    console.log('error: '+err);
  else
    console.log('Mongoose is connected to MongoDb on 27017');
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { console.log('connected to mongo') });

var imgSchema = mongoose.Schema({ data: Buffer, contentType: String })
var locationSchema = mongoose.Schema({ lat: String, lng: String })

var roleSchema = mongoose.Schema({
	name: String,
	ratting: Number,
	location: locationSchema,
	address: String,
	pic: imgSchema,
	pics: [ imgSchema ],
	comments: [ String ],
	tags: [ String ]
});

var RoleModel = mongoose.model('role', roleSchema);

var experienceSchema = mongoose.Schema({
	user: String,
	name: String,
	ratting: Number,
	location: locationSchema,
	date: Date,
	pic: imgSchema,
	comment: String,
	tag: String
});

var ExperienceModel = mongoose.model('experience', experienceSchema);

// var ap11Model = new RoleModel({
// 	name: 'Ap11',
// 	ratting: 5,
// 	location: { lat: -30.039171, lng: -51.220676 },
// 	address: 'R. General Lima e Silva, 697 - Cidade Baixa, Porto Alegre - RS',
// 	pics: [],
// 	pic: { data: file.readFileSync("./images/bars/ap11.jpg"), contentType: 'image/jpg' },
// 	comments: [],
// 	tags: []
// })
// var redDoor = new RoleModel({
//     name: 'Red Door',
//     ratting: 4,
//     location: { latitude: -30.041674, longitude: -51.221539 },
//     address: 'R. José do Patrocínio, 797 - Cidade Baixa, Porto Alegre - RS',
// 	pics: [],
// 	pic: { data: file.readFileSync("./images/bars/redDoor.jpg"), contentType: 'image/jpg' },
//     comments: [],
//     tags: []
// })
// var voidModel = new RoleModel({
//     name: 'Void',
//     ratting: 3,
//     location: { latitude: -30.024672, longitude: -51.203145 },
// 	address: 'R. Luciana de Abreu, 364 - Moinhos de Vento, Porto Alegre - RS',
// 	pics: [],
//     pic: { data: file.readFileSync("./images/bars/void.jpg"), contentType: 'image/jpg' },
//     comments: [],
//     tags: []
// })
// ap11Model.save(function(err) { if (err) throw err })
// redDoor.save(function(err) { if (err) throw err })
// voidModel.save(function(err) { if (err) throw err })