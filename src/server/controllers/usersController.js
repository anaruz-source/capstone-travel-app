const User = require('../models/User')

const path = require('path')

const verifyToken = require('../auth/googleServerSide')

const {findInUsrsPlaceHolders} = require('../helpers/helpers')

const hasher = require('crypto') // to hash password using SHA1, server side usage for security reason

const outerUserController = async (req, res) => {

    try {
        await verifyToken(req.body.idToken) // if the verification passes, we move on, otherwise, it throws error 

        const usr = await User.findOne({ email: req.body.email })

        if (usr) { // signin process, user is in mongodb atlas 

            usr.status = 'online'

            placeHolders[usr._id] = {user:usr, connDate: new Date()}


            res.send(usr)
        
        } else { // sign up if not found by precedent query

            const user = new User({ // Instantiate User Schema Object 
                name: req.body.name,
                email: req.body.email,
                username: req.body.email, // set to be email default in case of thirdparty auth (Google)
                avatar: req.body.avatar,
                authType: 'outer'
            })

            const savedUser = await user.save() // save to Mongodb Atlas

            savedUser.status = 'online'

            placeHolders[savedUser._id] = { user: savedUser, connDate: new Date() }

            res.send(savedUser) // send back to user to store locally
        }



    } catch (err) {

        res.send({ err })
    }

},

innerUserController = async (req, res) => {
    // https://www.npmjs.com/package/password-hash
    // createHmac defaults to SHA1 hash function
    // Storing password token instead of clear password

    const hashed = hasher 
        .createHmac('sha1', 'password')
        .update(req.body.password)
        .digest('hex')

    try {

        if (Object.keys(req.body).length == 2) { // email or username and password


            const searchKey = req.body.email.indexOf('@') > -1 ? 'email' : 'username'

            const user = await User.findOne({ [searchKey]: req.body.email }) // we want the value of searchKey as key not the literal searchKey, thus  [] used

            if (hashed === user.password) {

                user.status = 'online'

                placeHolders[user._id] = { user, connDate: new Date() }
                 

                user.password = undefined // delete password token,(sending a password token to a user is a fatal security breach!)

                res.send(user)

            } else {
                
                throw new Error('Wrong Credentials!!')
            }


        } else {
            const user = new User({ // Instantiate User Schema Object 
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                authType: 'inner',
                password: hashed
            })


            const savedUser = await user.save() // save to Mongodb Atlas
            

            savedUser.status = 'online'

            placeHolders[user._id] = { user, connDate: new Date() } // date for connection date

     

            savedUser.password = undefined // deleting user token from being sent back to the user (security breach)
           
            res.send(savedUser) // send back to user to store locally
        }

    } catch (err) {
      
        res.send({ err : err.message })
    }


},

sessionTearingDownController = (req, resp) => {

      try {

          const p = findInUsrsPlaceHolders(placeHolders, req.body.userId)

          if (p){

              placeHolders[p.user._id] = undefined
              resp.send({ teared: true })

          } else {

              resp.send({userFound: false} )
          }
          
      } catch (err) {
          
       
              resp.send({ err: err.message})
          
      }

},

profileController = (req, resp) => {

    const u = findInUsrsPlaceHolders(placeHolders, req.params.userId)
  
    if(!u.user.avatar) u.user.avatar = 'media/avatar.svg'

    resp.render(path.resolve(__dirname + '/../../../dist/templates/profile.html.twig'), { u: u.user, js: '<script src="app.bundle.js"></script>', css: '<link rel="stylesheet" href="app.bundle.css">', base: `<base href="http://${req.headers.host}/">` })
}


module.exports = { outerUserController, innerUserController, sessionTearingDownController, profileController}