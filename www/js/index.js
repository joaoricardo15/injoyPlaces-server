var url = "https://injoyserver.azurewebsites.net/positions"
var map

function initMap() {
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(users, status){
            
            if (users.length >= 1)
            {
                lastUser = users[users.length - 1]
                lastPosition = lastUser.locations[lastUser.locations.length - 1]    
                
                map = new google.maps.Map(document.getElementById('map'), {
                    center: lastPosition,
                    zoom: 15
                })

                addMarkers(users)

            } else {
                alert("não há dados de localização a serem apresentados")
            }
        }
    })
}

function addMarkers(users)
{
    for(var user of users)
    {
        for(var location of user.locations)
        {
            addMarker(user.user, location.lat, location.lng);
        }
    }
}

function addMarker(user, lat, lng) {
    let openstreetmapUrl = "https://nominatim.openstreetmap.org/reverse?lat="+lat+"&lon="+lng+"&format=json"

    $.ajax({
        url: openstreetmapUrl,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(local, status){
            new google.maps.Marker({
                title: user + ' está em: ' + local.display_name.split(',')[0],
                position: {
                    lat: lat,
                    lng: lng
                },
                //icon: 'images/bart-icon.png',
                animation: google.maps.Animation.DROP,
                map: map
            })  
        }
    })
}