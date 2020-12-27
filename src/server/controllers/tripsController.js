const Trip = require('../models/Trip')

const Destination = require('../models/Destination')

const path = require('path')

const {countDays} = require('../helpers/helpers')

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
             countryInfo: req.body.countryInfo,
             pixaInfo:  req.body.pixaInfo,
             weatherInfo: req.body.weatherInfo,
        })

        const savedDestination = await destination.save()
       
      
        resp.send(savedDestination)

    } catch (err) {

        resp.send({ err })  // ES6 Syntax => {err: some error message or object}

    }


},

getTripsController = async (req, resp) => {
   

    try {

        const trips = await Trip.find({ userId: req.params.userId }) // return trips only related to the asking user defined with userId param of the http 'get' request
                
        trips.forEach(async (t, idx) => {
           
            
            trips[ idx ].destinations = await Destination.find({ tripId: t._id }) // get destinations relevant to each trip (Destination.tripId references Trip._id)
        
        
        })
       
        
        resp.render(path.resolve(__dirname+'/../../../dist/templates/trips.html.twig'), {trips:trips, js: '<script src="app.bundle.js"></script>', css: '<link rel="stylesheet" href="app.bundle.css">', base: `<base href="http://${ req.headers.host}/">`})
        


    } catch (err) {

        resp.send({ err }) // ES6 Syntax => {err: some error message or object}

    }


}


module.exports = {addTripsController, getTripsController}