const Trip = require('../models/Trip')

const path = require('path')

const addTripsController = async (req, resp) => {

    const duration  = (new Date(req.body.endDate).getTime() - new Date(req.body.startDate).getTime()) / (1000*60*60*24) //get number of days between two dates  
    

    console.log(duration)
    const trip = new Trip({ // instantiate Trip Schema Object 

        title: req.body.title,

        description: req.body.description,

        startDate: req.body.startDate,

        endDate: req.body.endDate,

        duration : duration,

        userId: req.body.userId
    })
    try {

        const sentTrip = await trip.save() // saving in Mongodb Atlas, caprtrip database, trips collection

        resp.send(sentTrip)

    } catch (err) {

        resp.send({ err })  // ES6 Syntax => {err: some error message or object}

    }


},

getTripsController = async (req, resp) => {
   

    try {

        const trips = await Trip.find({ userId: req.params.userId }) // return trips only related to the asking user defined with userId param of the http 'get' request
        // raw dates are stored in the datebase so we need some manipulation to adjust them for dispaly on the page

        resp.render(path.resolve(__dirname+'/../../../dist/templates/trips.html.twig'), {trips:trips, js: '<script src="app.bundle.js"></script>', css: '<link rel="stylesheet" href="app.bundle.css">', base: `<base href="http://${ req.headers.host}/">`})
        
        

    } catch (err) {

        resp.send({ err }) // ES6 Syntax => {err: some error message or object}

    }


}


module.exports = {addTripsController, getTripsController}