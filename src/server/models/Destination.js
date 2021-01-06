const mongoose = require('mongoose')



// https://www.youtube.com/watch?v=vjf774RKrLc&t=1s

//https://mongoosejs.com/docs/guide.html

// create a Mongodb schema of the collection that will hold our trip data


/// -> {Schema, model } to alleviate writing burdern of long names

const { Schema, model } = mongoose

const DestinationSchema = new Schema({ // Schema instantiation

    name: {
        type: String,
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
    },

    countryInfos: {

        type: Schema.Types.ObjectId,
        ref: 'countryinfos'
    },

    weatherInfos: {

        type: Schema.Types.ObjectId,
        ref: "weatherinfos"
    },

    places: {
        type: Schema.Types.ObjectId,
        ref : 'places'
    },
    tasks: {
        type: Schema.Types.ObjectId,
        ref: 'todos'
    }


})


module.exports = model('destinations', DestinationSchema)