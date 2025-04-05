mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});

const marker = new mapboxgl.Marker({color: 'red'})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h5>${listing.title}</h5><p>Exact location provided after booking</p>`))
    .addTo(map);

// window.addEventListener('resize', () => {
//     setTimeout(() => {
//         map.resize();
//     }, 500);
// });

// map.on('load', () => {
//     // Load an image from an external URL.
//     map.loadImage(
//             'https://res.cloudinary.com/de8abzaw0/image/upload/v1740373242/png-transparent-computer-icons-home-house-home-angle-building-rectangle-thumbnail_qkynkn.png',
//             (error, image) => {
//                 if (error) throw error;

//                 // Add the image to the map style.
//                 map.addImage('house', image);

//                 // Add a data source containing one point feature.
//                 map.addSource('point', {
//                     'type': 'geojson',
//                     'data': {
//                         'type': 'FeatureCollection',
//                         'features': [
//                             {
//                                 'type': 'Feature',
//                                 'geometry': {
//                                     'type': 'Point',
//                                     'coordinates': listing.geometry.coordinates
//                                 }
//                             }
//                         ]
//                     }
//                 });

//                 // Add a layer to use the image to represent the data.
//                 map.addLayer({
//                     'id': 'points',
//                     'type': 'symbol',
//                     'source': 'point', // reference the data source
//                     'layout': {
//                         'icon-image': 'house', // reference the image
//                         'icon-size': 0.1
//                     }
//                 });
//             }
//         );
//     });