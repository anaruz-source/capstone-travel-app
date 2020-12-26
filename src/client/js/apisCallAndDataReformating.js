const restCountriesAPICall = async (url, countryName) => {


    const countryInfoRaw = await fetchAny(url + countryName) // fetching restcountries.eu

    const countryInfo = {} // creating countryInfo entries object

  countryInfo.name = countryInfoRaw[0].countryName
  countryInfo.population = countryInfoRaw[0].population
  countryInfo.region = countryInfoRaw[0].region
  countryInfo.capital = countryInfoRaw[0].capital
  countryInfo.borders = countryInfoRaw[0].borders
  countryInfo.language = countryInfoRaw[0].languages[0].name
  countryInfo.flag = countryInfoRaw[0].flag
  countryInfo.currency = countryInfoRaw[0].currencies[0].name + `(${countryInfoRaw[0].currencies[0].code})`

  return countryInfo
},

pixaAPICall = async (url, key,  loc, countryName) => { // old Url and new Url
    
    const nUrl = findReplace.call(url, `key=${key}`, `q=${encodeURIComponent(loc)}`)
    
    const dataPix = await fetchAny(nUrl) // fetching pixabay.com

    const pix = {} // creating pixabay entries object

    if (dataPix.totalHits > 0) { // some images found for the location

        pix.previewURL = dataPix.previewURL
        pix.largeImageURL = dataPix.largeImageURL
        pix.obscure = false

    } else { // no entries found so query the country images (obscure localities)

        const dataPixObscure = await fetchAny(findReplace.call(url, `key=${key}`, `q=${encodeURIComponent(countryName)}`))
        pix.previewURL = dataPixBlind.previewURL
        pix.largeImageURL = dataPixBlind.largeImageURL
        pix.obscure = true

    } 

    return !Client.isEmptyObj(dataPix) && dataPix || dataPixObscure
},

weatherbitAPICall = async(cUrl, hUrl,  key , start, end, lng, lat) => { // cUrl (16days forecast API), hUrl (history API, only 1 day for free plan) of weatherbit API, and it's key, start and end dates, longitude, latitude,


    if (Client.countDays(start, end) <= 7) {

        nUrl = Client.findReplace.call(cUrl, `key=${key}`, `lon=${lng}`, `lat=${lat}`) //reconstructing the weatherbit query string
       
        const data = await Client.fetchAny(nUrl)
    
    } else {

        const d = new Date(start)


        let newEnd = new Date(d.getTime() + 1000 * 60 * 60 * 24) // adding only one day to date, API doesn't allow to fetch data for more one day in future forecasts

        newEnd = Client.revertDate(Client.toEnUsDate(newEnd)) // convert it to weatherbit required format

        weatherBitNewUrl = Client.findReplace.call(hUrl, `key=${key}`, `lon=${lng}`, `lat=${lat}`, `start_date=${start}`, `end_date=${newEnd}`)
    }

}





export { restCountriesAPICall, pixaAPICall, weatherbitAPICall}