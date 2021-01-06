//https://www.tutorialspoint.com/expressjs/expressjs_routing.htm
const Twig = require('twig')
const express = require('express')

const Router = express.Router()

const { addTripsController, getTripsController, getTripController} = require('../controllers/tripsController')

Router.post('/', addTripsController )

Router.get('/userId/:userId', getTripsController )

Router.get('/tripId/:tripId', getTripController)

module.exports = Router
