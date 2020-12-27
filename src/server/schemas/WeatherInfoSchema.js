const mongoose = require('mongoose')

// https://www.youtube.com/watch?v=vjf774RKrLc&t=1s

//https://mongoosejs.com/docs/guide.html

// create a Mongodb schema of the collection that will hold our trip data


/// -> Schema alias to alleviate burdern of  writing long names

const { Schema } = mongoose

const WeatherInfoSchema = new Schema({ // Schema instantiation

    date: {
        type: Date,
        required: true
    },

    avgTemp: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    precip: {
        type: Number,
        required: true
    },
    windSpd: {
        type: Number,
        required: true
    },

    icon: {
        type: String,
        required: true
    },
    timezone: {
        type: String,
        required: false
    }
})


module.exports =  WeatherInfoSchema