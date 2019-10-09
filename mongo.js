//////////////////////////////////////////////////////////
// data base conncetion
//////////////////////////////////////////////////////////

var mongoose = require('mongoose')
mongoose.connect('mongodb://3.217.179.65:27017', { auth: { user: 'joaocardoso', password: 'di47y&3#cYf0[yX' }})
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

//var file = require('fs')
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
// ap11Model.save(function(err) { if (err) throw err })

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

// redDoor.save(function(err) { if (err) throw err })
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
// voidModel.save(function(err) { if (err) throw err })

// var hive = new RoleModel({
// 	name: 'Hive',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.025180, lng: -51.203640 },
// 	address: {
// 		street: 'R. Padre Chagas',
// 		number: 196,
// 		suburb: 'Moinhos de Vento',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/hive.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['vegetariano', 'comidacriativa', 'consumoconsciente', 'organico', 'restaurante'],
// 	comments: [],
// 	occasions: []
// })
// hive.save(function(err) { if (err) throw err })

// var urban = new RoleModel({
// 	name: 'Urban Farmcy',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.026051, lng: -51.203892 },
// 	address: {
// 		street: 'R. Hilário Ribeiro',
// 		number: 299,
// 		suburb: 'Moinhos de Vento',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/urban.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['vegetariano', 'vegano', 'petfriendly', 'organico', 'restaurante'],
// 	comments: [],
// 	occasions: []
// })
// urban.save(function(err) { if (err) throw err })

// var med = new RoleModel({
// 	name: 'Med',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.012410, lng: -52.903070 },
// 	address: {
// 		street: 'R. Gonçalo de Carvalho',
// 		number: 170,
// 		suburb: 'Floresta',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/med.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['slowfood', 'almoçonojardim', 'italiano', 'brunch', 'restaurante'],
// 	comments: [],
// 	occasions: []
// })
// med.save(function(err) { if (err) throw err })

// var botanico = new RoleModel({
// 	name: 'Botânico',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.036235, lng: -51.210732 },
// 	address: {
// 		street: 'Largo Dr. José Faibes Lubianca',
// 		number: 01,
// 		suburb: 'Bom Fim',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/botanico.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['vegetariano', 'Redenção', 'Buffet', 'Variedades', 'restaurante'],
// 	comments: [],
// 	occasions: []
// })
// botanico.save(function(err) { if (err) throw err })

// var suprem = new RoleModel({
// 	name: 'Hive',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.032920, lng: -51.214540 },
// 	address: {
// 		street: 'R. Santo Antônio',
// 		number: 877,
// 		suburb: 'Bom Fim',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/suprem.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['vegetariano', 'vegano', 'indiano', 'zen', 'restaurante'],
// 	comments: [],
// 	occasions: []
// })
// suprem.save(function(err) { if (err) throw err })

// var estomago = new RoleModel({
// 	name: 'Estômago Café',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.030540, lng: -51.205970 },
// 	address: {
// 		street: 'R. Miguel Tostes',
// 		number: 275,
// 		suburb: 'Rio Branco',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/estomago.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['vegano', 'sustentavel', 'vintage', 'restaurante'],
// 	comments: [],
// 	occasions: []
// })
// estomago.save(function(err) { if (err) throw err })

// var mantra = new RoleModel({
// 	name: 'Mantra',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.030230, lng: -51.209790 },
// 	address: {
// 		street: 'R. Castro Alves',
// 		number: 465,
// 		suburb: 'Independência',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/mantra.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['vegeno', 'indiano', 'bicicletario', 'veganburguer', 'restaurante'],
// 	comments: [],
// 	occasions: []
// })
// mantra.save(function(err) { if (err) throw err })

// var ojas = new RoleModel({
// 	name: 'Ojas',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.029230, lng: -51.214790 },
// 	address: {
// 		street: 'R. Independência',
// 		number: 646,
// 		suburb: 'Independência',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/ojas.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['vegetariano', 'charme', 'caseiro', 'restaurante'],
// 	comments: [],
// 	occasions: []
// })
// ojas.save(function(err) { if (err) throw err })

// var raw = new RoleModel({
// 	name: 'Raw',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.029280, lng: -51.215880 },
// 	address: {
// 		street: 'R. Thomas FLores',
// 		number: 144,
// 		suburb: 'Bom Fim',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/raw.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['vegetariano', 'alimentacaoviva', 'variedade', 'restaurante'],
// 	comments: [],
// 	occasions: []
// })
// raw.save(function(err) { if (err) throw err })

// var ocidente = new RoleModel({
// 	name: 'Ocidente',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.034590, lng: -51.212790 },
// 	address: {
// 		street: 'R. Osvaldo Aranha',
// 		number: 960,
// 		suburb: 'Bom Fim',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/ocidente.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['almoçovegetariano', 'cultura', 'redencao', 'restaurante', 'bar', 'balada'],
// 	comments: [],
// 	occasions: []
// })
// ocidente.save(function(err) { if (err) throw err })

// var espontaneo = new RoleModel({
// 	name: 'Espontâneo Bar Orgânico',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.034590, lng: -51.212790 },
// 	address: {
// 		street: 'R. Cabral',
// 		number: 301,
// 		suburb: 'Rio Branco',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/espontaneo.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['produtoreslocais', 'pizzaorganica', 'produtoscoloniais', 'restaurante'],
// 	comments: [],
// 	occasions: []
// })
// espontaneo.save(function(err) { if (err) throw err })

// var amora = new RoleModel({
// 	name: 'Casa Amora',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.027580, lng: -51.203100 },
// 	address: {
// 		street: 'R. Dr. Florêncio Ygartua',
// 		number: 374,
// 		suburb: 'Moinhos de Vento',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/amora.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['opcoesvegetarianas', 'organico', 'decoracao', 'restaurante'],
// 	comments: [],
// 	occasions: []
// })
// amora.save(function(err) { if (err) throw err })

// var prato = new RoleModel({
// 	name: 'Prato Verde',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.037520, lng: -51.211090 },
// 	address: {
// 		street: 'R. Santa Terezinha',
// 		number: 42,
// 		suburb: 'Bom Fim',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/prato.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['vegetariano', 'desde1991', 'redencao', 'restaurante'],
// 	comments: [],
// 	occasions: []
// })
// prato.save(function(err) { if (err) throw err })

// var govinda = new RoleModel({
// 	name: 'Govinda',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.038310, lng: -51.213550 },
// 	address: {
// 		street: 'R. José Bonifácio',
// 		number: 605,
// 		suburb: 'Farroupilha',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/govinda.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['vegetariano', 'vegano', 'xisvegano', 'restaurante'],
// 	comments: [],
// 	occasions: []
// })
// govinda.save(function(err) { if (err) throw err })

// var locals = new RoleModel({
// 	name: 'Locals Only',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.030950, lng: -51.219650 },
// 	address: {
// 		street: 'R. Sarmento Leite',
// 		number: 1086,
// 		suburb: 'Cidade Baixa',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/locals.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['opcoesvegetarianas', 'cervejasartezanais', 'produtos100%locais', 'bar'],
// 	comments: [],
// 	occasions: []
// })
// locals.save(function(err) { if (err) throw err })

// var agridoce = new RoleModel({
// 	name: 'Agridoce',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.037770, lng: -51.224030 },
// 	address: {
// 		street: 'R. Sarmento Leite',
// 		number: 1024,
// 		suburb: 'Cidade Baixa',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/agridoce.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['opcoesvegetarianas', 'aconchego', 'vintage', 'cafe'],
// 	comments: [],
// 	occasions: []
// })
// agridoce.save(function(err) { if (err) throw err })

// var oriental = new RoleModel({
// 	name: 'Casa Oriental',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.029810, lng: -51.209950 },
// 	address: {
// 		street: 'R. Felipe Camarão',
// 		number: 61,
// 		suburb: 'Independência',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/oriental.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['vegetariano', 'oriental', 'simples'],
// 	comments: [],
// 	occasions: []
// })
// oriental.save(function(err) { if (err) throw err })

// var bonobo = new RoleModel({
// 	name: 'Hive',
// 	ratting: { rattings: 1, average: 5 },
// 	location: { lat: -30.031300, lng: -51.202780 },
// 	address: {
// 		street: 'R. Castro Alves',
// 		number: 101,
// 		suburb: 'Bom Fim',
// 		city: 'Porto Alegre',
// 		state: 'RS',
// 		country: 'Brasil'
// 	},
// 	pics: [ { data: file.readFileSync("./images/vegetarians/bonobo.jpg"), contentType: 'image/jpg' } ],
// 	pic: 0,
// 	tags: ['vegetariano', 'vegano', 'ecologico', 'organico'],
// 	comments: [],
// 	occasions: []
// })
// bonobo.save(function(err) { if (err) throw err })