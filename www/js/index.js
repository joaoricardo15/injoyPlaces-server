var map;

function initMap() {
    navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position) {

    var myLocation = {lat: position.coords.latitude, lng: position.coords.longitude};

    map = new google.maps.Map(document.getElementById('map'), {
        center: myLocation,
        zoom: 15
    });

    var marker = new google.maps.Marker({
        position: myLocation,
        map: map
    });

}



