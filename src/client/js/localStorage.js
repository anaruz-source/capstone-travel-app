// https://www.taniarascia.com/how-to-use-local-storage-with-javascript/
// https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
// using sessionStorage to store data only for a session, if window closed we want everything to be wiped away

const session = window.sessionStorage

const addItem = (key, value) => {

    // argument value is defined and it's different thant unknown, so do nothing, else set the localSession to contain value for key, else set it to unkown

  value ? session.getItem(key) !== 'unknown' ? '' : session.setItem(key, JSON.stringify(value)) : session.setItem(key, 'unknown')
},

removeItem = (key) => {

    if(!key) return null
    return session.removeItem(key)
},

getItem = (key) => {

    if(!key) return null

    return session.getItem(key)
},

clearAll = () => {

    session.clear()
}

export { addItem, removeItem, getItem, clearAll }