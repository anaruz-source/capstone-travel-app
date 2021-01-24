const express = require('express')
const Router = express.Router()

const {
    addPP,
    deletePP
} = require('../controllers/placesPacksController')

Router.post('/add/', addPP) // ading using destinations ids
Router.delete('/delete/:userId/:type/:ppId', deletePP) // delete using places/packs ids (stored in type and ppId in req.params.type and req.params.ppId rescpectivly)

module.exports = Router