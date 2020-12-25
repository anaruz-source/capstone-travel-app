const Trip = require('../models/Trip')

const path = require('path')

const {isEmptyObj} = require('../helpers/helpers')

const addTripsController = async (req, resp) => {


    const trip = new Trip({ // instantiate Trip Schema Object 

        title: req.body.title,

        description: req.body.description,

        startDate: req.body.startDate,

        endDate: req.body.endDate,

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
     
        resp.render(path.resolve(__dirname+'/../../../dist/templates/trips.html.twig'), {trips:trips, js: '<script src="app.bundle.js"></script>', css: '<link rel="stylesheet" href="app.bundle.css">'})
        
        

    } catch (err) {

        resp.send({ err }) // ES6 Syntax => {err: some error message or object}

    }


}


module.exports = {addTripsController, getTripsController}