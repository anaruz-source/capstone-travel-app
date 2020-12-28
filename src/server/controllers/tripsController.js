const Trip = require('../models/Trip')

const Destination = require('../models/Destination')

const countryInfo = require('../models/CountryInfo')

const WeatherInfo = require('../models/WeatherInfo')

const path = require('path')

const {countDays} = require('../helpers/helpers')

const CountryInfo = require('../models/CountryInfo')

const weatherInfo = require('../models/WeatherInfo')

const dataholder = []

const addTripsController = async (req, resp) => {

    const duration = countDays(req.body.startDate, req.body.endDate) //get number of days between two dates  
    
    const trip = new Trip({  // instantiate Trip Schema Object 

        title: req.body.title,

        description: req.body.description,

        startDate: req.body.startDate,

        endDate: req.body.endDate,

        duration : duration,

        userId: req.body.userId
    })
    try {

        const sentTrip = await trip.save() // saving in Mongodb Atlas, captrip database, trips collection

        
     
        const destination = new Destination({
             
             tripId: sentTrip._id,
             name: sentTrip.title,
             step: 1, // the destination created while creating trip will have step = 1 others => step = 0, will be reorder by their time of creation
        
        })

        const savedDestination = await destination.save()
       
        const cInfo = {destId: savedDestination._id, ...req.body.countryInfo, ...req.body.pixaInfo} // using rest parameters ES6
        const wInfo = { destId: savedDestination._id, forecasts: req.body.weatherInfo }
        
        const countryInfo = new CountryInfo(cInfo)
        const weatherInfo = new WeatherInfo(wInfo)
        
        await countryInfo.save()
        await weatherInfo.save()
      
        resp.send(savedDestination)

    } catch (err) {

        resp.send({ err })  // ES6 Syntax => {err: some error message or object}

    }


},

getTripsController = async (req, resp) => {
    
  // joining tables in mongoose to create complex queries
  
  // https://medium.com/@mendes.develop/joining-tables-in-mongodb-with-mongoose-489d72c84b60

    try {

        const trips = await Trip.find({ userId: req.params.userId }).lean(true) // return trips only related to the asking user defined with userId param of the http 'get' request

      trips.forEach(async (t,idx) => {
                    
        const destinations = await Destination.find({ tripId: t._id }).lean(true) // get destinations relevant to each trip (Destination.tripId references Trip._id)
        
        })

      console.log(dataholder)
         
        resp.render(path.resolve(__dirname+'/../../../dist/templates/trips.html.twig'), {trips: trips, js: '<script src="app.bundle.js"></script>', css: '<link rel="stylesheet" href="app.bundle.css">', base: `<base href="http://${ req.headers.host}/">`})
        


    } catch (err) {

        resp.send({ err }) // ES6 Syntax => {err: some error message or object}

    }


}


module.exports = {addTripsController, getTripsController}