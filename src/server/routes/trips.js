//https://www.tutorialspoint.com/expressjs/expressjs_routing.htm

const express = require('express')

const Router = express.Router()

const Trip = require ('../models/Trip')

Router.post('/', async (req, res)=> { 
    

   const trip = new Trip( { // instantiate Trip Schema Object 

        title: req.body.title,
        
        description: req.body.description,
        
        startDate: req.body.startDate,
        
        endDate: req.body.endDate,
        
        userId: req.body.userId
   }) 
    try {
        
        const sentTrip = await trip.save() // saving in Mongodb Atlas, caprtrip database, trips collection

        res.send(sentTrip)

    } catch (error) {

      res.send({msg: error})
        
    }
  
   
})


module.exports = Router
