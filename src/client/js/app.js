// http://www.geonames.org/export/geonames-search.html 


// all vars defined here will be in closure, available for all the function defined in this module

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
    },

    notif = true

const weatherBitKey = '13937474fc8343809b612f4ebdc9c032',

    pixaKey = '9323775-fe8ad975fc3aebdc3d5c7875e',
    
    mapQuestKey = 'EhXrrif01m99VvAA1KgJldZQPmLGRr2r',

    geoUrl = 'http://api.geonames.org/searchJSON?q=&username=senyur',

    weatherBitHistUrl = 'https://api.weatherbit.io/v2.0/history/daily?lat=&lon=&start_date=&end_date=&key=', // for future weather forecast

    weatherBitCurUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=&lon=&key=', // for 7 days forecast

    pixaUrl = 'https://pixabay.com/api/?key=&q=&safesearch=true&image_type=photo&order=popular',

    restCountriesUrl = 'https://restcountries.eu/rest/v2/name/',

    mapQuestUrl = 'http://open.mapquestapi.com/geocoding/v1/address?key=&location=',


    handleFormSubmission = async (event) => { //using Async to have acess to await, try, catch

        event.preventDefault()
        
        const destination = document.getElementById('destination').value || document.getElementById('dest').value
         // trip form or destination form (only one field)
      

        const form = Client.getParentOfChild(event.target, 'form')  // get form parent of clicked submit input

        const tripCard = Client.getParentOfChild(form, 'trip-card') // get parent of the form for which submit is clicked

        const dates = tripCard && tripCard.getElementsByTagName('time') // destined to be used in destination form as following
        const startTag = document.getElementById('start-date')
        const endTag = document.getElementById('end-date')
        // handling trip form inputs ||  destination form inputs
        const start = startTag.value  || dates && dates[0].textContent // start date in case value is null because not present in form
        const end = endTag.value      || dates && dates [1].textContent  // end date in case value is null 

        const overlay = form.getElementsByClassName('overlay')[0] // overlay position absolute to cover the form
        

        Client.show(overlay)

    
        try {

            const inputDestParent = Client.getParentOfChild(document.getElementById('input-dest'), 'trip-card')

            const parent = Client.getParentOfChild(form, 'd-card') || Client.getParentOfChild(form, 'trip-card') || document.getElementsByClassName('result')[0].parentNode

            const result = parent.getElementsByClassName('result')[0]
            // form is inside a trip-card (means called by a trip to add dest)
            // otherwise inputDestParent is null => tripId == null   (new trip)

            const tripId = inputDestParent && inputDestParent.getAttribute('data-trip-id-db-info') 


            // al least one input is empty
            if((!!tripId && !destination) || !tripId &&  (!start || !end || !location)) throw new Error('inputs shouldn\'t be empty (please fill them all)') 

            if(!Client.getItem('userId')) throw new Error('Please sign in!') // no user session yet
            
            dataHolder = {} // reinit dataHolder

            const geo = await Client.geonamesAPICall(geoUrl, destination)
            dataHolder.geo = {}
            dataHolder.geo.lat = geo.lat
            dataHolder.geo.lng = geo.lng

            dataHolder.countryInfo = await Client.restCountriesAPICall(restCountriesUrl, geo.name) // rest countries API

            dataHolder.pixa = await Client.pixaAPICall(pixaUrl, pixaKey, destination, geo.name) // fetching pixabay.com

            dataHolder.weather = await Client.weatherbitAPICall(weatherBitCurUrl, weatherBitHistUrl, weatherBitKey, start, geo.lng, geo.lat) // fetching weatherbit
            

            dataHolder.countryInfo.timezone = dataHolder.weather[0].timezone

        
            options.body = JSON.stringify({

                title: destination,

                description: `Trip to ${destination} starting from ${start} and ending in ${end}`, // default could be updated later on by the owner end user

                startDate: start,

                endDate: end,

                countryInfo: dataHolder.countryInfo,

                pixaInfo: dataHolder.pixa,

                weatherInfo: dataHolder.weather,

                geo: dataHolder.geo,

                userId: Client.getItem('userId') ,// parse userId store locally of the connected user,
                
                tripId: tripId

            })
     
            options.method = 'POST'  // to prevent options methode set to DELETE if previous deletion 

            
            // show overlay while waiting for some results from the server
 
              Client.show(overlay)

             // pushing trip data to the node server, which will push them to Mongo DB Atlas using Mongoose

       
              const dataN = await Client.fetchAny('http://localhost:3030/trips/add', options)            
            
              if(dataN.err) throw new Error('something went wrong') // some error message is sent from server side!

                    

                Client.handleErrors(result, { msg: !!tripId ? '&#x2714; destination added: Success!' : '&#x2714; trip added: success',
                                              className : 'alert-success'}) // used to display results messsages instead of errors here!
              
                Client.addClassWithTimeout(result, 'alert-success', 10000) // 10secs to remove className and hide in following line of code 

                Client.hide(result)

                // used to hide overlay, and any error message
                // form will be hidde, or not depends on calling link, details in js/helpers.handleFormError
                Client.handleFormError(event.target, false)
            
                // redirect in case we're in the index/home page
                
             
            if(location.pathname.length == 1) {  

                location.pathname = '/trips/userId/'+Client.getItem('userId')
            }
           
            return dataN

        } catch (err) {
                console.log(err)

                Client.handleFormError(event.target, err)
                 

        }


    },
    
 

    handleTabsSwitching = (e) => { 
        
        // scallable function to display and hide tabs content, highlight active tab
        // use tab and tab-content
        // use your names, but make sure that everything is matching between function and html


        e.target && e.preventDefault() // e.target defined means it's an evenet tlisterner

        // aliases for Lib Client functions in js folder

    const hide = Client.hide,
          show = Client.show

    const tab = e.target || e // in case a tag is passed instead of an event (function could be used as normal function not event listener)

    const id = tab.getAttribute('data-tab-id')
    
    const tabContent = document.getElementById(id)

    const tabsContentAdjs = Client.getAdjacentNodes(tabContent) // get all siblings of tabContent except itself

    const tabsAdjs = Client.getAdjacentNodes(tab) // siblings of tab (same parent) except element passed as argument

    tabsAdjs.forEach( el => el.classList.remove('active')) // removing active for other tabs

    tabsContentAdjs.forEach(el => hide(el)) // hiding siblings

        show(tabContent)


        const dCard = document.getElementById(`d-card-${id.split('-')[2]}`)

        dCard && Client.scrollToElement(dCard)// scroll the d-card if defined
        
        tab.classList.add('active')
    
     
    },

    handleAddPlacesTasksForm = async (e) => {

        e.preventDefault()// preventing any default behaviour, do following instead

        const parentDestCard = Client.getParentOfChild(e.target, 'd-card'),

              parentForm = Client.getParentOfChild(e.target, 'form'),

              dataDestId = parentDestCard.getAttribute('data-d-db-id')

        dataHolder = {} // reinit dataHolder
        dataHolder.destId = dataDestId // setting task/place's destination _id

        dataHolder.userId = Client.getItem('userId')

        // set place/type  if it's a  add place click 
        // type from Algolia API (busStop, trainSation, address....)
        if (e.target.id.indexOf('place') > -1) {

            const val = document.getElementById('place').value.split('|')
            dataHolder.type = val[1]
            dataHolder.place = val[0]
            dataHolder.userId = Client.getItem('userId')

        } else if (e.target.id.indexOf('pack') > -1) {

            dataHolder.pack = document.getElementById('pack').value // else add add a task in the list /todo list
            dataHolder.userId = Client.getItem('userId')
        }

        if (dataHolder.place || dataHolder.pack) { // if pack or place is defined, else nothing!

            const overlay = parentForm.getElementsByClassName('overlay')[0]
            const error = parentForm.getElementsByClassName('form-error')[0]
            Client.show(overlay)
            Client.hide(error)



            try {

                options.body = JSON.stringify({

                    ...dataHolder // spreading Object, ES6 Syntax!


                })

                options.method = 'POST'
                
                const pData = await Client.fetchAny(`/places-packs/add/`, options) // adding data to the destination referenced by dataDestId

                if (pData.errors) throw new Error(pData.message)

                Client.hide(overlay)

                let tab = null
              
                const tabs = parentDestCard.getElementsByClassName('tab')

                if(pData.places){

                    const ul = parentDestCard.getElementsByTagName('ul')[0]
                    
                    const idx = document.getElementsByTagName('li').length + 1 // to make ids of li unique

                    ul.insertAdjacentHTML('beforeend', Client.placeOrTaskHTMLCode(pData , idx)) // last element only will be used
                    
                    tab = tabs[2]
                    Client.attachEvent(ul.lastElementChild, 'click', deleteEventListener)

                } else {

                    const table = parentDestCard.getElementsByTagName('table')[0] 
                      
                    const idx = document.getElementsByTagName('tr').length + 1// tr unique ids!

                    table.lastElementChild.insertAdjacentHTML('beforeend', Client.placeOrTaskHTMLCode(pData, idx)) // tbody (lastElementChild)
                   
                    tab = tabs[3]
                    Client.attachEvent(table.lastElementChild.lastElementChild, 'click', deleteEventListener)
                }
                
               
                handleTabsSwitching(tab) // faking a tab click

                Client.handleFormError(e.target, false) // clean any form and any errors, hide form

            } catch (err) {

                error.textContent = err.message || 'something went wrong' // reason of error sent from server
                Client.hide(overlay)
                Client.handleFormError(e.target, err)

            }
        } else return // nothing set, do nothing
    },

    documentLoadedListener = (e) => {

        // aliases creations for Client library variables

        const appendTag = Client.appendTag,
            Glib = Client.Glib,
            Places = Client.Places


        appendTag(Glib.meta, document.head)
        appendTag(Glib.script, document.head)

        const onSignInScript = document.createElement('script')
        onSignInScript.textContent = 'function onSignIn(googleUser){ Client.onSignIn(googleUser)};' // appending Google auth script on the head to be Global
        // onSignIn function should be global
        appendTag(onSignInScript, document.head)



        appendTag(Places.script, document.head)

        
        const base = document.createElement('base') // creating and  // ading base  tag dynamically base on the location.href

        base.href = location.href

        appendTag(base, document.head)

        Client.handleSession() // check if user is connected then show links, hide connection/registering forms, 
                               // otherwise hide links, show forms
    },

    windowLoadedListener = (e) => {

       
         // means there's a path (not only a forwardslash /), so page different thant index/home page, do nothing just return 
        /// Algolia autocomplete
        if(location.pathname.length > 1) return 
        const placesApi = document.createElement('script')
        placesApi.textContent = ' const input = document.getElementById(\'destination\'), around=false, types=\'city\', placesAutocomplete = Client.autoCompleter(input, types, around) ' // appending Google places init script on the head to be Global
        placesApi.defer = true
        placesApi.async = true
        Client.appendTag(placesApi, document.head)

        

    },

    handleUserSession = async (e) => {

        e.preventDefault()

        const fetchAny = Client.fetchAny


        try {

            const form = Client.getParentOfChild(e.target, 'tab-content')

            const overlay = form.getElementsByClassName('overlay')[0]

            Client.show(overlay)

            const inputs = form.getElementsByTagName('input')
       
            
            Client.inputValidator(inputs) // validate required inputs (inputs with attr required == true)

            for (let input of inputs) {

                input.type == 'text' && Client.isInputText(input) // validate text inputs, should contain legal chars only

                if (input.value !== '' && input.type !== 'reset' && input.type != 'submit') {

                    placeHolder[input.name] = input.value // placeHolder refers to connected user/ or trying to connect             }

                }
            }
          

            options.body = JSON.stringify(placeHolder) // appending user to the body of the request

            const data = await fetchAny('http://localhost:3030/users/inner', options)
            
            if(data.hasOwnProperty('err')) throw new Error(data.err)

          

            Client.hide(overlay)

          

            // Using Client Library
            
            Client.clearAll() // clean any user in sessionStorage

            Client.addItem('user', data) // saving user locally
            Client.addItem('userId', data._id) // saving Id for trips bindings

            Client.handleSession() // removing article tag containing forms if success connection // adding required links

            Client.scrollToElement(document.getElementById('search-link'))

            Client.handleFormError(e.target, false) // erase any previous errors


      } catch (err) {

           console.log(err)
              
            Client.handleFormError(e.target, err)

            Client.hide( Client.getParentOfChild(e.target, 'form').getElementsByClassName('overlay')[0])
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
         
        if(e.target.id.indexOf('print') > - 1) return // print is clicked!

        let forms = document.querySelectorAll('div[id^="form"]'), // form-add*** ids

            idx = 0
       

       for (;idx <forms.length; ) {
          
        if(Client.hasClassName(forms[idx], 'd-block')) { // only if form has d-block className (visible display:block) 
           

            // check if the clicked target resides within the form, otherwise hide it

            // choosing date picker hides form,
            // so added this condition of checking for qs in className (part of it)
            
            if (forms[idx].contains(e.target) || Client.hasClassName(e.target, 'qs')) { 


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
   

        if( id.indexOf('add') > -1  || id.indexOf('edit') > -1 || id.indexOf('print') > -1) {    
            
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

    addTripDynamicCode = async (e) => {

       e.preventDefault() 
        try {
     
            const trips = await Client.fetchAny('http://localhost:3030/trips/userId/' + Client.getItem('userId'), { headers: new Headers({ 'X-Custom-Resp-Type': 'json' }) })

            const idx = trips.length + 1 // used to create unique ids of created trips, dests...

         
                const trip = await handleFormSubmission(e)
       
                // number of destinations of all trips of this user (displayed) + 1 (new to be added)
                let idx_d = document.getElementsByClassName('d-card').length + 1
               


                if(e.target.id == 'input-trip') { // new trip added
                     
               
                    const html = Client.tripHTMLCodeToAppend(trip, idx, idx_d)


                    const tripContainer = document.getElementById('dynamic-trips-container')

                    const tripsNum = document.getElementsByClassName('trip-card').length
                  
                    if(tripsNum > 0) { // trips already there
                       
                        tripContainer.insertAdjacentHTML('afterbegin', html)

                    } else { // no trips, this is the first one! so replace all, so that we delete the default message!

                        tripContainer.innerHTML = html
                    }
                    
                    // add showHideAccordion event listener to newly created trip

                    Client.attachEvent(tripContainer.firstElementChild, 'click', showHideAccordion)

                    // adding event listener  to newly added delete links of trip, destination
              
                    const delLinks = tripContainer.firstElementChild.querySelectorAll('img[id^="delete"]')

                    Client.attachEvent(delLinks, 'click', deleteEventListener)

                    const tripTag = document.getElementById('trip-card-' + idx) // last added 
                    const destTag = document.getElementById('d-card-'+ idx_d)
                 
                    // added tabSwitching events to tabs of newly created destination
                    Client.attachEvent(destTag.getElementsByClassName('tab'), 'click', handleTabsSwitching)
                    // here this is used as function rather than event listener
                    // just to trick this function, passed in firstElementCHild of trip card,
                    // as getParentOfChild will seach for trip-card as parent,
                    // to show its nextElementSibling (accordion)
                    
                    showHideAccordion(tripTag.firstElementChild)

                    // add print eventListener to destination

                    const printLinks = destTag.querySelectorAll('img[id^="print"]') // all images that their ids start with delete

                    Client.attachEvent(printLinks, 'click', handlePrintToPdf)


                    Client.addClassWithTimeout(tripTag, 'bg-green', 15000) // add class bg-green remove it after 15sec  
                    Client.addClassWithTimeout(destTag, 'bg-green', 15000) // add class bg-green remove it after 15sec
                    
                    // The function calculate the top coordinate of the element in the document(not window) 
                    // then scroll the document to

                    Client.scrollToElement(tripTag) 
                    Client.handleFormError(e.target)

               
                } else { // new destination added of an existing trip


                    const html = Client.destHTMLCodeToAppend(trip.destinations[trip.destinations.length - 1], idx_d, trip._id) // the last added
                   
                    const  inputDest = document.getElementById('input-dest')
                     
                    const parentTripCard = Client.getParentOfChild(inputDest, 'trip-card') 


                    //  so add the element of h5 header (destinations)

                    const h5Tag = parentTripCard.nextElementSibling.firstElementChild
                     
                    h5Tag.insertAdjacentHTML('afterend', html)

                    
                    // adding event listener  to newly added delete links of destination

                    const delLinks = h5Tag.nextElementSibling.querySelectorAll('img[id^="delete"]')


                    // added tabSwitching events to tabs of newly created destination
                    Client.attachEvent(h5Tag.nextElementSibling.getElementsByClassName('tab'), 'click', handleTabsSwitching)

                    Client.attachEvent(delLinks, 'click', deleteEventListener)

                    // add print eventListener to destination

                    const printLinks = h5Tag.nextElementSibling.querySelectorAll('img[id^="print"]') // all images that their ids start with delete

                    Client.attachEvent(printLinks, 'click', handlePrintToPdf)

                    showHideAccordion(parentTripCard.firstElementChild)

                    // new destination is the nextsibling of h5 header

                    const newDestination = h5Tag.nextElementSibling
                   
                    Client.addClassWithTimeout(newDestination, 'bg-green', 15000) // add class bg-green remove it after 15sec
                   
                    Client.scrollToElement(newDestination)
                }


               

     
            } catch (err) {
            
                Client.handleFormError(e.target, err)
            }
                
    },

    showHideAccordion = (e) => {  // function used as event listener and a normal function to show and hide accordion
     e.target &&  e.preventDefault() // only execute in case of event call

     // do nothing of following if a cancel pr proceed links are clicked

    if(e.target && e.target.id && (e.target.id.indexOf('proceed') > -1 || e.target.id.indexOf('cancel') > -1 ))  return 


        const el = e.target || e  // if e.target undefined, means a tag is passed instead of event
       
   
       
        const pNode = Client.getParentOfChild(el, 'form') // get parent and check if it's a form =>
        
        // if link images clicked or showed dynamic form,  do nothing, return  
        if (el.nodeName.toLowerCase() == 'img'  || pNode && pNode.nodeName.toLowerCase() == 'form')  return 
      
        // we pass className in this case to figure out the nextsibling and show it
        const current = Client.getParentOfChild(el, 'trip-card')
             
        
        // already active, same node clicked again!
        // to prevent a bizarre behaviour of distancing following trips deep in the document
        // so just return , do nothing

        const nxtSibl = current.nextElementSibling

    if(Client.hasClassName(nxtSibl, 'active')) return
       
        if(Client.hasClassName(nxtSibl, 'accordion') ) {

            nxtSibl.style.maxHeight = nxtSibl.scrollHeight +60+'px' 
            nxtSibl.style.height = nxtSibl.scrollHeight +60+'px' 
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

        e.preventDefault()

        const t = e.target // t for target (not trip), this is a multipurpose event listener! applied to elements with id = 'delete*****'
        
        let res = null,
            url = null

        // section parent, trip card as parent , or a destination card as parent 
        const parent = Client.getParentOfChild(e.target, 'd-card') || Client.getParentOfChild(e.target, 'trip-card') || Client.getParentOfChild(e.target, 'section') 

        const result = parent.getElementsByClassName('result')[0]
      
        const previousAlert = document.getElementsByClassName('alert-danger')

        // for some reason this is added to not a delete link!!! (security measure!)
        // then do nothing, just exit
        if (t.id.indexOf('delete') <= -1 || t.id.indexOf('cancel') > -1) {

            Client.hide(result, 'alert-danger')          // className => d-none! 

            notif = true

            return // do nothing, just return 
        }

        
        if(previousAlert.length > 0 && !notif && e.target.id.indexOf('proceed') <= -1) { // already shown delete alert, hide =>

                Client.hide(previousAlert[0], 'alert-danger')
               
                notif = true // 
        }

        if(notif) { // notify before delete
                 
             Client.show(result, 'alert-danger') // showit with alert-danger Bootstrap's className
             
             Client.scrollToElement(result) // scroll to element result!
             // &#x26A0; warning sign
            result.innerHTML = `<span>&#x26A0; DANGER: this will delete document from DATABASE</span><a href="#" id="proceed-${t.id}" class="${t.id}">proceed</a> <a href="#" id="cancel-${t.id}" class="${t.id}">Cancel</a>`
           

            const tempLinks = result.getElementsByClassName(t.id)


            tempLinks[0].setAttribute(Client.dataAttrName(t), t.getAttribute(Client.dataAttrName(t)))

            // attach event listener to newly added elemets

            Client.attachEvent(tempLinks,'click', deleteEventListener)

            notif = false
          
            return // do nothing, just return 
        }
  

        options.method = 'DELETE' // delete method, delete handle in expres , deleting element from Mongo DB
        try {
            
        } catch (err) {
            
        }
        if(t.id.indexOf('trip') > -1) {

         
            url = `/trip/delete/${Client.getItem('userId')}/tripId/${t.getAttribute('data-delete-trip-info')}`

            res = 'trip delete: '
        

        } else if (t.id.indexOf('dest') > -1) {


            url = `/destination/delete/${Client.getItem('userId')}/destId/${t.getAttribute('data-delete-d-info')}`
            res = 'destination delete: '
        
        
        } else if (t.id.indexOf('place') > -1) {
            
            url = `/places-packs/delete/${Client.getItem('userId')}/place/${t.getAttribute('data-delete-p-info')}`
            res = 'place delete: '

        } else if (t.id.indexOf('pack') > -1) {

         
            url = `/places-packs/delete/${Client.getItem('userId')}/pack/${t.getAttribute('data-delete-p-info')}`
            res = 'list item delete: '
        } 

         try {

             if (!!res && !!url) {



                 Client.handleErrors(result, { className: 'alert-primary' }) // clear any found error element

                 // show by changing 'd-none' with 'ongoing' className

                 result.innerHTML = '<p class="d-flex align-items-center"><span>Processing...<span><img src="media/gear-loader.gif"></p>'

                 const data = await Client.fetchAny(url, options)

                 if (data.err) throw new Error(res + data.err)

                 if (data.type == 'dest') {

                     const adjs = Client.getAdjacentNodes(parent) // getting to adjs of parent of t node


                     // Only one element (the element itself), add the default message!
                     // getAdjacentNodes, returns adjacents of element except itself!

                     if (adjs.length == 1) {

                         parent.parentNode.insertAdjacentHTML('beforeend', '<div class="default">Destinations space too clean, create some </div >')
                     }

                     parent.remove() // delete DOM node, parent of clicked link!

                 } else if (data.type == 'trip') {

                     const numtrips = document.getElementsByClassName('trip-card').length

                     // only on trip element, so add the default message
                     if (numtrips == 1) {

                         parent.parentNode.insertAdjacentHTML('afterbegin', '<div class="container d-flex align-items-center default"> Too Clean space, create some trips </div>')
                     }
                     parent.nextElementSibling.remove() // accordion containing trip's destinations

                     parent.remove() // delete DOM node, parent of clicked link!

                 } else {

                     const pp = Client.getParentOfChild(document.getElementById(e.target.className), 'li') || Client.getParentOfChild(document.getElementById(e.target.className), 'tr') // remove place or task
                    
                    console.log(pp)
                    pp.remove()
                 }
                 result.textContent = data.del + ' &#x2714;' // check sign hex

                 Client.hide(result, 'alert-primary') // change processing with d-none again


                 // then replace d-none with 'success' className
                 Client.show(result, 'alert-success')

                 // time 'success' className out
                 Client.addClassWithTimeout(result, 'alert-success', 10000) // 10 secs

                 // hide element again 
                 Client.hide(result, 'alert-success') // 'success' => d-none

                 notif = true

             } else {

                 Client.handleErrors(result) // put back any default settings

                 notif = true
             }
         } catch (err) {
             
            Client.handleErrors(result, {msg: err.message, className:'alert-danger'})
         }
    
    },

// https://leafletjs.com/reference-1.7.1.html#map-conversion-methods

// https://community.algolia.com/places/examples.html
    
 handleMapMarkers = (e) => {


         e.preventDefault()
         const t = e.target
         Client.handleOnClear()
        
        const d = Client.getParentOfChild(t, 'd-card')
        const places =  d.getElementsByTagName('ul')[0]

         console.log('dataset', t.dataset.map)

       const map = Client.initMap({lat:d.dataset.dDbLat, lng: d.dataset.dDbLng}, t.dataset.map )

        places.childNodes.forEach(async el => {
                
                if(el.nodeName.toLowerCase() == 'li') {
                    
                
                const  latLng = await Client.mapQuestCall(mapQuestUrl, mapQuestKey, el.dataset.pItem)

                console.log(latLng)
                
                Client.addMarker(latLng, map).bindPopup(el.dataset.pItem).openPopup()
                    

                }
            
        });

   
    
    },


  // will print a single destination or an entire trip with its destinations

  handlePrintToPdf = async (e) => { 
        
      e.preventDefault() // prevent anchor link default behaviour

       let htmlStr = ''
        
       // clicked link is for a destination or an entire trip (p var for parent)

       const p = Client.getParentOfChild(e.target, 'd-card') || Client.getParentOfChild(e.target, 'trip-card') 


       if (p.classList.contains('d-card')) {

           htmlStr = Client.formatForPrinting(p)
      
    } else {

        const   acc = p.nextElementSibling // accordion
        const   nodes = acc.childNodes     // accordion child nodes

        htmlStr += p.innerHTML  + acc.firstElementChild.innerHTML // trip html + first element h5 tag (destinations headline)
         
        for (let idx = 1; idx < nodes.length; idx++ ) { // skipping first element (0 => h5)

            if (nodes[idx].classList && nodes[idx].classList.contains('d-card')) { // skipping  #text, #comment... nodes
            
                htmlStr += Client.formatForPrinting(nodes[idx])
            }

        }

    }

    await Client.wrapInDocumentForPrint(htmlStr)
       

    },

    sessionHandler = async e => {
       
       
       e.preventDefault()
     
       
        if (e.target.alt == 'sign in/up'|| e.target.firstElementChild && e.target.firstElementChild.alt == 'sign in/up') {

            Client.scrollToElement(document.getElementById('forms'))
            
            return
        }
        if(!Client.getItem('userId')) return // no session to tear down
         
        const userId = Client.getItem('userId')
       
        options.body = JSON.stringify({userId})


        const res = await Client.fetchAny(`/user/logout`, options)
        
        if(res.hasOwnProperty('err') && res.err.indexOf('undefined') == -1) return // something went wrong, do nothing just leave! (if conditons)
        
        Client.signOut()
        Client.clearAll() // delete user session
         
        location.pathname = '/' // redirect to the home page
        
        Client.handleSession() // act consequently to deleting  local instance of user
        
       
    },

    userSpaceHandler = async e => {
    // clear user session from client side, if it's teared down from server side)

       e.preventDefault()
        const href = e.target.href ? e.target.href : e.target.firstElementChild.href

     // in case session is cleared (there's redirection from server side to home page)
        if(await Client.clearSession(href) ) {

        Client.handleSession() 

        Client.signOut()

        return
    }

    // reestablish default behaviour of link

    location.href = href
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
    sessionHandler,
    handleAddPlacesTasksForm,
    deleteEventListener, 
    handleMapMarkers,
    handlePrintToPdf,
    userSpaceHandler
}