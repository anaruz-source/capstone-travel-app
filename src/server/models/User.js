const mongoose = require('mongoose')

//https://mongoosejs.com/docs/guide.html

// create a Mongodb schema of the collection that will hold our trip data
/// -> {Schema, model }  to alleviate writing burdern of long names

const { Schema, model } = mongoose

const UserSchema = new Schema({ // Schema instantiation

    username: {
        type: String,
        unique: true, // uniquness in the databse, prevent to reuse the same username
        default: ''
    },
    password: {
        type: String,
        default: ''
    },

    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true // uniquness in the databse, prevent to reuse the same email address
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

    status: {
        type: String,
        default: 'offline'
    },

    authType: '',

    trips: [{

        type: Schema.Types.ObjectId,
        ref: 'trips'
    }]

}) 

module.exports = model('users', UserSchema)