const express = require('express')
const Router = express.Router()


const { outerUserController, innerUserController } = require('../controllers/usersController')


Router.post('/outer', outerUserController)

Router.post('/inner', innerUserController )

module.exports = Router