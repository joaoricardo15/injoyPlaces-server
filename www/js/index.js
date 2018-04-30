var server = true;

var myId = 100;

var myPosition;

var map;

function initMap() {
    
    navigator.geolocation.getCurrentPosition((myLocation) => {
        
        myPosition = {lat: myLocation.coords.latitude, lng: myLocation.coords.longitude};

        map = new google.maps.Map(document.getElementById('map'), {
            center: myPosition,
            zoom: 15
        });

        updatePositions(myPosition);
    });
}

function updateCurrentPosition(myLocation) {
    
    myPosition = {lat: myLocation.coords.latitude, lng: myLocation.coords.longitude};

    map = new google.maps.Map(document.getElementById('map'), {
        center: myPosition,
        zoom: 15
    });
}

function updatePositions(myPosition)
{
    if(server)
    {
        $.get("http://localhost:3000/positions", function(data, status){
            addMarkers(data);
        });
    }
    else
    {
        var myLocation = {
            id: myId,
            lat: myPosition.coords.latitude,
            lng: myPosition.coords.longitude
        };

        $.post("http://localhost:3000/positions", myLocation, function(data, status){
            alert(JSON.stringify(data));
            addMarkers(data);
        });
    }
}

function addMarkers(locations)
{
    for(var location of locations)
    {
        var marker = new google.maps.Marker({
            position: {
                lat: location["lat"],
                lng: location["lng"]
            },
            //icon: 'http://labs.google.com/ridefinder/images/mm_20_blue.png',
            icon: 'images/bart-icon.png',
            map: map
        });

        marker.addListener('click', function() {
            alert("you clicked on marker");
        });
    }
}