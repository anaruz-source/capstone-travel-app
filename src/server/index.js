const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const tripsRoutes = require('./routes/trips')
const usersRoutes = require('./routes/users')

const dotenv = require('dotenv')


dotenv.config()

app.use(express.static('dist'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors())


app.use('/trips', tripsRoutes)

app.use('/users', usersRoutes)

app.get('/', (req, res) => res.send('dist/index.html'))



// Connect to the Mongo Atlas noSQL Document DataBase, using the link stored in the .env folder for security

mongoose.connect(process.env.MONGO_ATLAS_CONNECT, {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}, ()=>{

    console.log('connection established!')
})

app.listen(process.env.PORT||3030, function(){

    console.log('NODE SERVER RUNNING ON: ', process.env.PORT||3030)
})