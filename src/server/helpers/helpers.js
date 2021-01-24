const SESSION_TIMEOUT = 60 // mins

// JQuery3.5.1 IsEmptyObject
// https://code.jquery.com/jquery-3.5.1.js

function isEmptyObj(obj) {


    for (let prop in obj) { // if object has one property then it's not empty


        return false;
    }

    return true
}

const toEnUSDate = (d) => {

    const value = revertDate(new Intl.DateTimeFormat('en-US').format(d).replaceAll('/', '-')) // construct an en-US date, then convert it to YYYY-MM-DD

    return value
},

    countDays = (start, now) => {

        const st = new Date(start)
        const ed = new Date(now)

        const diff = ed.getTime() - st.getTime()

        return diff / (1000 * 60 * 60 * 24) // convert ms to days

    },


    removeIfDefined = async (doc) => { // remove document if defined

        if (!!doc) await doc.remove()
    },

    findInUsrsPlaceHolders = (placeHolders, id) => {

        if (!placeHolders || isEmptyObj(placeHolders)) return void 0 // undefined

        for (let u in placeHolders) {

            let p = placeHolders[u]

            if (!p || isEmptyObj(p)) return void 0 // nothing found (return undefind, void 0)

            if (p.user._id == id) {

                return p
            }
        }

        return void 0 // undefined
    },

    // used to tear down a user session after a certain period
    // sessionId or userId is the same, as a user intiate a session when connects
    isToTearDownSession = (usr, sessionId) => {

        if (!usr || isEmptyObj(usr)) return false

        if (usr.user._id == sessionId) {

            const nowTime = (new Date()).getTime()
            const conTime = (new Date(usr.connDate)).getTime()

            console.log('dates', nowTime, conTime)
            const elapsed = parseInt((nowTime - conTime) / 1000 / 60) /* 1000 to sec, 60 to min */

            console.log('elapsed', elapsed)
            if (elapsed > SESSION_TIMEOUT) return true // 

        }

        return false
    },

    sessionTearingDownHelper = (placeHolders, userId) => {


        const p = findInUsrsPlaceHolders(placeHolders, userId)

        if (!p || isEmptyObj(p.user)) return true

        if (isToTearDownSession(p, userId)) {

            placeHolders[p.user._id] = undefined

            return true
        }

        return false
    },

    redirect = (req, resp) => {

        // https://www.tutorialspoint.com/redirecting-requests-in-node-js

        resp.statusCode = 302;
        resp.tearDownSession = true
        resp.setHeader('Location', '/');
        return resp.end();
    }
// this a callback for Array.prototype.findIndex method, {id} will be passed so that we can compared it to the Id of elements

// if equality, index of object in array is returned

// ARROW FUNCTIONS DON'T WORK IN SUCH USE CASE (this resolved syntactically)

function findIndexInArrOfObjs(obj) {
    return obj._id == this.id
}


module.exports = {
    isEmptyObj,
    toEnUSDate,
    countDays,
    removeIfDefined,
    findIndexInArrOfObjs,
    isToTearDownSession,
    findInUsrsPlaceHolders,
    sessionTearingDownHelper,
    redirect
}