const Destination = require('../models/Destination')

const CountryInfo = require('../models/CountryInfo')

const WeatherInfo = require('../models/WeatherInfo')

const Trip = require('../models/Trip')

const Place = require('../models/Place')

const ToDo = require('../models/ToDoList')


const createDestination = async (info) => { // this will create a destination collection with its dependencies (code linting)
                                            // It will be reused in creating futher destinations
  

    const destination = new Destination({

        tripId: info.id,
        name: info.title,
        lng: info.geo.lng,
        lat: info.geo.lat,
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
},


findTrips = async (userId) => { // trips of a signle user


    const trips = await Trip.find({ userId }) // compound mongoose query to populate _id references with real objects in Trip.destinations/ES6 Syntax for obj creatiion
        .populate({
            path: 'destinations', // array of refs => array of Destination objs

            populate: {

                path: 'countryInfos weatherInfos places tasks' // in Trip.destinations.weahterInfos and .countryInfos fields
            }
            //  refs to WeatherInfo and CountryInfo => Real objs of previous
        })

        return trips
},

    findOneTrip = async (tripId) => { // single trip 

        

        const trip = await Trip.findById( tripId)// compound mongoose query to populate _id references with real objects in Trip.destinations
            .populate({
                path: 'destinations', // array of refs => array of Destination objs

                populate: {

                    path: 'countryInfos weatherInfos' // in Trip.destinations.weahterInfos and .countryInfos fields
                }
                //  refs to WeatherInfo and CountryInfo => Real objs of previous
            })

        return trip
    },


findOneDestination = async (destId) => { // single trip 



    const d = await Destination.findById(destId)// compound mongoose query to populate _id references with real objects in Trip.destinations
        .populate({
            path: 'destinations', // array of refs => array of Destination objs

            populate: {

                path: 'countryInfos weatherInfos  places packs' ,// in Trip.destinations.weahterInfos and .countryInfos fields, .places , .packs
                
            }
            //  refs to WeatherInfo and CountryInfo => Real objs of previous
        })

    return d
},
    findOneCInfo = async (destId) => {

        const c = await CountryInfo.findOne({ destId })

        return c
    },

    findOneWInfo = async (destId) => {

        const w = await WeatherInfo.findOne({ destId })

        return w
    },


findOnePlace = async (destinationId) => {

    const p = await Place.findOne({destinationId})

    return p
    },

findOneToDo = async (destinationId) => {

        const t = await ToDo.findOne({ destinationId })

        return t
    }



module.exports = { createDestination, findOneDestination, findTrips, findOneTrip, findOnePlace, findOneToDo, findOneCInfo, findOneWInfo }