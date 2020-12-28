const mongoose = require('mongoose')


const UserSchema = require('../schemas/UserSchema')
module.exports = mongoose.model('users', UserSchema)