const mongoose = require('mongoose')

// https://www.youtube.com/watch?v=vjf774RKrLc&t=1s

//https://mongoosejs.com/docs/guide.html

// create a Mongodb schema of the collection that will hold our trip data
/// -> Schema alias to alleviate writing burdern of long names

const { Schema } = mongoose

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
        default:''
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
           default:'offline'
        },

    authType: ''

}) 


module.exports = mongoose.model('Users', UserSchema)