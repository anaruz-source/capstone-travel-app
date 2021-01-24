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


const autoCompleter = (input, types, around) => { // only cities (no nearby places)


    if (Client.hasClassName(input, 'ap-input')) return // element has alread autocompleter so return and do nothing

    const reconfigurableOptions = {

        aroundLatLng: '',
        aroundLatLngViaIP: false // disable the extra search/boost around the source IP
    },

        options = {
            appId: 'pl07W6O6HDCD',
            apiKey: '64096c88230064d3a7acd3a334a5b17c',
            container: input,
            type: types,
            templates: {
                value: function (suggestion) {


                    return around ? suggestion.name + '|' + suggestion.type : suggestion.name
                }
            },
            aroundLatLngViaIP: around // disable the extra search/boost around the source IP

        }

    let placesAutocomplete = places(options).configure(reconfigurableOptions)

    return placesAutocomplete

},


    Places = {
        script: (function () {
            const script = document.createElement('script')
            script.src = 'https://cdn.jsdelivr.net/npm/places.js@1.19.0'
            script.defer = false
            script.async = false
            return script
        })()


    }


module.exports = {
    Places,
    autoCompleter
}