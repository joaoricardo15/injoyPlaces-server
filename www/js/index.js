var server = true;
var url = "http://localhost/positions";
var localPositions = [];
var updateInterval = 1000;
var minimumPrecision = 0.0001;
var map;

function initMap() {
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(users, status){
            
            lastUser = users[users.length - 1]
            lastPosition = lastUser.locations[lastUser.locations.length - 1]
            
            map = new google.maps.Map(document.getElementById('map'), {
                center: lastPosition,
                zoom: 15
            });

            var marker = new google.maps.Marker({
                title: 'Nome do herói: '+lastUser.user,
                position: {
                    lat: lastPosition.lat,
                    lng: lastPosition.lng
                },
                icon: 'images/bart-icon.png',
                animation: google.maps.Animation.DROP,
                map: map
            });
        }
    });

    //setInterval(updatePositions, updateInterval);
}

function updatePositions()
{
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(data, status){
            updateMarkers(data)
        }
    });
}

function updateMarkers(users)
{
    for(var user of users)
    {
        for(var location of user.locations)
        {
            var marker = new google.maps.Marker({
                title: 'Nome do herói: '+user.user,
                position: {
                    lat: location.lat,
                    lng: location.lng
                },
                icon: 'images/bart-icon.png',
                animation: google.maps.Animation.DROP,
                map: map
            });
        }
    }
}