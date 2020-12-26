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

    }


module.exports = {isEmptyObj, revertDate, toEnUSDate}