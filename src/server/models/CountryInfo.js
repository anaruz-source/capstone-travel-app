const mongoose = require('mongoose')


const CountryInfoSchema = require('../schemas/CountryInfoSchema')



module.exports = mongoose.model('countryInfos', CountryInfoSchema )