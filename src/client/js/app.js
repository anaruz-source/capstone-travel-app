// http://www.geonames.org/export/geonames-search.html 

import { fetchAny, show } from "./helpers"

let dataHolder = {}, // to store data of the trip

    placeHolder = { // place holder to contain user info to send to the node js server

    },

    options = {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: undefined
    }

const weatherBitKey = '16cf41ca3b3b47efb9eeb123cb640fd2',

    pixaKey = '9323775-fe8ad975fc3aebdc3d5c7875e',

    geoUrl = 'http://api.geonames.org/searchJSON?q=&username=senyur',

    weatherBitHistUrl = 'https://api.weatherbit.io/v2.0/history/daily?lat=&lon=&start_date=&end_date=&key=', // for future weather forecast

    weatherBitCurUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=&lon=&key=', // for 7 days forecast

    pixaUrl = 'https://pixabay.com/api/?key=&q=&safesearch=true&image_type=photo&order=popular',

    restCountriesUrl = 'https://restcountries.eu/rest/v2/name/',


    handleFormSubmission = async (event) => { //using Async to have acess to await, try, catch

        event.preventDefault()
     

        const location = document.getElementById('destination').value || document.getElementById('dest').value // trip form or destination form (only one field)
      

        const form = Client.getParentOfChild(event.target, 'form')  // get form parent of clicked submit input

        const tripCard = Client.getParentOfChild(form, 'trip-card') // get parent of the form for which submit is clicked

        const dates = tripCard && tripCard.getElementsByTagName('time') // destined to be used in destination form as following

        // handling trip form inputs ||  destination form inputs
        const start = document.getElementById('start-date').value  || dates[0].textContent // start date in case value is null because not present in form
        const end = document.getElementById('end-date').value      || dates [1].textContent  // end date in case value is null 

        const overlay = form.getElementsByClassName('overlay')[0] // overlay position absolute to cover the form
        
        const errForm = document.getElementsByClassName('form-error')[0] // index error form message

        const successForm = document.getElementsByClassName('form-success')[0] // index success form message

        Client.show(overlay)

      

        try {


            const geo = await Client.geonamesAPICall(geoUrl, location)
            dataHolder.geo = {}
            dataHolder.geo.lat = geo.lat
            dataHolder.geo.lng = geo.lng

            dataHolder.countryInfo = await Client.restCountriesAPICall(restCountriesUrl, geo.name) // rest countries API

            dataHolder.pixa = await Client.pixaAPICall(pixaUrl, pixaKey, location, geo.name) // fetching pixabay.com

            dataHolder.weather = await Client.weatherbitAPICall(weatherBitCurUrl, weatherBitHistUrl, weatherBitKey, start, end, geo.lng, geo.lat) // fetching weatherbit

            dataHolder.countryInfo.timezone = dataHolder.weather[0].timezone

            const inputDestParent = Client.getParentOfChild(document.getElementById('input-dest'), 'trip-card')
            
           const tripId = inputDestParent && inputDestParent.getAttribute('data-trip-id-db-info') // form is inside a trip-card (means called by a trip to add dest)
                                                                                                  // otherwise inputDestParent is null => tripId == null   (new trip) 
            options.body = JSON.stringify({

                title: location,

                description: `Trip to ${location} starting from ${start} and ending in ${end}`, // default could be updated later on by the owner end user

                startDate: start,

                endDate: end,

                countryInfo: dataHolder.countryInfo,

                pixaInfo: dataHolder.pixa,

                weatherInfo: dataHolder.weather,

                geo: dataHolder.geo,

                userId: Client.getItem('userId') ,// parse userId store locally of the connected user,
                
                tripId: tripId

            })
            
          
            
            const dataN = await Client.fetchAny('http://localhost:3030/trips', options) // pushing trip data to the node server, which will push them to Mongo DB Atlas using Mongoose
            
            console.log(dataN)

            if (!!form && !Client.hasFullClassName(form.parentNode,'search-bar')){  // somewhere rather than home/index page
            
               Client.hide(form.parentNode)
                form.reset() // reset in case of success
                if (successForm.textContent == '') {

                    // destination or trip

                    successForm.textContent = !!tripId ? 'Destination added successfully' : 'Trip added successfully';

                }

              Client.show(successForm,'d-flex')
              CLient.addClassWithTimeout(successForm, 'd-flex', 10000) // show for 10 secs only

            
            } else { // index page processing

                  Client.hide(overlay)

                  Client.show(successForm, 'd-flex')
                  Client.addClassWithTimeout(successForm, 'd-flex', 10000) // 10secs timer to remove added class
                  form.reset() // reset in case of success 
            }
           
            return dataN

        } catch (err) {

  
           if (!!form && !Client.hasFullClassName(form.parentNode,'search-bar')){ 
          
            const errElm = form.firstElementChild
                  errElm.textContent = err.message
                  Client.show(errElm)
          
            } else { // if we're in /trips/  page
              
              
              

                 Client.show(errForm) 

             

            }


        }


    },
    
    handleAddPlacesTasksForm = async (e) => {

        e.preventDefault()// preventing any default behaviour, do following instead

        const parentDestCard = Client.getParentOfChild(e.target, 'd-card'),
              
              parentForm     = Client.getParentOfChild(e.target, 'form'),
              
              dataDestId = parentDestCard.getAttribute('data-d-db-id')
        
              
          dataHolder.destId = dataDestId // setting task/place's destination _id
        
        if(e.target.id.indexOf('place') > -1) {

            const val = document.getElementById('place').value.split('|')

            dataHolder.type = val[0]
            dataHolder.place = val[1]  // set place  if it's a  add place click 
       
        } else if(e.target.id.indexOf('pack') > -1) {
            
            dataHolder.pack = document.getElementById('pack').value // else add add a task in the list /todo list
           
        }

      if(dataHolder.place || dataHolder.pack) { // if pack or place is defined, else nothing!

        const overlay = parentForm.getElementsByClassName('overlay')[0]
        const error =  parentForm.getElementsByClassName('form-error')[0]
        Client.show(overlay)
        Client.hide(error)
    
        try {

            options.body = JSON.stringify({
                    
                ...dataHolder // spreading Object, ES6 Syntax!


            })


        const pData = await Client.fetchAny(`/places-packs/add/`, options) // adding data to the destination referenced by dataDestId
        
        if (pData.errors) throw new Error(pData.message)
        console.log(pData)

        Client.hide(overlay)
        } catch (err) {

            error.textContent = err.message || 'something went wrong' // reason of error sent from server
            Client.hide(overlay)
            Client.show(error)
            
        }
      } else return // nothing set, do nothing
    },

    handleTabsSwitching = (e) => { // scallable function to display and hide tabs content, highlight active tab
        // use tab and tab-content
        // use your names, but make sure that everything is matching between function and html

        // aliases for Lib Client functions in js folder

    const hasClassName = Client.hasClassName,
        hide = Client.hide,
        show = Client.show

    const tab = e.target || e // in case a tag is passed instead of an event (function could be used as normal function not event listener)
    const id = tab.getAttribute('data-tab-id')
    
    const tabContent = document.getElementById(id)
    
    const tabsContentAdjs = Client.getAdjacentNodes(tabContent) // get all siblings of tabContent except itself

    const tabsAdjs = Client.getAdjacentNodes(tab) // siblings of tab (same parent) except element passed as parameter

    tabsAdjs.forEach( el => el.classList.remove('active')) // removing active for other tabs

    tabsContentAdjs.forEach(el => hide(el)) // hiding siblings

        show(tabContent)

        const top = Client.getElmRect(document.getElementById(`d-card-${id.split('-')[2]}`)).top // getting the  scrolltop of element and scroll to using window.scroll
        
        window.scroll(0, top)


        tab.classList.add('active')
    
     
    },

    documentLoadedListener = (e) => {

        // aliases creations for Client library variables

        const appendTag = Client.appendTag,
            Glib = Client.Glib,
            Places = Client.Places


        appendTag(Glib.meta, document.head)
        appendTag(Glib.script, document.head)

        const onSignInScript = document.createElement('script')
        onSignInScript.textContent = 'function onSignIn(googleUser){ Client.onSignIn(googleUser)}' // appending Google auth script on the head to be Global
        // onSignIn function should be global
        appendTag(onSignInScript, document.head)



        appendTag(Places.script, document.head)

        
        const base = document.createElement('base') // creating and  // ading base  tag dynamically base on the location.href

        base.href = location.href

        appendTag(base, document.head)

        const link1 = document.getElementsByClassName('item1')[0]

        link1.firstElementChild.href = `/trips/userId/${Client.getItem('userId')}`

    },

    windowLoadedListener = (e) =>{

        if(location.pathname.length > 1) return // means there's a path (no only a forwardslash /), so page different thant index/home page, do nothing just return 
  /// Algolia autocomplete
        const placesApi = document.createElement('script')
        placesApi.textContent = ' const input = document.getElementById(\'destination\'), around=false, types=\'city\', placesAutocomplete = Client.autoCompleter(input, types, around) ' // appending Google places init script on the head to be Global
        placesApi.defer = true
        placesApi.async = true
        Client.appendTag(placesApi, document.head)
    },

    handleUserSession = async (e) => {

        e.preventDefault()

        const fetchAny = Client.fetchAny

        const inputs = document.getElementsByTagName('input')
        for (let input of inputs) {

            if (input.value !== '' && input.type !== 'reset' && input.type != 'submit') {

                placeHolder[input.name] = input.value
            }
        }

        try {

            options.body = JSON.stringify(placeHolder) // appending user to the body of the request

            const data = await fetchAny('http://localhost:3030/users/inner', options)

            // Using Client Library

            Client.addItem('user', data) // saving user locally
            Client.addItem('userId', data._id) // saving Id for trips bindings

        } catch (err) {

            console.log(err)
        }

    },

    handleEmailValidation = (e) => {


        //Creating a shortcuts/aliases for these functions to alleviate usage of invoking long functions' names


        const show = Client.show

        const hide = Client.hide

        const regex = /[a-z_.-]+@[a-z_.-]+\.[a-z]+/i, // email correct format regex  

            // pick sign in div error tag ou sign up one

            errElm = e.target.id == 'emailin' ? document.getElementById('errEmailIn') : document.getElementById('errEmail')

        if (!regex.exec(e.target.value)) { // email not well formatted 

            show(errElm)

        } else {

            hide(errElm)
        }


    },

    handlePasswordsValidation = (e) => { // a Strong password must contain the following

        //Creating a shortcuts/aliases for these functions to alleviate usage of invoking long functions' names


        const show = Client.show

        const hide = Client.hide

        const rMin = /[a-z]+/, // miniscules checker
            rMaj = /[A-Z]+/, // Majs checker
            rNum = /[0-9]+/, // numbers checker
            rSpec = /[&ù\*!\:"';?{}\[\]\(\)~#%@\+-\/\\\x20$µ£<>¨\^§=_.-]+/ // special chars checker | space accepted as special : \x20 space hex code

        let errMsg = '&times; Weak PWD. USE: ',
            err = false

        const errPwd = document.getElementById('errPwd'),
            strongPwd = document.getElementById('strongPwd'),
            errConf = document.getElementById('errConf')

        if (e.target.value.length < 8) { // no short passwords accepted
            errMsg += '- num of ch < 8'
            err = true
        }
        if (!rMin.exec(e.target.value)) {

            errMsg += '- minus chars';
            err = true
        }

        if (!rMaj.exec(e.target.value)) {
            errMsg += '- Majs '
            err = true
        }


        if (!rNum.exec(e.target.value)) {
            errMsg += '- Numbers '
            err = true
        }


        if (!rSpec.exec(e.target.value)) {
            errMsg += '- Specials '
            err = true
        }

        const pwd = document.getElementById('password')

        if (e.target.value !== pwd.value) {


            show(errConf)

            err = false // ignore password input when we're on confirmation password

        } else {

            hide(errConf)
        }

        if (err) { // there's an error in creating STRONG Password 


            errPwd.textContent = errMsg

            show(errPwd)
            hide(strongPwd)

        } else if (e.target.id !== 'confirm') {

            hide(errPwd)
            show(strongPwd)
        }

    },
// using https://www.npmjs.com/package/js-datepicker

handleDate = (e) => { // id (number) to link datepickers and it's position

    const id = Client.getRndInteger(1, 100)
    const start = Client.dtPicker('#start-date', new Date(), id, 'bl')
    const end = Client.dtPicker('#end-date', new Date(), id, 'bl')


},


    handleShowHideDynamicForms = e => {
         
        let forms = document.querySelectorAll('div[id^="form"]'), // form-add*** ids

            idx = 0
       

       for (;idx <forms.length; ){
          
        if(Client.hasClassName(forms[idx], 'd-block')) { // only if form has d-block className (visible display:block) 
           

            // check if the clicked target resides within the form, otherwise hide it

            if (forms[idx].contains(e.target) || Client.hasClassName(e.target, 'qs')) { // choosing date picker hides form,
                // so added this condition of checking for qs in className (part of it)


            } else {

                Client.hide(forms[idx])
                forms[idx].removeEventListener('mouseover', Client.handleDate)
            }


            
         }  
          idx++
       
       }


        let formId = '',
            
            formParent =''


        const id = e.target.id  // get the Id of clicked element

        if(!id) return // no id is present return, do nothing to avoid errors calling function on null id/undefined

       if(id.indexOf('trip') > -1){ // trying to get parent of  clicked img (add-something-) then append corresponding form  to parent

           formId = 'form-add-trip'
           
           formParent = 'trip-card-link'
           

       } else if (id.indexOf('dest') > -1){

           formId = 'form-add-dest'
           formParent = 'trip-card-'

       } else if (id.indexOf('place') > -1) {

           formId = 'form-add-place'
           formParent = 'd-card-' 

       } else if (id.indexOf('pack') > -1) {

           formId = 'form-add-pack'
           formParent = 'd-card-'


       }

       if(!formId) return  // empty formId no need to do something, return
        
         const form = document.getElementById(formId)

        
        if(!form) return // nothing if we're not in trips page
   

        if( id.indexOf('add') > -1  || id.indexOf('delete') >-1 || id.indexOf('edit') > -1 || id.indexOf('print') > -1) {    
            
            const splitedId = id.split('-')

            let idVal = splitedId[splitedId.length - 1]

            idVal =  !isNaN(parseInt(idVal)) ? idVal:  ''; // in case idVal isn't an Integer,  assign empty string to (add-trip-link id case above)
            
            Client.show(form)

            Client.attachEvent(form, 'mouseover', Client.handleDate, { once: true })

            const parent = document.getElementById(formParent + idVal) || Client.getParentOfChild(e.target, 'section')


            Client.appendTag(form, parent)


            const input = form.querySelector('#dest') || form.querySelector('#destination') || form.querySelector('#place')
            let types = 'city',
                around = false,     // only cities will be returned in that autoCompleter if false, otherwise true nearby places will be returned
                aroundLatLng = '' // in case of places we need to perform search nearby some coordinates (Latitude, Longitude)
            
            if (input && input.id == 'place') {

                types = ['address', 'busStop', 'trainStation', 'townhall', 'airport']

                around = true

                const parent = Client.getParentOfChild(input, 'd-card')

                aroundLatLng = `${parent.getAttribute('data-d-db-lat')},${parent.getAttribute('data-d-db-lng')}`

            } // otherwise default values (specified above) will apply for types, around 


            // apply values to autoCompleter from Algolia
            
            if(!!input) { // input of type is defined (that need autocomplete (tasks' form desn't))
         
                const autoCompleter = Client.autoCompleter(input, types, around)
                if (around) autoCompleter.configure({ aroundLatLng: aroundLatLng, aroundLatLngViaIP: false })
        }
            // reconfigure autocompleter with coordinates to seach around 
        
             
            
       
          

        }

      
   

    },

    addTripDynamicCode = async (e) =>{

        e.preventDefault()

        try {
     
            const trips = await Client.fetchAny('http://localhost:3030/trips/userId/' + Client.getItem('userId'), { headers: new Headers({ 'X-Custom-Resp-Type': 'json' }) })

            const idx = trips.length + 1 // used to create unique ids of created trips, dests...

         
                const trip = await handleFormSubmission(e)
                
                console.log(trip)
                
                // number of destinations of all trips of this user (displayed) + 1 (new to be added)
                let idx_d = document.getElementsByClassName('d-card').length + 1
               
                  


                if(e.target.id == 'input-trip') { // new trip added

                    const html = Client.tripHTMLCodeToAppend(trip, idx, idx_d)


                    const tripContainer = document.getElementById('dynamic-trips-container')

                    tripContainer.insertAdjacentHTML('afterbegin', html)

                    const tripTag = document.getElementById('trip-card-' + idx) // last added 
                    const destTag = document.getElementById('d-card-'+ idx_d)

                    showHideAccordion(destTag.parentNode) // here this is used as function rather than event listener

                    Client.addClassWithTimeout(tripTag, 'bg-green', 15000) // add class bg-green remove it after 15sec  
                    Client.addClassWithTimeout(destTag, 'bg-green', 15000) // add class bg-green remove it after 15sec

                    const coors = Client.getElmRect(tripTag) //

                    window.scroll(0, coors.top) // scroll to the new added element
                    Client.handleFormError(e.target)

               
                } else { // new destination added of an existing trip


                    html = Client.destHTMLCodeToAppend(trip.destinations[trip.destinations.length - 1], idx_d) // the last added
                    const  inputDest = document.getElementById('input-dest')
                     
                    console.log('html', html)
                    const parentAccordion = Client.getParentOfChild(inputDest, 'accordion') 

                    console.log(parentAccordion)
                    
                    parentAccordion.firstElementChild.insertAdjacentHTML('afterend', html)

                    showHideAccordion(parentAccordion)
                    Client.addClassWithTimeout(parentAccordion.firstElementChild.nextElementSibling, 'bg-green', 15000) // add class bg-green remove it after 15sec
                }


               

     
            } catch (err) {
            
                Client.handleFormError(e.target, err)
            }
                
    },

    showHideAccordion = (e) => {  // function used as event listener and a normal function to show and hide accordion

        const el = e.target || e  // if e.target undefined, means a tag is passed instead of event
        const pNode = Client.getParentOfChild(el, 'form') // get parent abd check if it's a form =>

        if (el.nodeName.toLowerCase() == 'img'  || pNode && pNode.nodeName.toLowerCase() == 'form')  return // if link images clicked or showed dynamic form
                                                                                                                                              // do nothing, return  
        const current = Client.getParentOfChild(el, 'trip-card')
        const nxtSibl = current.nextElementSibling // we pass className in this case to figure out the nextsibling and show it
     
        if(Client.hasClassName(nxtSibl, 'accordion') ) {

            nxtSibl.style.maxHeight = nxtSibl.scrollHeight +'px' 
            nxtSibl.classList.add('active') // show nextsibling of clicked trip-card element
            current.classList.add('active') // added to change + sign to - sign in the clicked element with trip-card className
        }

        const accs = document.getElementsByClassName('accordion')

        const trips = document.getElementsByClassName('trip-card')

        for(let idx = 0; idx < accs.length; idx++) {

            if(Client.hasClassName(accs[idx], 'active') && !accs[idx].isSameNode(nxtSibl)){ // remove active className and hide other accordions 

                accs[idx].classList.remove('active') 
                accs[idx].style.maxHeight = 0
            }
        }

        for (let idx = 0; idx < trips.length; idx++) {

            if (Client.hasClassName(trips[idx], 'active') && !trips[idx].isSameNode(current)) {

                trips[idx].classList.remove('active') // remove + sign from others if they have it
         
            }
        }
    },

    deleteEventListener = async (e) => {

        const t = e.target // t for target (not trip), this is a multipurpose event listener! applied to elements with id = 'delete*****'
       


        let res = null,
            url = null,
            notif = true // notify before delete

        // for some reason this is added to not a delete link!!! (security measure!)
        // then do nothing, just exit
        if(t.id.indexOf('delete') <= -1) return 
       

        options.method = 'delete' // deleting element from Mongo DB

        if(t.id.indexOf('trip') > -1) {

         
            url = `/trips/${t.getAttribute('data-delete-d-info')}`

            res = 'trip delete: '
        

        } else if (t.id.indexOf('dest')) {


            url = `/del/destination/${t.getAttribute('data-delete-p-info')}`
            res = 'destination delete: '
        
        
        } else if (t.id.indexOf('place')) {
            
           
            url = `/del/place/${t.getAttribute('data-delete-p-info')}`
            res = 'place delete: '

        } else if (t.id.indexOf('pack')){

         
            url = `/del/pack/${t.getAttribute('data-delete-p-info')}`
            res = 'list item delete: '
        } 


     

        if( !!res && !!url) {

          // section parent, trip card as parent , or a destination card as parent 

            const parent = Client.getParentOfChild(e.target, 'section') || Client.getParentOfChild(e.target, 'trip-card') || Client.getParentOfChild(e.target, 'd-card')
         
        

              const result = parent.getElementsByClassName('result')[0]
              const error = parent.getElementsByClassName('error')[0]

              Client.handErrors(error, {clear: true}) // clear any found error element
              
              // show by changing 'd-none' with 'ongoing' className
            
              Client.show(result, 'ongoing') 
             
              result.innerHTML = '<p class="d-flex align-items-center"><span>Processing...<span><img src="media/wrench.svg"></p>'
            
              res += await fetchAny(url, options)
              
              Client.hide(result, 'ongoing') // change ongoing with d-none again
              result.textContent = res
              // then replace d-none with 'success' className
              Client.show(result, 'success')

              // time 'success' className out

              Client.addClassWithTimeout(result, 'success', 10000) // 10 secs

              // hide element again 

              Client.hide(result, 'success') // 'success' => d-none
           
          
        } else {



            Client.handleErrors(result)
                         

        }
    
    }

export {
    handleFormSubmission,
    handleDate,
    documentLoadedListener,
    windowLoadedListener,
    handleTabsSwitching,
    handleUserSession,
    handleEmailValidation,
    handlePasswordsValidation,
    handleShowHideDynamicForms,
    addTripDynamicCode,
    showHideAccordion,
    handleAddPlacesTasksForm,
    deleteEventListener
}