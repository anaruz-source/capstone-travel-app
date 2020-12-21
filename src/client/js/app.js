// http://www.geonames.org/export/geonames-search.html 

import { fetchAny } from "./helpers"



let placeHolder = { 
                    username:'',
                    password: '',
                    trips: [],
                },  
   
    options = {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: undefined
    },
 
    weatherBitKey = '16cf41ca3b3b47efb9eeb123cb640fd2',

    pixaKey = '9323775-fe8ad975fc3aebdc3d5c7875e',
  
    geoUrl = 'http://api.geonames.org/searchJSON?q=&username=senyur',
    
    weatherBitHistUrl = 'https://api.weatherbit.io/v2.0/history/daily?lat=&lon=&start_date=&end_date=&key=',
    
    weatherBitCurUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=&lon=&key=',
    
    pixaUrl = 'https://pixabay.com/api/?key=&q=&safesearch=true&image_type=photo&order=popular'

 
 
    async function handleFormSubmission (event){ //using Async to have acess to await, try, catch
  
    event.preventDefault()

   const findReplace = Client.findReplace //Creating a shortcut for this function to alleviate usage of invoking long functions names

    const fetchAny = Client.fetchAny

    const location = document.getElementById('destination').value
    const start = document.getElementById('start-date').value
    const end = document.getElementById('end-date').value

    const geoNewUrl = findReplace.call(geoUrl,  `q=${encodeURIComponent(location)}`)

    const pixaNewUrl = findReplace.call(pixaUrl, `key=${pixaKey}`, `q=${encodeURIComponent(location)}`)
       
    try {

     
        const data = await fetchAny(geoNewUrl)

        const weatherBitNewUrl = findReplace.call(weatherBitCurUrl, `key=${weatherBitKey}`, `lon=${data.geonames[0].lng}`, `lat=${data.geonames[0].lat}`) //reconstructing the weatherbit query string

      

        const dataPix = await fetchAny(pixaNewUrl)

        console.log(dataPix)

        const dataW = await fetchAny(weatherBitNewUrl)

        options.body = JSON.stringify({

            title: location,

            description: `Trip to ${location} starting from ${start} and ending in ${end}`, // default could be updated later on by the owner end user
            
            startDate: start,

            endDate: end,

            userId:'0'

        })

        await fetchAny ('/trips', options ) // pushing trip data to the node server, which will push them to Mongo DB Atlas using Mongoose


        
    } catch(err){

        console.log(err)
    }
   

}


// using https://www.npmjs.com/package/js-datepicker

function handleDate (){

  
    const start = Client.dtPicker('#start-date', new Date())
    const end = Client.dtPicker('#end-date', new Date())


}
export {handleFormSubmission, handleDate}