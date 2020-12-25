// JQuery3.5.1 IsEmptyObject
// https://code.jquery.com/jquery-3.5.1.js

function isEmptyObj(obj) {


    for (let prop in obj) { // if object has one property then it's not empty


        return false;
    }

    return true
}


module.exports = {isEmptyObj}