// http://www.geonames.org/export/geonames-search.html 



let placeHolder = { // place holder to contain info to send to the node js server
                    
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
    
    pixaUrl = 'https://pixabay.com/api/?key=&q=&safesearch=true&image_type=photo&order=popular',

 
 
    handleFormSubmission = async (event) =>{ //using Async to have acess to await, try, catch
  
    event.preventDefault()

    //Creating a shortcuts/aliases for these functions to alleviate usage of invoking long functions' names

   const findReplace = Client.findReplace 

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
   

},


// using https://www.npmjs.com/package/js-datepicker

 handleDate = () => {

  
    const start = Client.dtPicker('#start-date', new Date())
    const end = Client.dtPicker('#end-date', new Date())


},

handleTabsSwitching = (e) => {

    // aliases for Lib Client functions in js folder
    
         const hasClassName = Client.hasClassName,
               hide = Client.hide,
               show = Client.show
        // make sure that a div with signin or signup className is clicked, others do nothing

        if (!hasClassName(e.target, 'signin') && !hasClassName(e.target, 'signup')) return

        // if div with id clicked so hide and hide currently active tab, show the other => 
        const signupTab = document.getElementsByClassName('signup')[0] // sign up tab
        const signinTab = document.getElementsByClassName('signin')[0] // sign in tab

        const signupElm = document.getElementById('signup-with-email')
        const signinElm = document.getElementById('signin-with-email')

        if ((hasClassName(signupTab, 'active'))) { // signup tab is active, toggline between active and inactive

            signinTab.classList.add('active')
            signupTab.classList.remove('active')
            hide(signupElm)
            show(signinElm)
        } else if (hasClassName(signinTab, 'active')) {

            signinTab.classList.remove('active')
            signupTab.classList.add('active')
            show(signupElm)
            hide(signinElm)
        }

    },

    documentLoaderListener = async (e) => {
        
        // aliases creations for Client library variables

        const appendTag = Client.appendTag,
              Glib = Client.Glib
        

            appendTag(Glib.meta, document.head)
            appendTag(Glib.script, document.head)

            const onSignInScript = document.createElement('script')
            onSignInScript.textContent = 'function onSignIn(googleUser){ Client.onSignIn(googleUser)}'

            document.head.appendChild(onSignInScript)

        
    },

    handleUserCreation = async (e) => { 

        e.preventDefault()
       
        const fetchAny = Client.fetchAny

        const inputs = document.getElementsByTagName('input')
       for(let input of inputs) {

           if( input.value !== '') {

            placeHolder[input.name] = input.value
           }
       }
     
     try {
        
        options.body = JSON.stringify(placeHolder)

        const data = await fetchAny('http://localhost:3030/users/inner', options)

        console.log('savedUser', data)

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

              errElm = e.target.id == 'emailin' ? document.getElementById('errEmailIn'): document.getElementById('errEmail')

              console.log(regex.exec(e.target.value))

        if(!regex.exec(e.target.value)){ // email not well formatted 

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
         rMaj =/[A-Z]+/,   // Majs checher
         rNum = /[0-9]+/, // numbers checker
         rSpec =  /[&ù\*!\:"';?{}\[\]\(\)~#%@\+-\/\\\x20$µ£<>¨\^§=_.-]+/ // special chars checker

        let errMsg = '&times; Weak PWD. USE: ',
             err = false

        const errPwd = document.getElementById('errPwd'),
              strongPwd = document.getElementById('strongPwd'),
              errConf = document.getElementById('errConf')     

         if(e.target.value.length < 8) { // no short passwords accepted
             errMsg += '- num of ch < 8'
             err = true
         }
         if(!rMin.exec(e.target.value)){

            errMsg += '- minus chars';
            err= true
         } 

         if(!rMaj.exec(e.target.value)){
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
     
        if( e.target.value !== pwd.value) {


            show(errConf)

            err = false // ignore password input when we're on confirmation password

        } else {

            hide(errConf)
        }

        if(err) {// there's an error in creating STRONG Password 

      
            errPwd.textContent = errMsg
        
            show(errPwd)
            hide(strongPwd)

          } else if(e.target.id !== 'confirm') {

            hide(errPwd)
            show(strongPwd)
          }
       
    }

export {handleFormSubmission, documentLoaderListener, handleTabsSwitching, handleUserCreation, handleEmailValidation, handlePasswordsValidation}