// http://www.geonames.org/export/geonames-search.html 

import { fetchAny } from "./helpers"



let placeHolder = { 
                    username:'',
                    password: '',
                    trips: [],
                },  
   
    geoUrl = 'http://api.geonames.org/searchJSON?q=&username=senyur',
 
    weatherBitKey = '16cf41ca3b3b47efb9eeb123cb640fd2',

    weatherBitHistUrl = 'https://api.weatherbit.io/v2.0/history/daily?lat=&lon=&start_date=&end_date=&key='+weatherBitKey,
    
    weatherBitCurUrl = 'https://api.weatherbit.io/v2.0/forcast/daily?lat=&lon=&key='+weatherBitKey,
    
    pixaUrl = 'GEThttps://pixabay.com/api/key=9323775-fe8ad975fc3aebdc3d5c7875e',
    

options = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json'
    },
    body: undefined
}


function handleFormSubmission (event){
  
    event.preventDefault()

   const findReplace = Client.findReplace //Creating a shortcut for this function to alleviate usage of invoking long functions names

    const fetchAny = Client.fetchAny

    const location = document.getElementById('destination').value
    const start = document.getElementById('start-date').value
    const end = document.getElementById('end-date').value

    const geoNewUrl = findReplace.call(geoUrl, `q=${location}`)
       

    fetchAny(geoNewUrl)
   
    .then(function(data) {
   
     const   weatherBitNewUrl = findReplace.call(weatherBitUrl, `lon=${data.geonames[0].lng}`, `lat=${data.geonames[0].lat}`, `start_date=${start}`, `end_date=${end}`) //reconstructing the weatherbit query string


        fetchAny(weatherBitNewUrl).

        then(data => console.log(data))

})
}


// using https://www.npmjs.com/package/js-datepicker

function handleDate (){

  
    const start = Client.dtPicker('#start-date', new Date())
    const end = Client.dtPicker('#end-date', new Date())


}
export {handleFormSubmission, handleDate}