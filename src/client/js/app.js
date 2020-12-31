// http://www.geonames.org/export/geonames-search.html 




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


        const location = document.getElementById('destination').value
        const start = document.getElementById('start-date').value
        const end = document.getElementById('end-date').value


        try {


            const geo = await Client.geonamesAPICall(geoUrl, location)

            dataHolder.countryInfo = await Client.restCountriesAPICall(restCountriesUrl, geo.name) // rest countries API

            dataHolder.pixa = await Client.pixaAPICall(pixaUrl, pixaKey, location, geo.name) // fetching pixabay.com

            dataHolder.weather = await Client.weatherbitAPICall(weatherBitCurUrl, weatherBitHistUrl, weatherBitKey, start, end, geo.lng, geo.lat) // fetching weatherbit

            dataHolder.countryInfo.timezone = dataHolder.weather[0].timezone


            options.body = JSON.stringify({

                title: location,

                description: `Trip to ${location} starting from ${start} and ending in ${end}`, // default could be updated later on by the owner end user

                startDate: start,

                endDate: end,

                countryInfo: dataHolder.countryInfo,

                pixaInfo: dataHolder.pixa,

                weatherInfo: dataHolder.weather,

                userId: Client.getItem('userId') // parse userId store locally of the connected user

            })


            const dataN = await Client.fetchAny('http://localhost:3030/trips', options) // pushing trip data to the node server, which will push them to Mongo DB Atlas using Mongoose

           

        } catch (err) {

            console.log(err)
        }


    },


    handleTabsSwitching = (e) => { // scallable function to display and hide tabs content, highlight active tab
        // use tabs with data-tab-id references ids of tabs content
        // use your names, but make sure that everything is matching between function and html

        // aliases for Lib Client functions in js folder

        const hasClassName = Client.hasClassName,
            hide = Client.hide,
            show = Client.show

        const tabsContent = document.getElementsByClassName('tab-content')

        let idx = 0

        for (; idx < tabsContent.length;) {

            const clickedTab = e.target

            const t = tabsContent[idx]

            if (t.id == clickedTab.getAttribute('data-tab-id')) {


                if (!hasClassName(clickedTab, 'active')) {

                    clickedTab.classList.add('active')

                    if (!hasClassName(t, 'd-block')) {

                        show(t)

                    }
                }

            } else {

                const sel = '[data-tab-id="' + t.id + '"]'
             
                const oTab = document.querySelector(sel) // other tabs, selected tabs not matching clicked 

                console.log(oTab)

                if (hasClassName(oTab, 'active')) { // tab activated (has class active)

                    oTab.classList.remove('active')


                    if (hasClassName(t, 'd-block')) { // element displayed (d-block bootstrap class)

                        hide(t)
                    }

                }


            }

            idx++
        }


    },

    documentLoadedListener = async (e) => {

        // aliases creations for Client library variables

        const appendTag = Client.appendTag,
            Glib = Client.Glib


        appendTag(Glib.meta, document.head)
        appendTag(Glib.script, document.head)

        const onSignInScript = document.createElement('script')
        onSignInScript.textContent = 'function onSignIn(googleUser){ Client.onSignIn(googleUser)}' // appending Google auth script on the head to be Global
        // onSignIn function should be global
        appendTag(onSignInScript, document.head)


        const base = document.createElement('base') // creating and  // ading base  tag dynamically base on the location.href

        base.href = location.href

        appendTag(base, document.head)

        const link1 = document.getElementsByClassName('item1')[0]

        link1.firstElementChild.href = `/trips/userId/${Client.getItem('userId')}`

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

            options.body = JSON.stringify(placeHolder)

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



    handleShowHideDynamicForms = e => {
        
        const id = e.target.id  // get the Id of clicked element

        const form = document.getElementById('form-add-trip')

        console.log(id.indexOf('add'))
        // which is clicked is not a link or doesn't have id, so do nothing leave!
        if(id && id.indexOf('add') > -1  || id.indexOf('delete') >-1 || id.indexOf('edit') > -1 || id.indexOf('print') > -1){    
            
            const splitedId = id.split('-')

            const idVal = splitedId[splitedId.length - 1]

            Client.show(form)

            const parentCard = document.getElementById('trip-card-' + idVal)

            Client.appendTag(form, parentCard)
            
            return 


        }

      
         // check if the clicked target resides

            if (form.contains(e.target)) {
              
            } else {

                Client.hide(form)
            }
        

    }

export {
    handleFormSubmission,
    documentLoadedListener,
    handleTabsSwitching,
    handleUserSession,
    handleEmailValidation,
    handlePasswordsValidation,
    handleShowHideDynamicForms
}