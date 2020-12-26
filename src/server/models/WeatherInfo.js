const mongoose = require('mongoose')

// https://www.youtube.com/watch?v=vjf774RKrLc&t=1s

//https://mongoosejs.com/docs/guide.html

// create a Mongodb schema of the collection that will hold our trip data


/// -> Schema alias to alleviate burdern of  writing long names

const { Schema } = mongoose

const PixaInfoSchema = new Schema({ // Schema instantiation

    date: {
        type: Date,
        required: true
    },

    avgTemp: {
        type: Number,
        required: true
    },
    description: {
        type: Number,
        required: true
    },
    precip: {
        type: Number,
        required: true
    },

    icon: {
        type: String,
        required: true
    },
})


module.exports = mongoose.model('WeatherInfo', PixaInfoSchema)