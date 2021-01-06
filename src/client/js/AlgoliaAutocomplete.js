// references: 
// https://community.algolia.com/places/documentation.html
// https://community.algolia.com/places/documentation.html#api-options-container


// if location is different than index/home page, provide more types for the ALGOLIA autocomplte API

// Whether or not to first search around the geolocation of the user found via his IP address. This is true by default.
/*
* *   
* * * Note: If you restrict the search to 'city' or 'airport', you probably want to disable the aroundLatLngViaIP option as well. This will make sure you don't get only nearby results.
* *
*/

let options = location.href.indexOf('trips') > -1 ?[ ['address', 'busStop','trainStation', 'townhall','airport'], true, 'value']: ['city', false,'city']
    
let types = options[0],
    aroundLatLngViaIP = options[1]

const  autoCompleter = () => {
    
        console.log(types, aroundLatLngViaIP)
        let placesAutocomplete = places({
            appId: 'pl07W6O6HDCD',
            apiKey: '64096c88230064d3a7acd3a334a5b17c',
            container: document.getElementsByClassName('autocomplete')[0],
            type: 'city'|| types,
            templates: {
                value: function (suggestion) {

                   
                    return  location.href.indexOf('trips') > -1 ? suggestion.name : suggestion.city;
                }
            },
            aroundLatLngViaIP: aroundLatLngViaIP // disable the extra search/boost around the source IP

    })

    return placesAutocomplete

},





Places = { script : (function () {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/places.js@1.19.0'
        script.defer = false
        script.async = false
        return script
    })()


}


module.exports = {Places, autoCompleter}