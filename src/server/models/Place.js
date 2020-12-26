const mongoose = require('mongoose')

// https://www.youtube.com/watch?v=vjf774RKrLc&t=1s

//https://mongoosejs.com/docs/guide.html

// create a Mongodb schema of the collection that will hold our trip data


/// -> Schema alias to alleviate burdern of  writing long names
const { Schema } = mongoose

const PlaceSchema = new Schema({ // Schema instantiation

    name: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    expired: {
        type: Boolean,
        default: false,
        required: true
    },

    destinationId: {
  // owner id of the trip
            type: Schema.Types.ObjectId,
            ref: 'Destination'

    }

})


module.exports = mongoose.model('Place', PlaceSchema)