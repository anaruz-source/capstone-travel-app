const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const path = require('path')

const tripsRoutes =require('./routes/trips')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors())

app.use('/trips', tripsRoutes)

app.listen(process.env.PORT||8081, function(){

    console.log('NODE SERVER RUNNING ON: ', process.env.PORT||8081)
})