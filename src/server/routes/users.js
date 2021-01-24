const express = require('express')
const Router = express.Router()

const {
    outerUserController,
    innerUserController,
    sessionTearingDownController,
    profileController
} = require('../controllers/usersController')

Router.post('/outer', outerUserController)

Router.post('/inner', innerUserController)

Router.get('/:userId', profileController)

Router.post('/logout', sessionTearingDownController)

module.exports = Router