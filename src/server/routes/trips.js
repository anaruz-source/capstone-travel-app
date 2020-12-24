//https://www.tutorialspoint.com/expressjs/expressjs_routing.htm

const express = require('express')

const Router = express.Router()

const { addTripsController, getTripsController} = require('../controllers/tripsController')

Router.post('/', addTripsController )

Router.get('/:userId', getTripsController )

module.exports = Router
