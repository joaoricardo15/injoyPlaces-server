var url = "https://injoyserver.azurewebsites.net/positions";
var map;

function initMap() {
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(users, status){
            
            if (usersusers.length >= 1)
            {
                lastUser = users[users.length - 1]
                lastPosition = lastUser.locations[lastUser.locations.length - 1]    
                
                map = new google.maps.Map(document.getElementById('map'), {
                    center: lastPosition,
                    zoom: 15
                });

                addMarkers(users)
            } else {
                alert("não há dados de localização a serem apresentados")
            }
        }
    });
}

function addMarkers(users)
{
    for(var user of users)
    {
        for(var location of user.locations)
        {
            let openstreetmapUrl = "https://nominatim.openstreetmap.org/reverse?lat="+location.lat+"&lon="+location.lng+"&format=json"

            $.ajax({
                url: openstreetmapUrl,
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(local, status){
                    var marker = new google.maps.Marker({
                        title: user.user + ' está em: ' + local.display_name.split(',')[0],
                        position: {
                            lat: location.lat,
                            lng: location.lng
                        },
                        //icon: 'images/bart-icon.png',
                        animation: google.maps.Animation.DROP,
                        map: map
                    });
                }
            });
        }
    }
}