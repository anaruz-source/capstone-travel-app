const mongoose = require('mongoose')

// https://www.youtube.com/watch?v=vjf774RKrLc&t=1s

//https://mongoosejs.com/docs/guide.html

// create a Mongodb schema of the collection that will hold our trip data
/// -> Schema alias to alleviate writing burdern of long names

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

    expired: {
        type: Boolean,
        default: false
    },

    userId: {  // owner id of the trip
        type: String,
        default: 'unknown'
    }

}) 


module.exports = mongoose.model('Trips', TripSchema)