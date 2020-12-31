// Modules import
import {
      findReplace,
      fetchAny,
      dtPicker,
      handleDate,
      appendTag,
      show,
      hide,
      hasClassName,
      revertDate,
      toEnUSDate,
      countDays,
      getMaxLikesEntry,
      isEmptyObj,
      shortenToSeven,
      attachEvent,
      tripHTMLCodeToAppend
} from './js/helpers';
import {
      handleFormSubmission,
      documentLoadedListener,
      handleUserSession,
      handleTabsSwitching,
      handlePasswordsValidation,
      handleEmailValidation,
      handleShowHideDynamicForms
} from './js/app.js';
import {
      googleSignInLib as Glib,
      onSignIn,
      signOut
} from './js/googleClientSideSignin'
import {
      addItem,
      removeItem,
      getItem,
      clearAll
} from './js/sessionStorage'
import {
      pixaAPICall,
      restCountriesAPICall,
      weatherbitAPICall,
      geonamesAPICall
} from './js/apisCallAndDataReformating'

// SCSS files import

import './styles/normalize.scss';
import './styles/_custom.scss';
import './styles/base.scss';
import './styles/header.scss';
import './styles/form.scss';
import './styles/footer.scss';
import './styles/trips.scss'

// images files  import

import './media/captrip-logo.svg';
import './media/favicon.ico';
import './media/magnifier.svg';
import './media/sign-up.svg';
import './media/page-curl.svg';
import './media/menu-bars.svg'
import './media/add.svg'
import './media/edit.svg'
import './media/print.svg'
import './media/delete.svg'


const button = document.getElementById('search-button'),

      form = document.getElementsByTagName('form')[0] // delegate event on form

// sign in form event of sign in/up tabs / general purpose tabs
const tabs = document.getElementsByClassName('tab')

attachEvent(tabs, 'click', handleTabsSwitching)

attachEvent(button, 'click', handleFormSubmission)

attachEvent(form, 'mouseover', handleDate, {
      once: true
}) // adding eventListener only once!

window.addEventListener('DOMContentLoaded', documentLoadedListener) // make sure that DOM is loaded before manipulating it, attachEvent function won't work in this case


const submitConnexion = document.getElementById('signin-sub')
const submitRegister = document.getElementById('register-sub')

// using same event listener and filtering empty inputs

attachEvent(submitConnexion, 'click', handleUserSession)
attachEvent(submitRegister, 'click', handleUserSession)


const pwd = document.getElementById('password'), // sign up check
      email = document.getElementById('email'), // sign up  check
      conf = document.getElementById('confirm') // signup check

// check inputs values when losing focus

attachEvent(email, 'keyup', handleEmailValidation)
attachEvent(pwd, 'keyup', handlePasswordsValidation)
attachEvent(conf, 'keyup', handlePasswordsValidation)



// https://stackoverflow.com/questions/36695438/detect-click-outside-div-using-javascript

// hide dynamic showed forms when clicked outside
window.addEventListener('click', handleShowHideDynamicForms) // event delegation


// setting a placeholder in the sessionstorage by default


const formAddTrip = document.getElementById('input-trip')

attachEvent(formAddTrip, 'click', tripHTMLCodeToAppend)
addItem('user')
addItem('userId', '5fea479cb59a4b30df27ac39') // set here for the sake of the reviewer



export {
      findReplace, // will be exported to Client library
      fetchAny,
      dtPicker,
      appendTag,
      onSignIn,
      signOut,
      show,
      hide,
      hasClassName,
      addItem,
      removeItem,
      getItem,
      clearAll,
      revertDate,
      toEnUSDate,
      isEmptyObj,
      countDays,
      pixaAPICall,
      restCountriesAPICall,
      weatherbitAPICall,
      geonamesAPICall,
      getMaxLikesEntry,
      shortenToSeven,
      Glib
}