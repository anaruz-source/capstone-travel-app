const express = require('express')
const Router = express.Router()

const  User = require('../models/User')


const verifyToken = require('../auth/googleServerSide')

Router.post('/outer', async (req, res) => { 


    try {

        await verifyToken(req.body.idToken) // if the verification passes, we move on, otherwise, it throws error 

        const user = new User( { // Instantiate User Schema Object 
                name: req.body.name,
                email: req.body.email,
                username: req.body.email, // set to be email default in case of thirdparty auth (Google)
                avatar: req.body.avatar,
                authType: 'outer'
        })

        const savedUser = await user.save() // save to Mongodb Atlas

        res.send(savedUser) // send back to user to store locally
        
    } catch (error) {
        
        res.send({msg: error})
    }
    
})

module.exports = Router