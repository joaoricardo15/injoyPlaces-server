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

    -> para uma area quadrada de lado igual à 50m:
    
		50m correspondem a +- 0.00045 graus de latitude
		
		50m correspondem a +- 50/(111120.cos(lng))  graus de latitude

/////////////////////////////////////////////////////////////////////////////////////////*/

var userPositions = []
const maxPositionsPerUser = 1000
const localMinimunInterval = 600


const squaredArea = 50
const geoLocationConstant = 111120
const latitudeThreshold = squaredArea/geoLocationConstant

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

	let longitudeThreshold = squaredArea/(geoLocationConstant*Math.cos(position.lng))

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

			// se eu estou permanecendo em um local
			let lastLatitude = user.currentLocal.lat
			let lastLongitude = user.currentLocal.lng
			user.currentLocal.lat = (lastLatitude*user.currentLocal.samples + position.lat) / (user.currentLocal.samples + 1)
			user.currentLocal.lng = (lastLongitude*user.currentLocal.samples + position.lng) / (user.currentLocal.samples + 1)
			user.currentLocal.samples++
			user.currentLocal.departure = timeStamp

			let elapsedTime = user.currentLocal.departure - user.currentLocal.arrival
			
			if (elapsedTime > localMinimunInterval*1000) {
					
				// se eu já estou neste lugar à mais de 10min
				let newLocal = { arrival: new Date(user.currentLocal.arrival), departure: new Date(user.currentLocal.departure), lat: user.currentLocal.lat, lng: user.currentLocal.lng }

				if (user.locals.length > 0) {

					// se já existem locais na minha lista
					latitudeDifference = Math.abs(user.currentLocal.lat - user.locals[user.locals.length-1].lat)
					longitudeDifference = Math.abs(user.currentLocal.lng - user.locals[user.locals.length-1].lng)

					if (latitudeDifference < latitudeThreshold && longitudeDifference < longitudeThreshold) {

						// se o local onde eu estou já foi adicionado, atualizo-o
						user.locals[user.locals.length-1].departure = new Date(timeStamp)
					}
					else {

						// adiciono o meu locoal atual à lista 'meus locais' 
						user.locals.push(newLocal)
						user.currentLocal = { arrival: timeStamp, lng: position.lng, lat: position.lat, samples: 1, departure: null }

						// adiciono uma nova experiência ao usuário
						addExperience(user.user, user.currentLocal.lat, user.currentLocal.lng, user.currentLocal.arrival)
					}
				}
				else {

					// adiciono o meu locoal atual à lista 'meus locais' 
					user.locals.push(newLocal)
					user.currentLocal = { arrival: timeStamp, lng: position.lng, lat: position.lat, samples: 1, departure: null }

					//restrinjo a quantidade de locais a 100 elementos
					if (user.locals.length > maxPositionsPerUser) {
						user.locals.splice(0, 1)
					}

					// adiciono uma nova experiência ao usuário
					addExperience(user.user, user.currentLocal.lat, user.currentLocal.lng, user.currentLocal.arrival, user.currentLocal.departure)
				}
			}
		}
		else {
			user.currentLocal = { arrival: timeStamp, lng: position.lng, lat: position.lat, samples: 1, departure: null }
		}
	}
}

function addExperience(user, localLat, localLng, arrival, departure) {

	ExperienceModel.find({ user: user }, function(err, experiences) { 
		if (err) {
			response.send({ message: "Não Éh uz Guri: " + err})
			throw err
		}

		let longitudeThreshold = squaredArea/(geoLocationConstant*Math.cos(localLng))

		for (let i = 0; i < experiences.length; i++) {
			
			latitudeDifference = Math.abs(localLat - experiences[i].location.lat)
			longitudeDifference = Math.abs(localLng - experiences[i].location.lng)

			if (latitudeDifference < latitudeThreshold && longitudeDifference < longitudeThreshold) {
				let newExperience = {
					user: user,
					name: experiences[i].name,
					address: experiences[i].address,
					location: { lat: localLat, lng: localLng },
					arrival: new Date(arrival),
					departure: new Date(departure)
				}

				let newExperienceModel = new ExperienceModel(newExperience)
				newExperienceModel.save(err => { 
					if (err) {
						response.send({ message: "Não Éh uz Guri: " + err})
						throw err
					}
				})

				return
			}
		} 
	})
}

function updateExperience(user, departure) {
	ExperienceModel.update({
		$and: [ { user: user } ]}, {
		$set: { "departure": departure } }, 
		err => {
			if (err) {
				response.send({ message: "Não Éh uz Guri: " + err})
				throw err
			}
		})
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

		rolesIndexes = []

		for (let i = 0; i < roles.length; i++) {
			rolesIndexes.push(i)
		}
		
		rolesForYou = {
			roles: roles,
			myLists: [
				{ title: 'Para você', icon: 'flame', roles: rolesIndexes },
				{ title: 'Bares', icon: 'beer', roles: rolesIndexes.slice().reverse() },
				{ title: 'Restaurantes', icon: 'restaurant', roles: rolesIndexes },
				{ title: 'Próximos', icon: 'pin', roles: rolesIndexes.slice().reverse() }
			]
		}
		response.send(rolesForYou)
	});
})

app.get('/rolesAround', (request, response) => {

	location = JSON.parse(request.query.location)

	var longitudeThreshold = squaredArea/(geoLocationConstant*Math.cos(location.lng))

	RoleModel
		.find({ $and: [
			{ "location.lat": { $lt: location.lat + latitudeThreshold } },
			{ "location.lat": { $gt: location.lat - latitudeThreshold } },
			{ "location.lng": { $lt: location.lng + longitudeThreshold } },
			{ "location.lng": { $gt: location.lng - longitudeThreshold } } ] } ) //, (err, roles) => { 
		.sort({ "ratting.rattings": -1})
		.limit(20)
		.then(roles => { 
			response.send(roles)
		})
		.catch(err => {
			if (err) {
				response.send({ message: "Não Éh uz Guri: " + err})
				throw err
			}
		})
})

app.get('/myExperiences', (request, response) => {
	
	ExperienceModel.find({ user: request.query.user }, function(err, experiences) { 
		if (err) {
			response.send({ message: "Não Éh uz Guri: " + err})
			throw err
		}

		myExperiences = {
			achievements: [
				{ 
					title: 'Newbie',
					subtitle: 'Você foi um dos early adopters do InJoy',
					message: 'Título de Newbie. Você foi um dos primeiros a utilizar o InJoy' 
				},
				{ 
					title: 'Descobridor', 
					icon: 'compass', 
					value: experiences.length > 0 ? experiences.length : null,
					message: 'Troféu Descobridor. Para conquistá-lo, você precisa adicionar no mínimo 3 novos rolês' 
				},
				{ 
					title: 'Gourmet', 
					icon: 'restaurant',
					message: 'Troféu Gourmet. Para conquistá-lo, você precisa regsitrar no mínimo 10 experiências em restaurantes conceituados na cidade' 
				},
				{ 
					title: 'Bebedeira', 
					icon: 'beer', 
					message: 'Troféu Bebedeira. Para conquistá-lo, você precisa registrar no mínimo 3 experiências em bares dentro de uma semana!' 
				},
				{ 
					title: 'Rolezeiro', 
					icon: 'flame', 
					message: 'Troféu Rolezeiro. Para conquistá-lo, você precisa registrar no mínimo 3 experiências dentro de uma semana!' 
				},
				{ 
					title: 'Blogueiro', 
					icon: 'camera', 
					message: 'Troféu Blogueiro. Para conquistá-lo, você precisa registrar no mínimo 3 experiências com foto' 
				},
				{ 
					title: 'Avaliador', 
					icon: 'thumbs-up', 
					message: 'Troféu Avaliador. Para conquistá-lo, você precisa registrar no mínimo 3 experiências com avaliação!' 
				},
				{ 
					title: 'Viajante', 
					icon: 'globe', 
					message: 'Troféu Viajante. Para conquistá-lo, você precisa registrar no mínimo 3 experiências em regiões diferentes' 
				},
			],
			experiences: experiences.slice().reverse()
		}

		statistics = [
			{
				name: 'Experiências',
				img: { data: file.readFileSync("./images/homer-icon.png"), contentType: 'image/jpg' },
				value: experiences.length
			}
		]

		let rattings = 0
		let occasions = 0
		let tags = 0
		let pics = 0
		let comments = 0

		for (let i = 0; i < experiences.length; i++) {
			if (experiences[i].ratting)
				rattings++
			if (experiences[i].occasion)
				occasions++
			if (experiences[i].tag)
				tags++
			if (experiences[i].pic)
				pics++
			if (experiences[i].comment)
				comments++
		}

		if (rattings > 0)
			statistics.push({
				name: 'Avaliações',
				img: { data: file.readFileSync("./images/bart-icon.png"), contentType: 'image/jpg' },
				value: rattings,
			})

		if (occasions > 0)
			statistics.push({
				name: 'Ocasiões',
				img: { data: file.readFileSync("./images/bart-icon.png"), contentType: 'image/jpg' },
				value: occasions,
			})	

		if (tags > 0)
			statistics.push({
				name: '#hashtags',
				img: { data: file.readFileSync("./images/bart-icon.png"), contentType: 'image/jpg' },
				value: tags,
			})
			
		if (pics > 0)
			statistics.push({
				name: 'Fotos',
				img: { data: file.readFileSync("./images/bart-icon.png"), contentType: 'image/jpg' },
				value: pics,
			})
		
		if (comments > 0)
			statistics.push({
				name: 'Comentários',
				img: { data: file.readFileSync("./images/bart-icon.png"), contentType: 'image/jpg' },
				value: comments,
			})
		
		myExperiences['statistics'] = statistics

		response.send(myExperiences)
	});
})

app.post('/user', (request, response) => { 

	let newUserModel = new UserModel(request.body)
	newUserModel.save(err => {
		if (err) {
			response.send({ message: "Não Éh uz Guri: " + err})
			throw err
		}

		response.send({ message: "Éh uz Guri"})
	})
})

app.post('/experience', async (request, response) => { 

	let newExperience = {
		user: request.body.user,
		name: request.body.name,
		ratting: request.body.ratting,
		location: request.body.location,
		address: request.body.address,
		date: request.body.date,
		pic: request.body.pic ? { data: imageDataURI.decode('data:'+request.body.pic.contentType+';base64,'+request.body.pic.data).dataBuffer, Buffer, contentType: request.body.pic.contentType } : null,
		comment: request.body.comment,
		occasion: request.body.occasion,
		tag: request.body.tag
	}

	RoleModel.findOne({ name: newExperience.name }, (err, role) => { 		
		if (err) {
			response.send({ message: "Não Éh uz Guri: " + err})
			throw err
		}
		else if (!role) {

			let newRoleModel = new RoleModel({
				name: newExperience.name,
				location: newExperience.location,
				address: newExperience.address,
				ratting: newExperience.ratting ? { average: newExperience.ratting , rattings: 1 } : { average: 5 , rattings: 1 },
				pic: newExperience.pic ? 0 : null,
				pics: newExperience.pic ? [ newExperience.pic ] : [],
				comments: newExperience.comment ? [ newExperience.comment ]: [],
				occasions: newExperience.occasion ? [ newExperience.occasion ] : [],
				tags: newExperience.tag ? [ newExperience.tag ] : []
			})

			newRoleModel.save(err => { 
				if (err) {
					response.send({ message: "Não Éh uz Guri: " + err})
					throw err
				}
			})
		}
		else {

			RoleModel.update({ name: role.name }, { 
				$set: {
						"location.lat": (role.location.lat*role.ratting.rattings + newExperience.location.lat)/(role.ratting.rattings + 1), 
						"location.lng": (role.location.lng*role.ratting.rattings + newExperience.location.lng)/(role.ratting.rattings + 1) } 
				}, err => {
					if (err) {
						response.send({ message: "Não Éh uz Guri: " + err})
						throw err
					}
				})

			if (request.body.ratting) 
				RoleModel.update({ name: role.name }, { $set: { "ratting.average": (role.ratting.average*role.ratting.rattings + newExperience.ratting)/(role.ratting.rattings + 1), "ratting.rattings": role.ratting.rattings + 1, } }, err => {
					if (err) {
						response.send({ message: "Não Éh uz Guri: " + err})
						throw err
					}
				})

			if (request.body.occasion) 
				RoleModel.update({ name: role.name }, { $addToSet: { occasions: newExperience.occasion } }, err => {
					if (err) {
						response.send({ message: "Não Éh uz Guri: " + err})
						throw err
					}
				})

			if (request.body.tag) 
				RoleModel.update({ name: role.name }, { $addToSet: { tags: newExperience.tag } }, err => {
					if (err) {
						response.send({ message: "Não Éh uz Guri: " + err})
						throw err
					}
				})

			if (request.body.pic) {
				if (role.pic !== 0)
					RoleModel.update({ name: role.name }, { $set: { pic: 0 } }, err => {
						if (err) {
							response.send({ message: "Não Éh uz Guri: " + err})
							throw err
						}
					})

				RoleModel.update({ name: role.name }, { $push: { pics: newExperience.pic } }, err => {
					if (err) {
						response.send({ message: "Não Éh uz Guri: " + err})
						throw err
					}
				})
			}
				

			if (request.body.comment)
				RoleModel.update({ name: role.name }, { $push: { comments: newExperience.comment } }, err => {
					if (err) {
						response.send({ message: "Não Éh uz Guri: " + err})
						throw err
					}
				})
		}

		let newExperienceModel = new ExperienceModel(newExperience)
		newExperienceModel.save(err => { 
			if (err) {
				response.send({ message: "Não Éh uz Guri: " + err})
				throw err
			}
			response.send({ message: "Éh uz Guri"})
		})
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

var locationSchema = mongoose.Schema({ lat: Number, lng: Number })
var addressSchema = mongoose.Schema({ street: String, number: Number, complement: String,  suburb: String, city: String, state: String, country: String })
var rattingSchema = mongoose.Schema({ rattings: Number, average: Number })
var imgSchema = mongoose.Schema({ data: Buffer, contentType: String })

var roleSchema = mongoose.Schema({
	name: String,
	ratting: rattingSchema,
	location: locationSchema,
	address: addressSchema,
	pic: Number,
	pics: [ imgSchema ],
	comments: [ String ],
	occasions: [ String ],
	tags: [ String ]
})

var experienceSchema = mongoose.Schema({
	user: String,
	name: String,
	ratting: Number,
	location: locationSchema,
	address: addressSchema,
	date: Date,
	arrival: Date,
	departure: Date,
	pic: imgSchema,
	comment: String,
	occasion: String,
	tag: String
})

var userSchema = mongoose.Schema({ 
	user: String,
	email: String
})

var UserModel = mongoose.model('users', userSchema);
var RoleModel = mongoose.model('roles', roleSchema);
var ExperienceModel = mongoose.model('experiences', experienceSchema);

// var ap11Model = new RoleModel({
// 	name: 'Ap11',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.039171, lng: -51.220676 },
// 	address: { 
// 		street: 'R. General Lima e Silva',
// 		number: 697,
// 		suburb: 'Cidade Baixa',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/bars/ap11.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	comments: [],
// 	occasions: [],
// 	tags: []
// })
// var redDoor = new RoleModel({
// 	name: 'Red Door',
// 	ratting: { rattings: 1, average: 4 },
// 	location: { lat: -30.041674, lng: -51.221539 },
// 	address: {
// 		street: 'R. José do Patrocínio', 
// 		number: 797,
// 		suburb: 'Cidade Baixa',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/bars/redDoor.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	comments: [],
// 	occasions: [],
// 	tags: []
// })
// var voidModel = new RoleModel({
// 	name: 'Void',
// 	ratting: { rattings: 1, average: 4 },
// 	location: { lat: -30.024672, lng: -51.203145 },
// 	address: {
// 		street: 'R. Luciana de Abreu',
// 		number: 364,
// 		suburb: 'Moinhos de Vento',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/bars/void.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	comments: [],
// 	occasions: [],
// 	tags: []
// })
// ap11Model.save(function(err) { if (err) throw err })
// redDoor.save(function(err) { if (err) throw err })
// voidModel.save(function(err) { if (err) throw err })

// var user = { user: 'dao', locals: [{ lat: -30.029389807692308, lng: -51.20783051538462 }] }
// var timeStamp = Date.now()

// ExperienceModel.find({ user: user.user }, function(err, experiences) { 
// 	if (err) {
// 		response.send({ message: "Não Éh uz Guri: " + err})
// 		throw err
// 	}

// 	let longitudeThreshold = squaredArea/(geoLocationConstant*Math.cos(user.locals[user.locals.length-1].lng))

// 	for (let i = 0; i < experiences.length; i++) {
		
// 		latitudeDifference = Math.abs(user.locals[user.locals.length-1].lat - experiences[i].location.lat)
// 		longitudeDifference = Math.abs(user.locals[user.locals.length-1].lng - experiences[i].location.lng)

// 		if (latitudeDifference < latitudeThreshold && longitudeDifference < longitudeThreshold) {
// 			let newExperience = {
// 				user: user.user,
// 				name: experiences[i].name,
// 				address: experiences[i].address,
// 				location: { lat: user.locals[user.locals.length-1].lat, lng: user.locals[user.locals.length-1].lng },
// 				date: new Date(timeStamp),
// 			}

// 			let newExperienceModel = new ExperienceModel(newExperience)
// 			newExperienceModel.save(err => { 
// 				if (err) {
// 					response.send({ message: "Não Éh uz Guri: " + err})
// 					throw err
// 				}
// 			})

// 			return
// 		}
// 	} 
// })