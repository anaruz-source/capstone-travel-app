//https://www.tutorialspoint.com/expressjs/expressjs_routing.htm

const Twig = require('twig')
const express = require('express')

const Router = express.Router()

const {
    addTripsController,
    getTripsController,
    getTripController,
    getDestController,
    deleteTrip,
    deleteDestination
} = require('../controllers/tripsController')

Router.post('/add', addTripsController)

Router.get('/userId/:userId', getTripsController)

Router.get('/tripId/:tripId', getTripController)

Router.get('/:tripId/destination/:destId', getDestController)

Router.delete('/delete/:userId/tripId/:tripId', deleteTrip)

Router.delete('/delete/:userId/destId/:destId', deleteDestination)

module.exports = Router