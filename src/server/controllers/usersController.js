const User = require('../models/User')


const verifyToken = require('../auth/googleServerSide')

const hasher = require('crypto') // to hash password using SHA1, server side usage for security reason

const placeHolders = {} // this will contain active users connection info 

const outerUserController = async (req, res) => {

    try {
        await verifyToken(req.body.idToken) // if the verification passes, we move on, otherwise, it throws error 

        const usr = await User.findOne({ email: req.body.email })

        if (usr) { // signin process, user is in mongodb atlas 

            usr.status = 'online'

            placeHolders[usr._id] = usr

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

            res.send(savedUser) // send back to user to store locally
        }



    } catch (err) {

        res.send({ err })
    }

},

innerUserController = async (req, res) => {
    // https://www.npmjs.com/package/password-hash


    const hashed = hasher    // createHmac defaults to SHA1 hash function
        .createHmac('sha1', 'password')
        .update(req.body.password)
        .digest('hex')

    try {


        if (Object.keys(req.body).length == 2) { // email or username and password


            const searchKey = req.body.email.indexOf('@') > -1 ? 'email' : 'username'

            const user = await User.findOne({ [searchKey]: req.body.email }) // we want the value of searchKey as key not the literal searchKey, thus  [] used

            if (hashed === user.password) {

                user.password = undefined // delete password token
                user.status = 'online'

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
            savedUser.password = undefined // deleting user token from being sent back to the user (security breach)
            savedUser.status = 'online'
            res.send(savedUser) // send back to user to store locally
        }

    } catch (err) {

        res.send({ err })
    }


}


module.exports = { outerUserController, innerUserController}