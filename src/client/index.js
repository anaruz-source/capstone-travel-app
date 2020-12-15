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

import { changeInputType } from './js/helpers';


const button  = document.getElementById('search-button'),

      form = document.getElementsByTagName('form')[0]// delegate event on form

button.addEventListener('click', Client.handleFormSubmission)

form.addEventListener('focus', changeInputType)

