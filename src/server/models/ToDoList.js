const mongoose = require('mongoose')

// https://www.youtube.com/watch?v=vjf774RKrLc&t=1s

//https://mongoosejs.com/docs/guide.html

// create a Mongodb schema of the collection that will hold our trip data


/// -> Schema alias to alleviate writing burdern of long names
const { Schema } = mongoose

const UniqueItem = new Schema({


    description: {
        type: String,
        required: true
    },

    done: {
        type: Boolean,
        default: false,
        required: true
    },
})

const TodoSchema = new Schema({ // Schema instantiation
    
    tasks: [UniqueItem],

    destinationId: {
        // owner id of the trip
        type: Schema.Types.ObjectId,
        ref: 'destinations'

    }

})


module.exports = mongoose.model('todos', TodoSchema)