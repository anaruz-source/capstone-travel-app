import datepickr from 'js-datepicker';
function findReplace(...args){ // inserts parameters on required place in the url string
    
    let copy = this.slice() // making a copy of a string reference by this
    
    console.log('...args', args)
    
    args.forEach(arg => {
       
        let s = arg.split('=')
       
        copy = copy.replace(`${s[0]}=`, `${s[0]}=${s[1]}`)
        
        
    })

    console.log('copy', copy)
    return copy
}

const  fetchAny = async (url, options) => {

    const response = await fetch(url, options);

    try {

        const data = await response.json();
         
        console.log('data', data)

        return data;

    } catch (err) {

        //   throw new Error(err.message);

        console.log(err)

    }
},



dtPicker = (selector, minDate) => {


    const datepicker = datepickr(selector, {  
        
        formatter: (input, date, instance) => {
             // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
             // convert to en-US format MM-DD-YYYY
             // then convert to suited format to weatherbit.com YYYY-MM-DD
            const value = revertDate(new Intl.DateTimeFormat('en-US').format(date).replaceAll('/', '-')) // construct an en-US date, then convert it to YYYY-MM-DD
            input.value = value                                       
        },

        id: 1 // id used to link start and end dates 
    })

    return datepicker.setMin(minDate)  // prevents selecting passed dates, so we set the date to current

},


// used to transform an en-US date to YYYY-MM-DD to be used by weatherbit

 revertDate = (str) => {
    
    let m = str.match(/\d+/g)
     
    return `${m[2]}-${m[0]}-${m[1]}`
},

inputValidator = (...inputs) => {

if(isEmptyObj(inputs)) throw new TypeError('no arguments provided') // if no arg provided so the inputs array will be empty, return to the calling context

        inputs.forEach( en => {
            
            if(en.nodeName.toLowerCase() === 'input') {  // only operates on input nodes
                
                if (en.required) { // if required attribute is set to true

                    if (en.value == '') { // value should not be empty then

                        throw new TypeError('input should not be empty')
                    }


                }

            }

        })

        return true // everything is ok if we arrive here with no throw execption to interrupt function execution
},

// input  should contain text only

isInputText = (input) => {

    

    const rgx = /[a-zA-Z\x20]+/ // chars and spaces only,

        res = rgx.exec(input.value) 

    if(!input) throw new TypeError('no argument provided') // no arg passed return

    if (inputValidator(input) ) { // if empty it will throw TypeError if input.required == true
        
    if ( res && res[0] === res.input || !res) { // check if all the input is captured, so it contains text and spaces only or if input.required == false, and it's left empty
   
       return true       
    } else {

        throw new TypeError('Input contains illegal chars!!')
    } 
}

},

// function to append tag ansynchronously

appendTag =  (tag, parent) => {
   
    if (!tag) throw Error('Tag child should be passed as arg')
    if (!parent) throw Error('Parent tag should be passed as arg')

    parent.appendChild(tag)
} 
// JQuery3.5.1 IsEmptyObject
// https://code.jquery.com/jquery-3.5.1.js

function isEmptyObj(obj) {


    for (let prop in obj) { // if object has one property then it's not empty


        return false;
    }

    return true
}

// show/hide adds bootstrap css class d-block and d-none to display and hide elements

// Copied from the previous project weather app

const hide = (elm) => {

    if (elm.className.indexOf('d-block') > -1) {

        elm.classList.replace('d-block', 'd-none')
    } else {

        elm.classList.add('d-none')
    }

},

show = (elm) => {


    if (elm.className.indexOf('d-none') > -1) {

        elm.classList.replace('d-none', 'd-block')
    } else {

        elm.classList.add('d-block')
    }

},

 hasClassName = (elem, className) => {
    
    return elem.className.indexOf(className) > -1 // element has className 
},
handleDate = () => {


    const start = Client.dtPicker('#start-date', new Date())
    const end = Client.dtPicker('#end-date', new Date())


}
export {
    
    findReplace,
    fetchAny,
    revertDate,
    dtPicker,
    isEmptyObj,
    inputValidator,
    isInputText,
    appendTag,
    show,
    hide,
    hasClassName,
    handleDate
}

