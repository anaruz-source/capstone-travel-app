const path = require('path')
const Trip = require('../models/Trip')
const {countDays} = require('../helpers/helpers')
const createDestination = require('../helpers/modelsUtils')
const User = require('../models/User')
const { populate } = require('../models/Trip')


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
       
        
        const user =  await User.findById({_id: req.body.userId})
        

        const savedTrip = await trip.save() // saving in Mongodb Atlas, captrip database, trips collection
        
    
        const  savedDestination_id = await createDestination({id: savedTrip._id, title: savedTrip.title, ...req.body}) // ES6 spred parameters
     
    
       savedTrip.destinations.push(savedDestination_id) // update trip with created destination._id then save()

      
        await savedTrip.save()

        user.trips.push(savedTrip._id) // update user with created trip._id
        
        await user.save()
              
        resp.send(savedDestination)

    } catch (err) {

        resp.send({ err })  // ES6 Syntax => {err: some error message or object}

    }


},

getTripsController = async (req, resp) => {
    
  // joining tables in mongoose to create complex queries
  
  // https://medium.com/@mendes.develop/joining-tables-in-mongodb-with-mongoose-489d72c84b60

    try {


     const trips =   await Trip.find({userId: req.params.userId}) // compound mongoose query to populate _id references with real objects in Trip.destinations
                               .populate({
                                   path: 'destinations', // array of refs => array of Destination objs
                                   
                                   populate: {

                                       path: 'countryInfos weatherInfos' // in Trip.destinations.weahterInfos and .countryInfos fields
                                   }       
                                                                        //  refs to WeatherInfo and CountryInfo => Real objs of previous
                                })
     
    // rendering template with given trips queried above
    
        resp.render(path.resolve(__dirname+'/../../../dist/templates/trips.html.twig'), {trips: trips, js: '<script src="app.bundle.js"></script>', css: '<link rel="stylesheet" href="app.bundle.css">', base: `<base href="http://${ req.headers.host}/">`})
        


    } catch (err) {

        resp.send({ err }) // ES6 Syntax => {err: some error message or object}

    }


}


module.exports = {addTripsController, getTripsController}