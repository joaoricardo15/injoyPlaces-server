//////////////////////////////////////////////////////////
// data base conncetion
//////////////////////////////////////////////////////////

var mongoose = require('mongoose')

mongoose.connect('mongodb://injoyserverdb.documents.azure.com:10255/injoy?ssl=true', { auth: { user: 'injoyserverdb', password: 'eiHlZ9VM4595rukD7x58HrW0rHTLZZRElLwFadq4qj70HRXfzP4N9RKeOVq7acyHrMYoMt3iqeeSbudYF4sJhA==' }})
//mongoose.connect('mongodb://injoydb.ce1xg1mn2hdc.us-east-1.docdb.amazonaws.com:27017', { auth: { user: 'dao', password: 'Joao2020' }})
//mongoose.connect('mongodb://localhost')
	.then(() => { console.log('Mongoose is connected to MongoDb on 27017') })
	.catch(err => { console.log('error: '+err) })	

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { console.log('connected to mongo') });


//////////////////////////////////////////////////////////
// data base models
//////////////////////////////////////////////////////////

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

var UserModel = mongoose.model('users', userSchema)
var RoleModel = mongoose.model('roles', roleSchema)
var ExperienceModel = mongoose.model('experiences', experienceSchema)

module.exports = {
	UserModel: UserModel,
	RoleModel: RoleModel,
	ExperienceModel: ExperienceModel
}

// var file = require('fs')
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