// https://www.taniarascia.com/how-to-use-local-storage-with-javascript/
// https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
// using sessionStorage to store data only for a session, if window closed we want everything to be wiped away

const session = window.sessionStorage

const addItem = (key, value) => {

    // argument value is defined and it's different thant unknown, and the unknown's userId (set in Mongodb for the sake of reviewing) so do nothing, else set the localSession to contain value for key, else set it to unkown
    const item = JSON.parse(session.getItem(key))

    value ? item && typeof item === 'string' && item !== '5fea479cb59a4b30df27ac39' 
          ? '' : session.setItem(key, JSON.stringify(value)) : session.setItem(key, JSON.stringify('test'))
},

removeItem = (key) => {

    if(!key) return null
    return session.removeItem(key)
},

getItem = (key) => {

    if(!key) return null

    return JSON.parse(session.getItem(key))
},

clearAll = () => {

    session.clear()
}

export { addItem, removeItem, getItem, clearAll }