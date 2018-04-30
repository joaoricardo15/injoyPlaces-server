var server = true;

var myId = 1000;

var myPosition;

var map;

var updateInterval = 1000;

function initMap() {
    
    navigator.geolocation.getCurrentPosition((myLocation) => {
        
        myPosition = {lat: myLocation.coords.latitude, lng: myLocation.coords.longitude};

        map = new google.maps.Map(document.getElementById('map'), {
            center: myPosition,
            zoom: 15
        });

        uploadMyPosition();

        setInterval(updatePositions, updateInterval);
    });
}

function uploadMyPosition()
{
    $.post("http://localhost:3000/positions", 
    {
        id: myId,
        lat: myPosition.lat,
        lng: myPosition.lng
    }, 
    function(data, status){
        
    });
}

function updatePositions()
{
    $.get("http://localhost:3000/positions", function(data, status){
        updateMarkers(data);
    });
}

function updateMarkers(locations)
{
    for(var location of locations)
    {
        var marker = new google.maps.Marker({
            position: {
                lat: location["lat"],
                lng: location["lng"]
            },
            icon: 'images/bart-icon.png',
            map: map
        });

        marker.addListener('click', function() {
            alert("you clicked on marker");
        });
    }
}