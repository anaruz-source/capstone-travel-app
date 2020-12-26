const mongoose = require('mongoose')

// https://www.youtube.com/watch?v=vjf774RKrLc&t=1s

//https://mongoosejs.com/docs/guide.html

// create a Mongodb schema of the collection that will hold our trip data


/// -> Schema alias to alleviate writing burdern of long names

const { Schema } = mongoose

// 
const CountryInfo = require('../models/CountryInfo')
const PixaInfo = require('../models/PixaInfo')
const  weatherInfo = require('../models/WeatherInfo')

const DestinationSchema = new Schema({ // Schema instantiation

    name: {
        type: String,
        required: true
    },
    countryInfo: {
        type: CountryInfo,
        required: true
    },
    
    pixaInfo: {
      type: PixaInfo,
      required: true
    },
     weatherInfo: {
         type: [weatherInfo],
         required: true
     },

    expired: {
        type: Boolean,
        default: false,
        required: true
    },

    tripId: {
        type: String,
        required: true,
        
    }

})


module.exports = mongoose.model('Destinations', DestinationSchema)