const mongoose = require('mongoose')

// https://www.youtube.com/watch?v=vjf774RKrLc&t=1s
//https://mongoosejs.com/docs/guide.html
// create a Mongodb schema of the collection that will hold our Places data
/// -> Schema alias to alleviate burdern of  writing long names

const {
    Schema
} = mongoose

const UniquePlaceSchema = new Schema({

    place: {
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

    }

})

const PlaceSchema = new Schema({ // Schema instantiation

    places: [UniquePlaceSchema],

    destinationId: {
        // owner id of the trip
        type: Schema.Types.ObjectId,
        ref: 'destinations'

    }

})


module.exports = mongoose.model('places', PlaceSchema)