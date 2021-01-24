// https://community.algolia.com/places/examples.html
// section: Displaying on a map#
// with some twicks to adapt to my use case

import L from 'leaflet'

const markers = [],


    initMap = (latLng, identifier) => {

        const map = L.map(identifier, {
            scrollWheelZoom: true,
            zoomControl: true
        });

        const osmLayer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 1,
            maxZoom: 13,
            attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        });

        // centering the map around the destination found in attributes data- of d-card

        map.setView(new L.LatLng(latLng.lat, latLng.lng), 1);

        map.addLayer(osmLayer);

        return map


    },

    handleOnClear = (map) => {

        map.setView(new L.LatLng(0, 0), 1);

        markers.forEach(removeMarker);
    },

    addMarker = (latLng, map) => {

        const marker = L.marker(latLng, {
            opacity: .8
        });

        marker.addTo(map);

        markers.push(marker);


        findBestZoom(map);

        return marker
    },

    removeMarker = (marker) => {

        map.removeLayer(marker);
    },

    findBestZoom = (map) => {

        console.log('markers', markers)

        const featureGroup = L.featureGroup(markers);

        map.fitBounds(featureGroup.getBounds().pad(0.5), {
            animate: true
        });
    }

export {

    initMap,
    addMarker,
    removeMarker,
    handleOnClear,
    findBestZoom
}