const express = require('express')
const Router = express.Router()

const {addPP, deletePP } = require('../controllers/placesPacksController')

Router.post('/add/', addPP)  // ading using destinations ids
Router.post('/delete/:type/:ppId', deletePP) // delete using places/packs ids

module.exports = Router