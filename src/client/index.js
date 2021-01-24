// Modules import
import {
      findReplace,
      fetchAny,
      dtPicker,
      appendTag,
      removeTag,
      show,
      hide,
      handleSession,
      isInputText,
      inputValidator,
      dataAttrName,
      getRndInteger,
      handleFormError,
      getAdjacentNodes,
      hasClassName,
      hasFullClassName,
      revertDate,
      toEnUSDate,
      countDays,
      getMaxLikesEntry,
      isEmptyObj,
      shortenToSeven,
      attachEvent,
      getParentOfChild,
      tripHTMLCodeToAppend,
      destHTMLCodeToAppend,
      placeOrTaskHTMLCode,
      addClassWithTimeout,
      handleErrors,
      scrollToElement,
      formatForPrinting,
      wrapInDocumentForPrint,
      clearSession
}
      from './js/helpers';

import {
      handleFormSubmission,
      documentLoadedListener,
      handleDate,
      windowLoadedListener,
      handleUserSession,
      handleTabsSwitching,
      handlePasswordsValidation,
      handleEmailValidation,
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
      from './js/app.js';

import {
      googleSignInLib as Glib,
      onSignIn,
      signOut
}
      from './js/googleClientSideSignin'


import {
      Places,
      autoCompleter
}
      from './js/AlgoliaAutocomplete'

import {
      addItem,
      removeItem,
      getItem,
      clearAll
}
      from './js/sessionStorage'

import {
      pixaAPICall,
      restCountriesAPICall,
      weatherbitAPICall,
      geonamesAPICall,
      mapQuestCall
}
      from './js/apisCallAndDataReformating'

import {
      getElmRect,
      animate,
      getComputedHeight
}
      from './js/animation'

import {
      initMap,
      addMarker,
      handleOnClear,
      removeMarker,
      findBestZoom
}
      from './js/mapHelpers'
// SCSS files import

import './styles/normalize.scss';
import './styles/_custom.scss';
import './styles/base.scss';
import './styles/header.scss';
import './styles/form.scss';
import './styles/footer.scss';
import './styles/trips.scss'
import './styles/profile.scss'

// images files  import

import './media/captrip-logo.svg';
import './media/favicon.ico';
import './media/magnifier.svg';
import './media/sign-up.svg';
import './media/log-out.svg'
import './media/page-curl.svg';
import './media/menu-bars.svg'
import './media/add.svg'
import './media/add-place.svg'
import './media/add-task.svg'
import './media/edit.svg'
import './media/print.svg'
import './media/delete.svg'
import './media/pulse-loader.gif' // https://loading.io/spinner/pulse/-facebook-bar-pulse
import './media/delete-small.svg'
import './media/gear-loader.gif' //" " 
import './media/new-window.svg'
import './media/marker-icon.png'
import './media/marker-icon-2x.png'
import './media/layers-2x.png'
import './media/layers.png'
import './media/marker-shadow.png'
import './media/avatar.svg'

window.addEventListener('DOMContentLoaded', documentLoadedListener) // make sure that DOM is loaded before manipulating it, attachEvent function won't work in this case
window.addEventListener('load', windowLoadedListener)
const button = document.getElementById('search-button')

const searchBar = document.getElementsByClassName('search-bar')[0]

const form = searchBar ? searchBar.firstElementChild : '' // delegate event on form if it's defined!(for index page)

// sign in form event of sign in/up tabs / general purpose tabs

const tabs = document.getElementsByClassName('tab')

attachEvent(tabs, 'click', handleTabsSwitching)

attachEvent(button, 'click', handleFormSubmission)


attachEvent(form, 'mouseover', handleDate, {
      once: true
})


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


// if input-trip  submit input is clicked in trips/ page, then submit this form
const formAddTrip = document.getElementById('input-trip')

attachEvent(formAddTrip, 'click', addTripDynamicCode)


// if input-dest submit input is clicked in trips/ page, then submit this form
const formAddDest = document.getElementById('input-dest')

attachEvent(formAddDest, 'click', addTripDynamicCode)

// card-trip accordion show and hide event, used to show and hide destinations

const tripCards = document.getElementsByClassName('trip-card')

attachEvent(tripCards, 'click', showHideAccordion)

const inputPlace = document.getElementById('input-place')

const inputPack = document.getElementById('input-pack')

attachEvent(inputPack, 'click', handleAddPlacesTasksForm)

attachEvent(inputPlace, 'click', handleAddPlacesTasksForm)

const delLinks = document.querySelectorAll('img[id^="delete"]') // all images that their ids start with delete

attachEvent(delLinks, 'click', deleteEventListener) // add to all images with delete as starting of their ids!

const upMaps = document.getElementsByClassName('put-on-map')

attachEvent(upMaps, 'click', handleMapMarkers)


const printLinks = document.querySelectorAll('img[id^="print"]') // all images that their ids start with delete

attachEvent(printLinks, 'click', handlePrintToPdf)


const items = document.getElementsByClassName('item')

attachEvent(items, 'click', userSpaceHandler)


const img = document.getElementById('search-link').firstElementChild

attachEvent(img, 'click', sessionHandler)

// this will fetch trips link, if clearSesssion return false, so user is there online, otherwise, offline,
// react consequently

!async function () {

      const url = getItem('userId') && `trips/userId/${getItem('userId')}`

      const nUrl = url || location.pathname

      if (await clearSession(url)) {

            handleSession()

      }


}()

! function () { // check if we're in trips page or profile page

      const url = location.pathname

      const urlFrags = url.split('/')

      if (!url.length) return

      addItem('userId', urlFrags[3] || urlFrags[1])
}()

export {
      findReplace, // will be exported to Client library
      fetchAny,
      dtPicker,
      appendTag,
      removeTag,
      onSignIn,
      signOut,
      show,
      hide,
      handleSession,
      inputValidator,
      isInputText,
      dataAttrName,
      handleFormError,
      handleErrors,
      hasClassName,
      hasFullClassName,
      handleDate,
      getRndInteger,
      attachEvent,
      getParentOfChild,
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
      mapQuestCall,
      getMaxLikesEntry,
      shortenToSeven,
      tripHTMLCodeToAppend,
      destHTMLCodeToAppend,
      placeOrTaskHTMLCode,
      getElmRect,
      animate,
      getComputedHeight,
      addClassWithTimeout,
      getAdjacentNodes,
      autoCompleter,
      scrollToElement,
      formatForPrinting,
      wrapInDocumentForPrint,
      initMap,
      addMarker,
      removeMarker,
      handleOnClear,
      findBestZoom,
      clearSession,

      Places,
      Glib
}