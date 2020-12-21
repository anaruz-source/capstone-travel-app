import { findReplace, fetchAny, dtPicker, appendTag } from './js/helpers';
import { handleFormSubmission, handleDate } from './js/app.js';
import {googleSignInLib as Glib, onSignIn, signOut} from './js/googleClientSideSignin'

import datepickr from 'js-datepicker';




import './styles/normalize.scss';
import './styles/_custom.scss';
import './styles/base.scss';
import './styles/header.scss';
import './styles/form.scss';
import './styles/footer.scss';

import './media/captrip-logo.svg';
import './media/favicon.ico';
import './media/page-curl.svg';
import './media/magnifier.svg';
import './media/sign-up.svg';
import './media/family-vacation.png';



const button  = document.getElementById('search-button'),

      form = document.getElementsByTagName('form')[0]// delegate event on form

button.addEventListener('click', handleFormSubmission)

form.addEventListener('mouseover', handleDate, {once: true})


window.addEventListener('DOMContentLoaded', async (e) => {

    appendTag(Glib.meta, document.head)
    appendTag(Glib.script, document.head)

    const onSignInScript = document.createElement('script')
          onSignInScript.textContent = 'function onSignIn(googleUser){ Client.onSignIn(googleUser)}'

    document.head.appendChild(onSignInScript)
  
})

export { findReplace, fetchAny, datepickr, dtPicker, appendTag, onSignIn, signOut}