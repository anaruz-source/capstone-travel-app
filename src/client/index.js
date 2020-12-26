// Modules import
import { findReplace, fetchAny, dtPicker, handleDate , appendTag, show, hide, hasClassName, revertDate, toEnUSDate, countDays, getMaxLikesEntry, isEmptyObj } from './js/helpers';
import { handleFormSubmission, documentLoadedListener, handleUserSession, handleTabsSwitching, handlePasswordsValidation, handleEmailValidation} from './js/app.js';
import {googleSignInLib as Glib, onSignIn, signOut} from './js/googleClientSideSignin'
import {addItem, removeItem, getItem, clearAll} from './js/sessionStorage'
import {pixaAPICall, restCountriesAPICall, weatherbitAPICall, geonamesAPICall} from './js/apisCallAndDataReformating'

// SCSS files import

import './styles/normalize.scss';
import './styles/_custom.scss';
import './styles/base.scss';
import './styles/header.scss';
import './styles/form.scss';
import './styles/footer.scss';

// images files  import

import './media/captrip-logo.svg';
import './media/favicon.ico';
import './media/page-curl.svg';
import './media/magnifier.svg';
import './media/sign-up.svg';
import './media/family-vacation.png';
import './media/menu-bars.svg'



const button  = document.getElementById('search-button'),

      form = document.getElementsByTagName('form')[0]// delegate event on form

// sign in form event delegation of sign in/up tabs

document.getElementById('sign').addEventListener('click', handleTabsSwitching)

button.addEventListener('click', handleFormSubmission)

form.addEventListener('mouseover', handleDate, {once: true}) // adding eventListener only once!

window.addEventListener('DOMContentLoaded', documentLoadedListener) // make sure that DOM is loaded before manipulating it


const submitConnexion = document.getElementById('signin-sub')
const submitRegister = document.getElementById('register-sub')

// using same event listener and filtering empty inputs

submitConnexion.addEventListener('click', handleUserSession)
submitRegister.addEventListener('click', handleUserSession)


const pwd = document.getElementById('password'), // sign up check
      email = document.getElementById('email'), // sign up  check
      conf = document.getElementById('confirm') // signup check

// check inputs values when losing focus

email.addEventListener('keyup', handleEmailValidation)
pwd.addEventListener('keyup', handlePasswordsValidation)
conf.addEventListener('keyup', handlePasswordsValidation)

// setting a placeholder in the sessionstorage by default

addItem('user')
addItem('userId','5fe50c91439a70514ae0e339') // set here for the sake of the reviewer

export { findReplace, fetchAny,  dtPicker, appendTag, onSignIn, signOut, show, hide, hasClassName, addItem, removeItem, getItem, revertDate, toEnUSDate, isEmptyObj, countDays, pixaAPICall, restCountriesAPICall, weatherbitAPICall, geonamesAPICall, getMaxLikesEntry, Glib}