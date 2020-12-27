const mongoose = require('mongoose')

// https://www.youtube.com/watch?v=vjf774RKrLc&t=1s

//https://mongoosejs.com/docs/guide.html

// create a Mongodb schema of the collection that will hold our trip data


/// -> Schema alias to alleviate writing burdern of long names

const { Schema } = mongoose
const CountryInfoSchema = require('./CountryInfoSchema')
const PixaInfoSchema = require('./PixaInfoSchema')
const WeatherInfoSchema = require('./WeatherInfoSchema')

const DestinationSchema = new Schema({ // Schema instantiation

    name: {
        type: String,
        required: true
    },
    countryInfo: {
        type: CountryInfoSchema,
        required: true
    },

    pixaInfo: {
        type: PixaInfoSchema,
        required: true
    },
    weatherInfo: {
        type: [WeatherInfoSchema],
        required: true
    },

    expired: {
        type: Boolean,
        default: false
    },

    step: {
        type: Number,
        default: 0
    },

    tripId: {

        // owner id of the destination
        type: Schema.Types.ObjectId,
        ref: 'trips'
    }

})

module.exports = DestinationSchema