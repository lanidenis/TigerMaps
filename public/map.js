var map;
var placesService;
var infoWindow;

/*
function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}
*/

// The About adds a control to the map that links to the About page
function About(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #888';
    controlUI.style.borderRadius = '4px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to find more about the team behind this app';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'About Us';
    controlUI.appendChild(controlText);

    // Setup the click event listeners to link to About page.
    controlUI.addEventListener('click', function() {
        //alert("Clicked! :-)")
        window.location.href = '/about.html';
    });
}

function initMap() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            createMap(pos);
        }, function() {
            handleLocationError(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false);
    }

    function handleLocationError(browserHasGeolocation) {
        var pos = {
            lat: 40.34663,
            lng: -74.6565801
        };
        createMap(pos);
    }

}

function createMap(pos) {
    $.getJSON("mapstyle.json", function(data) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: pos,
            zoom: 17,
            styles: data
        });
        //placesService = new google.maps.places.PlacesService(map);
        infowindow = new google.maps.InfoWindow();

        /*
        var testPos = {
            lat: 40.348322,
            lng: -74.660621
        };
        placesService.nearbySearch({
            location: testPos,
            radius: 50
        }, callback);
        */

        // Map bounds
        var allowedBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(40.329950, -74.670505),
            new google.maps.LatLng(40.356531, -74.639470)
        );
        var minZoom = 15;
        var lastValidCenter = map.getCenter();

        google.maps.event.addListener(map, "center_changed", function() {
            if (allowedBounds.contains(map.getCenter())) {
                // Still within valid bounds, so save the last valid position
                lastValidCenter = map.getCenter();
                return;
            }
            // Not valid anymore, return to last valid position
            map.panTo(lastValidCenter);
        });
        google.maps.event.addListener(map, "zoom_changed", function() {
            if (map.getZoom() < minZoom)
                map.setZoom(minZoom);
        });

        // Create the DIV to hold the control and call the About()
        // constructor passing in this DIV.
        var aboutDiv = document.createElement('div');
        var aboutControl = new About(aboutDiv, map);

        aboutDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(aboutDiv);

        loadPolygons();

    });
}

//Courtesy of http://moduscreate.com/placing-markers-inside-polygons-with-google-maps/
function getBoundingBox(polygon) {
  var bounds = new google.maps.LatLngBounds();

  polygon.getPath().forEach(function(element,index) {
    bounds.extend(element)
  });
  return(bounds);
}

function loadPolygons() {
    $.getScript('1.js', function() {
        //script is loaded and executed put your dependent JS here
    });
}
/** @this {google.maps.Polygon} */