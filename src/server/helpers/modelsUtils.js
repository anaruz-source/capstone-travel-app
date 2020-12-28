const Destination = require('../models/Destination')

const CountryInfo = require('../models/CountryInfo')

const WeatherInfo = require('../models/WeatherInfo')

const createDestination = async (info) => { // this will create a destination collection with its dependencies (code linting)
                                            // It will be reused in creating futher destinations
  
  console.log(info)

    const destination = new Destination({

        tripId: info.id,
        name: info.title,
        step: 1, // the destination created while creating trip will have step = 1 others => step = 0, will be reorder by their time of creation

    })

    const savedDestination = await destination.save()

    const cInfo = { destId: savedDestination._id, ...info.countryInfo, ...info.pixaInfo } // using rest parameters ES6
    const wInfo = { destId: savedDestination._id, forecasts: info.weatherInfo }

    const countryInfo = new CountryInfo(cInfo)
    const weatherInfo = new WeatherInfo(wInfo)

    const cInfoSaved = await countryInfo.save()
    const wInfoSaved = await weatherInfo.save()

    savedDestination.countryInfos = cInfoSaved._id // update destinations with created countryInfo._id and weatherInfo._id then save()
    savedDestination.weatherInfos = wInfoSaved._id

    const saved = await savedDestination.save()
    
    return saved._id
}

module.exports = createDestination