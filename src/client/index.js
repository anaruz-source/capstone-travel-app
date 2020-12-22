// Modules import
import { findReplace, fetchAny, dtPicker, handleDate , appendTag, show, hide, hasClassName } from './js/helpers';
import { handleFormSubmission, documentLoaderListener, handleUserCreation, handleTbasSwitching, handleTabsSwitching} from './js/app.js';
import {googleSignInLib as Glib, onSignIn, signOut} from './js/googleClientSideSignin'

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

form.addEventListener('mouseover', handleDate, {once: true})

window.addEventListener('DOMContentLoaded', documentLoaderListener) // make sure that DOM is loaded before manipulating it


const submitConnexion = document.getElementById('signin-sub')
const submitRegister = document.getElementById('register-sub')

// using same event listener and filtering empty inputs

submitConnexion.addEventListener('click', handleUserCreation)
submitRegister.addEventListener('click', handleUserCreation)





export { findReplace, fetchAny,  dtPicker, appendTag, onSignIn, signOut, show, hide, hasClassName, Glib}