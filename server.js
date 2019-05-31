var express = require('express')
  , imageDataURI = require('image-data-uri')
  , bodyParser = require('body-parser')
  , file = require('fs')
  , app = express()
  , env = { Local: 0, Azure: 1 }
  , envMode = env.Azure
  , port

app.use(express.static('www'))
app.use(bodyParser.json({limit: '10mb'})) 
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

//////////////////////////////////////////////////////////
// http operations for injoyInterface
//////////////////////////////////////////////////////////

app.get('/user', (request, response) => {

	UserModel.find({ user: request.query.user }, function(err, users) { 
		if (err) {
			response.send({ message: "Não Éh uz Guri: " + err})
			throw err
		}

		response.send(users)
	});
})

app.get('/rolesForMe', (request, response) => {

	let user = request.body.user

	RoleModel.find({}, function(err, roles) { 
		if (err) {
			response.send({ message: "Não Éh uz Guri: " + err})
			throw err
		}

		lists = [
			{ title: 'Todos os rolês', roles: roles },
			{ title: 'Novidades', roles: roles.slice().reverse() }
		]
		response.send(lists)
	});
})

app.get('/rolesAround', (request, response) => {

	location = JSON.parse(request.query.location)

	RoleModel.find({ $and: [
		{ "location.lat": { $lt: location.lat + latitudeThreshold*10 } },
		{ "location.lat": { $gt: location.lat - latitudeThreshold*10 } },
		{ "location.lng": { $lt: location.lng + longitudeThreshold*10 } },
		{ "location.lng": { $gt: location.lng - longitudeThreshold*10 } } ]}, (err, roles) => { 
			
			if (err) {
				response.send({ message: "Não Éh uz Guri: " + err})
				throw err
			}

			response.send(roles)
	})
})

app.get('/myExperiences', (request, response) => {
	
	ExperienceModel.find({ user: request.query.user }, function(err, experiences) { 
		if (err) {
			response.send({ message: "Não Éh uz Guri: " + err})
			throw err
		}

		response.send({
			achievements: [
				{ title: 'Rolês descobertos por você', value: experiences.length }
			],
			experiences: experiences.slice().reverse()
		})
	});
})

app.post('/user', (request, response) => { 

	let newUser = new UserModel(request.body)
	newUser.save(err => {
		if (err) {
			response.send({ message: "Não Éh uz Guri: " + err})
			throw err
		}

		response.send({ message: "Éh uz Guri"})
	})
})

app.post('/experience', (request, response) => { 

	if (request.body.pic)
		request.body.pic.data = imageDataURI.decode('data:'+request.body.pic.contentType+';base64,'+request.body.pic.data).dataBuffer

	let newExperience = new ExperienceModel({
		user: request.body.user,
		name: request.body.name,
		ratting: request.body.ratting,
		location: request.body.location,
		date: request.body.date,
		pic: request.body.pic,
		comment: request.body.comment,
		tag: request.body.tag
	})
	newExperience.save(err => { 
		if (err) {
			response.send({ message: "Não Éh uz Guri: " + err})
			throw err
		}

		RoleModel.find({ name: request.body.name }, (err, roles) => { 
			if (err) {
				response.send({ message: "Não Éh uz Guri: " + err})
				throw err
			}
			else if (roles.length == 0) {
				let newRole = new RoleModel({
					name: request.body.name,
					ratting: request.body.ratting,
					location: request.body.location,
					address: '',
					pic: request.body.pic,
					pics: [],
					comments: [ request.body.comment ],
					tags: [ request.body.tag ]
				})
				newRole.save(err => { 
					if (err) {
						response.send({ message: "Não Éh uz Guri: " + err})
						throw err
					}

					response.send({ message: "Éh uz Guri"})
				})
			}
			else {
				RoleModel.update({ name: roles[0].name }, { $addToSet: { tags: request.body.tag } }, err => {
					if (err) {
						response.send({ message: "Não Éh uz Guri: " + err})
						throw err
					}

					if (request.body.pic)
						RoleModel.update({ name: roles[0].name }, { $push: { pics: request.body.pic } }, err => {
							if (err) {
								response.send({ message: "Não Éh uz Guri: " + err})
								throw err
							}

							if (request.body.pic)
								RoleModel.update({ name: roles[0].name }, { $push: { comments: request.body.comment } }, err => {
									if (err) {
										response.send({ message: "Não Éh uz Guri: " + err})
										throw err
									}
				
									response.send({ message: "Éh uz Guri"})
								})
							else
								response.send({ message: "Éh uz Guri"})
						})
					else
						response.send({ message: "Éh uz Guri"})
				})
			}
		});
	})
})

//////////////////////////////////////////////////////////
// http server operactions
//////////////////////////////////////////////////////////

process.argv.forEach((val, index, array) => { if (val === 'local') { envMode = env.Local } })
  
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
mongoose.connect('mongodb://injoyserverdb.documents.azure.com:10255/injoy?ssl=true', { auth: { user: 'injoyserverdb', password: 'eiHlZ9VM4595rukD7x58HrW0rHTLZZRElLwFadq4qj70HRXfzP4N9RKeOVq7acyHrMYoMt3iqeeSbudYF4sJhA==' }})
  .then(() => { console.log('Mongoose is connected to MongoDb on 27017') })
  .catch(err => { console.log('error: '+err) })

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { console.log('connected to mongo') });

var userSchema = mongoose.Schema({
	user: String,
	email: String
});

var UserModel = mongoose.model('users', userSchema);

var imgSchema = mongoose.Schema({ data: Buffer, contentType: String })
var locationSchema = mongoose.Schema({ lat: Number, lng: Number })

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

var RoleModel = mongoose.model('roles', roleSchema);

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

var ExperienceModel = mongoose.model('experiences', experienceSchema);

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
//     location: { lat: -30.041674, lng: -51.221539 },
//     address: 'R. José do Patrocínio, 797 - Cidade Baixa, Porto Alegre - RS',
// 	pics: [],
// 	pic: { data: file.readFileSync("./images/bars/redDoor.jpg"), contentType: 'image/jpg' },
//     comments: [],
//     tags: []
// })
// var voidModel = new RoleModel({
//     name: 'Void',
//     ratting: 3,
//     location: { lat: -30.024672, lng: -51.203145 },
// 	address: 'R. Luciana de Abreu, 364 - Moinhos de Vento, Porto Alegre - RS',
// 	pics: [],
//     pic: { data: file.readFileSync("./images/bars/void.jpg"), contentType: 'image/jpg' },
//     comments: [],
//     tags: []
// })
// ap11Model.save(function(err) { if (err) throw err })
// redDoor.save(function(err) { if (err) throw err })
//voidModel.save(function(err) { if (err) throw err })