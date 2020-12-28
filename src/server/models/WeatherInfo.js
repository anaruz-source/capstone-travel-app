const mongoose = require('mongoose')

const {Schema} = mongoose
const WeatherInfoSchema = require('../schemas/WeatherInfoSchema')

const WeatherInfo = new Schema({

    destId: {
        type: Schema.Types.ObjectId,
        ref:'destinations'
    },

    forecasts: {

        type: [WeatherInfoSchema],
        default: []
    }
})

module.exports = mongoose.model('weatherInfos', WeatherInfo)