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

async function fetchAny (url, options){

    const response = await fetch(url, options);

    try {

        const data = await response.json();


        if ((data.cod && data.cod != '200') || (data[0] && data[0].cod && data[0].cod != '200')) throw new Error(data.message); // fetch doesn't throw in case a city not found! we don't want to fill endpoint with empty data:


     
         
        console.log('data', data)

        return data;

    } catch (err) {

        //   throw new Error(err.message);

        console.log(err)

    }
}



function dtPicker (selector, minDate) {

const datepickr = Client.datepickr 

    const datepicker = datepickr(selector, {  
        
        formatter: (input, date, instance) => {
             // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
             // convert to en-US format MM-DD-YYYY
             // then convert to suited format to weatherbit.com YYYY-MM-DD
            const value = revertDate(new Intl.DateTimeFormat('en-US').format(date).replaceAll('/', '-'))
            input.value = value                                       
        },

        position: 'c',

        id: 1
    })

    return datepicker.setMin(minDate)  // prevents selecting passed dates, so we set the date to current

}


function revertDate(str){
    
    let m = str.match(/\d+/g)
     
    return `${m[2]}-${m[0]}-${m[1]}`
}

export {
    
    findReplace,
    fetchAny,

    dtPicker

}

