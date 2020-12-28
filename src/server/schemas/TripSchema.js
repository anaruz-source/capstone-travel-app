const mongoose = require('mongoose')

const {Schema} = mongoose

const TripSchema = new Schema({ // Schema instantiation

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    startDate: {
        type: Date,
        default: Date.now
    },

    endDate: {
        type: Date,
        default: Date.now

    },

    duration: {
        type: Number,
        required: true
    },

    expired: {
        type: Boolean,
        default: false
    },

    userId: {  // owner id of the trip
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    destinations: [{

        type: Schema.Types.ObjectId,
        ref: 'destinations'
    }]

}) 


module.exports = TripSchema