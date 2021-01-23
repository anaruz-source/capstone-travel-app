

const restCountriesAPICall = async (url, countryName) => { // make a fetch and pick only required data from restCountries 
    
    let countryInfoRaw
    try {

    countryInfoRaw = await Client.fetchAny(url + encodeURIComponent(countryName) + '?fullText=true') // fetching restcountries.eu, search exact match with fullText=true
   
    if(countryInfoRaw.status == 404) throw new Error('Going to next step in catch bloc')

} catch (error) { // nothing found with full name option then try with name/nativename option
        countryInfoRaw = await Client.fetchAny(url + encodeURIComponent(countryName))
        
        if( countryInfoRaw.status == 404) throw new Error('404 Nothing found in the 2nd round!!')
}

  



  const countryInfo = {} // creating countryInfo entries object

  countryInfo.name = countryInfoRaw[0].name
  countryInfo.population = countryInfoRaw[0].population
  countryInfo.region = countryInfoRaw[0].region
  countryInfo.capital = countryInfoRaw[0].capital
  countryInfo.borders = countryInfoRaw[0].borders
  countryInfo.language = countryInfoRaw[0].languages[0].name
  countryInfo.flag = countryInfoRaw[0].flag
  countryInfo.currency = countryInfoRaw[0].currencies[0].name + `(${countryInfoRaw[0].currencies[0].code})`
  
  return countryInfo
},

pixaAPICall = async (url, key, loc, countryName) => { // // make a fetch and pick only required data from pixabay
    
    const nUrl = Client.findReplace.call(url, `key=${key}`, `q=${encodeURIComponent(loc)}`)
    
    const dataPix = await Client.fetchAny(nUrl) // fetching pixabay.com

    const maxHit = Client.getMaxLikesEntry(dataPix.hits)

    const pixa = {} // creating pixabay entries object

    if (dataPix.totalHits > 0) { // some images found for the location

        pixa.previewURL = maxHit.previewURL
        pixa.largeImageURL = maxHit.largeImageURL
        pixa.likes = maxHit.likes
        pixa.comments = maxHit.comments
        pixa.obscure = false

    } else { // no entries found so query the country images (obscure localities)

        const dataPixObscure = await ClientfetchAny(findReplace.call(url, `key=${key}`, `q=${encodeURIComponent(countryName)}`))

        const maxHit = Client.getMaxLikesEntry(maxHit.hits)
        pixa.previewURL = dataPixObscure.previewURL
        pixa.largeImageURL = dataPixObscure.largeImageURL
        pixa.likes = dataPixObscure.likes
        pixa.comments = dataPixObscure.comments
        pixa.obscure = true

    } 
    
    return  pixa 
},

// make a fetch and pick only required data from weatherbit, 16Days forecast or just one day forecast in the future

weatherbitAPICall = async (cUrl, hUrl,  key , start, lng, lat) => { // cUrl (16days forecast API), hUrl (history API, only 1 day for free plan) of weatherbit API, and it's key, start and end dates, longitude, latitude,

const days = []


   
if (Client.countDays(start, Client.revertDate(Client.toEnUSDate(new Date()))) <= 7) { // if trips start in 7 days or less

        const nUrl = Client.findReplace.call(cUrl, `key=${key}`, `lon=${lng}`, `lat=${lat}`) //reconstructing the weatherbit query string
       
        const data = await Client.fetchAny(nUrl)

        data.data.forEach(e => {

            if(new Date(e.valid_date).getTime() >= new Date(start).getTime()) {  // store only forecast starting from the trip's starting date
                                          // NOTE: I don't see any benefit  storing weather forecasts as they're subject of change
                                          // however for th sake of this app, let's do so

                const day = { date: e.valid_date } // entries by date

                day.avgTemp = e.temp
                day.windSpd = e.wind_spd
                day.description = e.weather.description
                day.icon = e.weather.icon
                day.precip = e.precip
                day.timezone = data.timezone

                days.push( day)

            
            }
        })
  
      
        return Client.shortenToSeven( days, start )

    } else {  // get a forecast in the future

        const d = new Date(start)
        
       // adding only one day to date, API doesn't allow to fetch data for more one day in future forecasts
        
        let newEnd = new Date(d.getTime() + 1000 * 60 * 60 * 24)        

        newEnd = Client.revertDate(Client.toEnUSDate(newEnd)) // convert it to weatherbit required format

        const url = Client.findReplace.call(hUrl, `key=${key}`, `lon=${lng}`, `lat=${lat}`, `start_date=${start}`, `end_date=${newEnd}`)
    console.log(url)

        const data = await Client.fetchAny(url)
         
        console.log(data)
        const day = { date: start } // entries by date (only one available for free plan)

        day.avgTemp = data.temp
        day.windSpd = data.wind_spd
        day.description = data.weather.description
        day.icon = data.weather.icon
        day.precip = data.precip
        day.timezone = data.timezone
         

        days.push(day)

        return days
    }


},

geonamesAPICall = async (url, loc) => { // pic only necessary info from geonames API

  
    const nUrl = Client.findReplace.call(url, `q=${encodeURIComponent(loc)}`)


    const data = await Client.fetchAny(nUrl)

    return { lat: data.geonames[0].lat,
             lng: data.geonames[0].lng,
             name: data.geonames[0].countryName
            }

},
mapQuestCall = async (url, key, name) => { // to get lat, lng of places (addresses, trainStop....)

    const nUrl = Client.findReplace.call(url, `key=${key}`, `location=${name}`)
    
    const data = await Client.fetchAny(nUrl)

    return { lat: data.results[0].locations[0].latLng.lat, lng: data.results[0].locations[0].latLng.lng}
}





export { restCountriesAPICall, pixaAPICall, weatherbitAPICall, geonamesAPICall, mapQuestCall}