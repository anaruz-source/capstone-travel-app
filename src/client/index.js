import { findReplace, fetchAny, dtPicker } from './js/helpers';
import { handleFormSubmission, handleDate } from './js/app.js';

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



const button  = document.getElementById('search-button'),

      form = document.getElementsByTagName('form')[0]// delegate event on form

button.addEventListener('click', handleFormSubmission)

form.addEventListener('mouseover', handleDate, {once: true})



export { findReplace, fetchAny, datepickr, dtPicker}