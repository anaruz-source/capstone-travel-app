// http://www.geonames.org/export/geonames-search.html 

import fillParams from './helpers'
import fetchAny from './helpers'

let geoUrl = 'api.geonames.org/searchJSON?q=&username=senyur',
 
options = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
}


function handleFormSubmission (event){
  
    event.preventDefault()

    const location = document.getElementById('destination').value
    const start = document.getElementById('start-date').value
    const end = document.getElementById('end-date').value

    const effectUrl = fillParams('q', location)

    fetchAny(effectUrl)
   
    .then(function(data) {
   
        console.log(data)
   
    })

}


export {handleFormSubmission}