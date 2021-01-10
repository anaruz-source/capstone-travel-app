// JQuery3.5.1 IsEmptyObject
// https://code.jquery.com/jquery-3.5.1.js

function isEmptyObj(obj) {

// for NodeList and HTMLCollection there're some props even when empty,
// So let's add this check to make this function more general purpose

 const toString = Object.prototype.toString // shortcut to Object.protoype method, we need to change its 'this' context to reveal type of object

if( obj.length == 0 && (toString.call(obj) === '[object NodeList]'|| toString.call(obj) == '[object HTMLCollection]' )) return true

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


    dtPicker = (selector, minDate) => {


        const datepicker = datepickr(selector, {

            formatter: (input, date, instance) => {
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
                // convert to en-US format MM-DD-YYYY
                // then convert to suited format to weatherbit.com YYYY-MM-DD

                const value = toEnUSDate(date)

                input.value = value
            },

            id: 1 // id used to link start and end dates 
        })

        return datepicker.setMin(minDate)  // prevents selecting passed dates, so we set the date to current

    },

    removeIfDefined  = async (doc) => { // remove document if defined

        if(!!doc) await doc.remove()
    }


module.exports = {isEmptyObj,  toEnUSDate, countDays, dtPicker, removeIfDefined}