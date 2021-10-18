mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campLocation.geometry.coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});
// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
// Add geolocate control to the map.
map.addControl(
    new mapboxgl.GeolocateControl({
    positionOptions: {
    enableHighAccuracy: true
    },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true
    })
    );

//CENTER MARKER ON LOCATION
new mapboxgl.Marker()
    // marker location
    .setLngLat(campLocation.geometry.coordinates)
    // add popup on map
    .setPopup(
        new mapboxgl.Popup({
            offset: 25
        })
        .setHTML(
            `<h4>${campLocation.title}</h4><p>${campLocation.location}</p>`
        )
    )
    .addTo(map)