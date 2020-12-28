const mongoose = require('mongoose')

// https://www.youtube.com/watch?v=vjf774RKrLc&t=1s

//https://mongoosejs.com/docs/guide.html

// create a Mongodb schema of the collection that will hold our trip data


/// -> Schema alias to alleviate burdern of  writing long names
const { Schema } = mongoose

const CountryInfoSchema = new Schema({ // Schema instantiation

    name: {
        type: String,
        required: true
    },

    capital: {
        type: String,
        required: true
    },
    population: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    flag: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    timezone: {
        type: String,
        required: true
    },

    borders: {
        type: [String], // type Array<String>
        default: []
      

    },
    previewURL: {
        type: String,
        required: true
    },

    largeImageURL: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true
    },
    comments: {
        type: Number,
        required: true
    },
    obscure: {
        type: Boolean,
        default: false
    },

    destId : {

        type: Schema.Types.ObjectId,

        ref: 'destinations'
    }



})


module.exports = CountryInfoSchema