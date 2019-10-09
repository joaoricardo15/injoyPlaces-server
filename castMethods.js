//////////////////////////////////////////////////////////
// cast operations for injoyInterface
//////////////////////////////////////////////////////////

var file = require('fs')
	, imageDataURI = require('image-data-uri')

function createMyLists(roles) {
		rolesIndexes = []
		vegetariansIndexes = []

		for (let i = 0; i < roles.length; i++) {
			rolesIndexes.push(i)
			for (let j = 0; j < roles[i].tags.length; j++) {
				if (roles[i].tags[j] === 'vegetariano' || roles[i].tags[j] === 'opcoesvegetarianas') {
					vegetariansIndexes.push(i)
					break
				}
			}
		}
		
		return {
			roles: roles,
			myLists: [
				{ title: 'Para você', icon: 'flame', roles: rolesIndexes },
				{ title: 'Próximos de você', icon: 'beer', roles: rolesIndexes.slice().reverse() },
				{ title: 'Opções Vegetarianas', icon: 'restaurant', roles: vegetariansIndexes }
			]
		}
}

function createMyExperiences(experiences) {

	myExperiences = {
		experiences: experiences.slice().reverse()
	}

	let statistics = []

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

	statistics.push({
		name: 'Experiências',
		img: { data: file.readFileSync("./images/icons/house.jpg"), contentType: 'image/jpg' },
		value: experiences.length
	})

	if (rattings > 0) {
		statistics.push({
			name: 'Avaliações',
			img: { data: file.readFileSync("./images/icons/ratting.png"), contentType: 'image/jpg' },
			value: rattings,
		})
	}
		

	if (occasions > 0)
		statistics.push({
			name: 'Ocasiões',
			img: { data: file.readFileSync("./images/icons/pizzaSlice.jpg"), contentType: 'image/jpg' },
			value: occasions,
		})	

	if (tags > 0)
		statistics.push({
			name: '#Hashtags',
			img: { data: file.readFileSync("./images/icons/tag.jpg"), contentType: 'image/jpg' },
			value: tags,
		})
		
	if (pics > 0)
		statistics.push({
			name: 'Fotos',
			img: { data: file.readFileSync("./images/icons/pics.jpg"), contentType: 'image/jpg' },
			value: pics,
		})
	
	if (comments > 0)
		statistics.push({
			name: 'Comentários',
			img: { data: file.readFileSync("./images/icons/comments.jpg"), contentType: 'image/jpg' },
			value: comments,
		})

	let achievements = [
		{ 
			title: 'Pioneiro',
			subtitle: ' ',
			message: 'Você foi um dos primeiros usuários a utilizar o InJoy' 
		},
		{ 
			title: 'Descobridor', 
			icon: 'compass', 
			value: experiences.length > 3 ? experiences.length : null,
			message: 'Troféu Descobridor. Para conquistá-lo, você precisa adicionar no mínimo 3 novos rolês' 
		},
		{ 
			title: 'Gourmet', 
			icon: 'restaurant',
			message: 'Troféu Gourmet. Para conquistá-lo, você precisa registrar no mínimo 10 experiências em restaurantes conceituados da cidade' 
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
			value: pics > 2 ? 1 : null,
			message: 'Troféu Blogueiro. Para conquistá-lo, você precisa registrar no mínimo 3 experiências com foto' 
		},
		{ 
			title: 'Avaliador', 
			icon: 'thumbs-up', 
			value: rattings > 2 ? 1 : null,
			message: 'Troféu Avaliador. Para conquistá-lo, você precisa registrar no mínimo 3 experiências com avaliação!' 
		},
		{ 
			title: 'Viajante', 
			icon: 'globe', 
			message: 'Troféu Viajante. Para conquistá-lo, você precisa registrar no mínimo 3 experiências em regiões diferentes' 
		},
	]
	
	myExperiences['statistics'] = statistics
	myExperiences['achievements'] = achievements

	return myExperiences
}

function castExperience(experience) {
	return {
		user: experience.user,
		name: experience.name,
		ratting: experience.ratting,
		location: experience.location,
		address: experience.address,
		date: experience.date,
		pic: experience.pic ? { data: imageDataURI.decode('data:'+experience.pic.contentType+';base64,'+experience.pic.data).dataBuffer, Buffer, contentType: experience.pic.contentType } : null,
		comment: experience.comment,
		occasion: experience.occasion,
		tag: experience.tag
	}
}

function castNewRole(experience) {
	return {
		name: experience.name,
		location: experience.location,
		address: experience.address,
		ratting: experience.ratting ? { average: experience.ratting , rattings: 1 } : { average: 5 , rattings: 1 },
		pic: experience.pic ? 0 : null,
		pics: experience.pic ? [ experience.pic ] : [],
		comments: experience.comment ? [ experience.comment ]: [],
		occasions: experience.occasion ? [ experience.occasion ] : [],
		tags: experience.tag ? [ experience.tag ] : []
	}
}

module.exports = {
	createMyLists : createMyLists,
	createMyExperiences: createMyExperiences,
	castExperience: castExperience,
	castNewRole: castNewRole
}