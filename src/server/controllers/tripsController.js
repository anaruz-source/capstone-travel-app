const path = require('path')
const Trip = require('../models/Trip')
const {countDays} = require('../helpers/helpers')
const { createDestination, findTrips, findOneTrip, findOneDestination} = require('../helpers/modelsUtils')
const User = require('../models/User')
const Destination = require('../models/Destination')
const Place = require('../models/Place')
const Pack = require('../models/ToDoList')
const CountryInfo = require('../models/CountryInfo')
const WeatherInfo = require('../models/WeatherInfo')



const addTripsController = async (req, resp) => {

    const duration = countDays(req.body.startDate, req.body.endDate) //get number of days between two dates  


    let  trip = null

    if( !!req.body.tripId){ // updating trip with a new destination 
    
        try {               // (existing one as req.body.tripId contains and Id => !!req.body.tripId resolves to true)
        
         trip = await findOneTrip(req.body.tripId)
          
      } catch (err) {

        resp.send({err})
          
      }

        


    } else {


        trip = new Trip({  // instantiate Trip Schema Object 

            title: req.body.title,

            description: req.body.description,

            startDate: req.body.startDate,

            endDate: req.body.endDate,

            duration: duration,

            userId: req.body.userId
        })

        trip = await trip.save() // saving in Mongodb Atlas (remote) || local, captrip database, trips collection

  
    }
    

    try {
       
        
        const user =  await User.findById({_id: req.body.userId})
        

        const  savedDestination_id = await createDestination({id: trip._id, title: trip.title, ...req.body}) // ES6 spread parameters
     
    
       trip.destinations.push(savedDestination_id) // update trip with created destination._id then save()

      
        await trip.save()

        user.trips.push(trip._id) // update user with created trip._id
        
        await user.save()

        const t = await findOneTrip(trip._id)
              
       resp.send(t)

              
    
    } catch (err) {

        resp.send({ err })  // ES6 Syntax => {err: some error message or object}

    }


},

getTripsController = async (req, resp) => {
    
  // joining tables in mongoose to create complex queries
  
  // https://medium.com/@mendes.develop/joining-tables-in-mongodb-with-mongoose-489d72c84b60

  

    try {

     const trips = await findTrips(req.params.userId)
     
    // rendering template with given trips queried above
  
   
   if(req.get('X-Custom-Resp-Type') == 'json'){  // if asked for json, else send HTML, 
                                                //more formatting could be added later one using the same principle (with else if or switch (case))
       resp.send(trips)
    } else {
       
        console.log(trips)
       resp.render(path.resolve(__dirname + '/../../../dist/templates/trips.html.twig'), { trips: trips, js: '<script src="app.bundle.js"></script>', css: '<link rel="stylesheet" href="app.bundle.css">', base: `<base href="http://${req.headers.host}/">` })


    }

        

    } catch (err) {

        resp.send({ err }) // ES6 Syntax => {err: some error message or object}

    }


},

getTripController = async (req, resp) => {

    try {
        
        const trip = await  findOneTrip(req.params.tripId)

         resp.send(trip)

    } catch (err) {
        
         resp.send({err})
    }

   
},
deleteTrip = (req, resp) => {

// https://mongoosejs.com/docs/models.html#deleting

// https://www.geeksforgeeks.org/mongoose-deletemany-function/

    const trip = await findOneTrip(req.params.tripId)

    if(!!trip) return // nothing found (trip is null)

    trip.destinations.forEach(d => { // delete children of destinations before deleting these latters
        
        Place.deleteOne({ destinationId: d._id },  function (err) {
            if (err) return handleError(err);
            // deleted at most one  document
        })
        Pack.deleteOne({ destinationId: d._id }, function (err) {
            if (err) return handleError(err);
            // deleted at most one tank document
        })
        CountryInfo.deleteOne({ destinationId: d._id }, function (err) {
            if (err) return handleError(err);
            // deleted at most one tank document
        })
        WeatherInfo.deleteOne({ destinationId: d._id }, function (err) {
            if (err) return handleError(err);
            // deleted at most one tank document
        })
         
        
    });

    Destination.deleteMany({ tripId: trip._id }, function (err) {
        if (err) return handleError(err);
        // deleted at least one  document
    })

    Trip.deleteOne({ _id: trip._id}, function (err) {
        if (err) return handleError(err);
        // deleted at most one  document
    })

    resp.send({del: 'success'})
},

deleteDestination = (req, resp) => {


    // https://mongoosejs.com/docs/models.html#deleting

    // https://www.geeksforgeeks.org/mongoose-deletemany-function/

    const d = await findOneDestination(req.params.destId)

    if (!!d) return // nothing found (d is null)

    
    // delete children//related documents of destinations before deleting these latters

        Place.deleteOne({ destinationId: d._id }, function (err) {
            if (err) return handleError(err);
            // deleted at most one  document
        })
        Pack.deleteOne({ destinationId: d._id }, function (err) {
            if (err) return handleError(err);
            // deleted at most one tank document
        })
        CountryInfo.deleteOne({ destId: d._id }, function (err) {
            if (err) return handleError(err);
            // deleted at most one tank document
        })
        WeatherInfo.deleteOne({ destId: d._id }, function (err) {
            if (err) return handleError(err);
            // deleted at most one tank document
        })



    Destination.deleteOne({ _id: d._id }, function (err) {
        if (err) return handleError(err);
        // deleted at most one  document
    })

    resp.send({ del: 'success' })

}


module.exports = {addTripsController, getTripsController, getTripController, deleteTrip, deleteDestination}