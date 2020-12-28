const mongoose = require('mongoose')


const DestinationSchema = require('../schemas/DestinationSchema')

module.exports = mongoose.model('destinations', DestinationSchema)