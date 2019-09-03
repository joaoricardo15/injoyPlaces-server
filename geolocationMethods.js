var mongo = require('./mongo')	

/*/////////////////// Conversão de precisão em graus para distancia /////////////////////

    1grau latitude = 111.12Km
    
    1grau longitude = 111.12km * cos(latitude) 

    -> para uma area quadrada de lado igual à 50m:
    
		50m correspondem a +- 0.00045 graus de latitude
		
		50m correspondem a +- 50/(111120.cos(lng))  graus de latitude

/////////////////////////////////////////////////////////////////////////////////////////*/

var userPositions = []
const maxPositionsPerUser = 100
const localMinimunInterval = 600

const squaredArea = 50
const geoLocationConstant = 111120
const latitudeThreshold = squaredArea/geoLocationConstant

module.exports = {
	userPositions: userPositions,
  addLocation: addLocation,
  squaredArea: squaredArea,
  geoLocationConstant: geoLocationConstant,
  latitudeThreshold: latitudeThreshold
}

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

      // estou permanecendo no mesmo local
			let lastLatitude = user.currentLocal.lat
			let lastLongitude = user.currentLocal.lng
			user.currentLocal.lat = (lastLatitude*user.currentLocal.samples + position.lat) / (user.currentLocal.samples + 1)
			user.currentLocal.lng = (lastLongitude*user.currentLocal.samples + position.lng) / (user.currentLocal.samples + 1)
			user.currentLocal.samples++
			user.currentLocal.departure = timeStamp

			let elapsedTime = user.currentLocal.departure - user.currentLocal.arrival
			
			if (elapsedTime > localMinimunInterval*1000) {
					
				// se eu já estou neste lugar à mais de 10min
				let newLocal = { arrival: new Date(user.currentLocal.arrival), departure: new Date(user.currentLocal.departure), lat: user.currentLocal.lat, lng: user.currentLocal.lng, posted: false }

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
						user.currentLocal = { arrival: timeStamp, lng: position.lng, lat: position.lat, samples: 1, departure: new Date(timeStamp) }
					}
				}
				else {

					// adiciono o meu locoal atual à lista 'meus locais' 
					user.locals.push(newLocal)
					user.currentLocal = { arrival: timeStamp, lng: position.lng, lat: position.lat, samples: 1, departure: new Date(timeStamp) }

					//restrinjo a quantidade de locais a 100 elementos
					if (user.locals.length > maxPositionsPerUser) {
						user.locals.splice(0, 1)
					}
				}
			}
		}
		else {
      // se eu sai do último lugar que eu estava
      user.currentLocal = { arrival: timeStamp, lng: position.lng, lat: position.lat, samples: 1, departure: null }
      
      //posta o último lugar como uma nova experiência
      if (!user.locals[user.locals.length-1].posted) { 
        addExperience(user.user, user.locals[user.locals.length-1])
        user.locals[user.locals.length-1].posted = true
      }
		}
	}
}

function addExperience(user, local) {

	mongo.ExperienceModel.find({ user: user }, function(err, experiences) { 
		if (err) {
			response.send({ message: "Não Éh uz Guri: " + err})
			throw err
		}

		let longitudeThreshold = squaredArea/(geoLocationConstant*Math.cos(local.lng))

		for (let i = 0; i < experiences.length; i++) {
			
			latitudeDifference = Math.abs(local.lat - experiences[i].location.lat)
			longitudeDifference = Math.abs(local.lng - experiences[i].location.lng)

			if (latitudeDifference < latitudeThreshold && longitudeDifference < longitudeThreshold) {
				let newExperience = {
					user: user,
					name: experiences[i].name,
					address: experiences[i].address,
					location: { lat: local.lat, lng: local.lng },
					arrival: new Date(local.arrival),
					departure: new Date(local.departure)
				}

				let newExperienceModel = new mongo.ExperienceModel(newExperience)
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