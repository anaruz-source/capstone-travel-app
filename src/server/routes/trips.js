//https://www.tutorialspoint.com/expressjs/expressjs_routing.htm

const express = require('express')

const Router = express.Router()

const Trip = require ('../models/Trip')

Router.post('/', async (req, resp)=> { 
    

   const trip = new Trip( { // instantiate Trip Schema Object 

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
  
   
})

Router.get('/:userId', async (req, resp) => {

    
  try {

    const trips = await Trip.find({userId: req.params.userId}) // return trips only related to the asking user defined with userId param of the http 'get' request

    resp.send(trips)
    
  } catch (err) {

       resp.send({err}) // ES6 Syntax => {err: some error message or object}
    
  }
 

})

module.exports = Router
