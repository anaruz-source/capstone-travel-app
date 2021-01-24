// for jest testing please add const, let or var to that endpoint, otherwise it will throw error
placeHolders = {} // this will contain active users connection info  (online users)

const Twig = require('twig')

const express = require('express')

const bodyParser = require('body-parser')

const cors = require('cors')

const app = express()

const mongoose = require('mongoose')

const tripsRoutes = require('./routes/trips')

const usersRoutes = require('./routes/users')

const ppRoutes = require('./routes/placesPacks')

const {
    sessionTearingDownHelper,
    redirect
} = require('./helpers/helpers')

const dotenv = require('dotenv')


dotenv.config()

app.use(express.static('dist'))

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())

app.use(cors())

app.use('/users', usersRoutes)


app.all('*/:userId', async (req, resp, next) => { // check if user is connected


    const oUrl = req.originalUrl

    const u = oUrl.split('/')


    // userId contained in body,  after delete in a req originalUrl, or params
    let userId = req.body && req.body.userId || u.indexOf('delete') != -1 && u[u.indexOf('delete') + 1] || req.params.userId


    if (!sessionTearingDownHelper(placeHolders, userId, req, resp) || oUrl.indexOf('logout') > -1) {


        next() // execute next instructions

    }
    else {


        redirect(req, resp) //|// to home/index page

    }

})

app.get('/', (req, res) => res.send('dist/index.html'))


app.use('/trips', tripsRoutes)

app.use('/trip', tripsRoutes)

app.use('/destination', tripsRoutes)

app.use('/user', usersRoutes)

app.use('/profile', usersRoutes)

app.use('/places-packs', ppRoutes)


// Local mongodb connection (.env for details)

mongoose.connect(process.env.MONGO_LOCAL_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, () => {

    console.log('Local mongodb connection established!')
})


// Connect to the Mongo Atlas noSQL Document DataBase, using the link stored in the .env folder for security
// mongoose.connect(process.env.MONGO_ATLAS_CONNECT, {
//     useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}, ()=>{

//     console.log('Remote mongodb Atlas connection established!')
// })

// for test pupose

app.listen(process.env.PORT || 3030, function () {

    console.log('NODE SERVER RUNNING ON: ', process.env.PORT || 3030)
})


module.exports = app