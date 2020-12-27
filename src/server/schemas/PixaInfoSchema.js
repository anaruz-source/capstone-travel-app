const mongoose = require('mongoose')

// https://www.youtube.com/watch?v=vjf774RKrLc&t=1s

//https://mongoosejs.com/docs/guide.html

// create a Mongodb schema of the collection that will hold our trip data


/// -> Schema alias to alleviate burdern of  writing long names

const { Schema } = mongoose

const PixaInfoSchema = new Schema({ // Schema instantiation

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
    }



})


module.exports =  PixaInfoSchema