const mongoose = require('mongoose')

// https://www.youtube.com/watch?v=vjf774RKrLc&t=1s

//https://mongoosejs.com/docs/guide.html

// create a Mongodb schema of the collection that will hold our trip data
/// -> Schema alias to alleviate writing burdern of long names

const { Schema } = mongoose

const UserSchema = new Schema({ // Schema instantiation

    username: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    avatar: {

        type: String,
        default: ''
    },
    inscriptionDate: {
        type: Date,
       
        default: Date.now
    },
    role: {
        type: String,
        default: ''
       },

        group: {
            type: String,
            default: ''
    },
    locked: {
        type: Boolean,
        default: false
    },

    authType: ''

}) 


module.exports = mongoose.model('Users', UserSchema)