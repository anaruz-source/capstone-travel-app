const mongoose = require('mongoose')

// https://www.youtube.com/watch?v=vjf774RKrLc&t=1s

//https://mongoosejs.com/docs/guide.html

// create a Mongodb schema of the collection that will hold our trip data
/// -> Schema alias to alleviate writing burdern of long names

const { Schema } = mongoose

const UserSchema = new Schema({ // Schema instantiation

    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    startDate: {
        date: Date,
        required: true
    },
    endDate: {
        date: Date,
        required: true
    },

}) 


module.exports = mongoose.model('User', UserSchema)