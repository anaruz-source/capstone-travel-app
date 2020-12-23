const express = require('express')
const Router = express.Router()

const  User = require('../models/User')


const verifyToken = require('../auth/googleServerSide')

const hasher = require('crypto') // to hash password using SHA1, server side usage for security reason



const placeHolders = {} // this will contain active users connection info 

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

Router.post('/inner', async (req, res) => {
    // https://www.npmjs.com/package/password-hash

    const hashed = hasher    // createHmac defaults to SHA1 hash function
                          .createHmac('sha1', 'password')
                          .update(req.body.password)
                          .digest('hex') 

    const user = new User({ // Instantiate User Schema Object 
        name: req.body.name,
        email: req.body.email,
        username: req.body.username, 
        authType: 'inner',
        password: hashed
    })
    try {

        const savedUser = await user.save() // save to Mongodb Atlas
        savedUser.password = undefined // deleting user token from being sent back to the user (security breach)
        savedUser.status = 'online'
        res.send(savedUser) // send back to user to store locally

    } catch(err) {

    res.send({err})
    }


})

module.exports = Router