//https://www.tutorialspoint.com/expressjs/expressjs_routing.htm
const Twig = require('twig')
const express = require('express')

const Router = express.Router()

const { addTripsController, getTripsController, getTripController, deleteTrip, deleteDestination} = require('../controllers/tripsController')

Router.post('/add', addTripsController )

Router.get('/userId/:userId', getTripsController )

Router.get('/tripId/:tripId', getTripController)

Router.delete('/del/tripId/:tripId', deleteTrip)

Router.delete('/del/destId/:destId', deleteDestination)
module.exports = Router
