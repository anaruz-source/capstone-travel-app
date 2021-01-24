// https://www.taniarascia.com/how-to-use-local-storage-with-javascript/
// https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
// using sessionStorage to store data only for a session, if window closed we want everything to be wiped away

const session = window.sessionStorage

const addItem = (key, value) => {


    const item = JSON.parse(session.getItem(key))


    key && value && session.setItem(key, JSON.stringify(value))
},

    removeItem = (key) => {

        if (!key) return null
        return session.removeItem(key)
    },

    getItem = (key) => {

        if (!key) return null

        return JSON.parse(session.getItem(key))
    },

    clearAll = () => {

        session.clear()
    }

export {
    addItem,
    removeItem,
    getItem,
    clearAll
}