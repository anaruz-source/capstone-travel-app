import datepickr from 'js-datepicker';

function findReplace(...args) { // inserts parameters on required place in the url string
    
    let copy = this.slice() // making a copy of a string referenced by 'this' keyword
    
   
    
    args.forEach(arg => {
       
        let s = arg.split('=')
       
        copy = copy.replace(`${s[0]}=`, `${s[0]}=${s[1]}`)
        
        
    })


    return copy
}

const  fetchAny = async (url, options) => {


    const response = await fetch(url, options);

    try {

        const data = await response.json();

        return data;

    } catch (err) {

        //   throw new Error(err.message);

        console.log(err)

    }
},

toEnUSDate = (d) => {

    const value = new Intl.DateTimeFormat('en-US').format(d).replaceAll('/', '-') // construct an en-US date, then convert it to YYYY-MM-DD using revertDate function

    return value
},

    // used to transform an en-US date to YYYY-MM-DD to be used by weatherbit

    revertDate = (str) => {

        const m = str.match(/\d+/g)

        return `${m[2]}-${m[0]}-${m[1]}`
    },


dtPicker = (selector, minDate, id, pos) => {


    const datepicker = datepickr(selector, {  
        
        formatter: (input, date, instance) => {
             // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
             // convert to en-US format MM-DD-YYYY
             // then convert to suited format to weatherbit.com YYYY-MM-DD
            
             const value = toEnUSDate(date)

            input.value = revertDate(value)                                       
        },

        id: id, // id used to link start and end dates
        position: pos
    })

    return datepicker.setMin(minDate)  // prevents selecting passed dates, so we set the date to current

},



inputValidator = (...inputs) => {

if(isEmptyObj(inputs)) throw new TypeError('no arguments provided') // if no arg provided so the inputs array will be empty, return to the calling context

        inputs.forEach( en => {
            
            if(en.nodeName.toLowerCase() === 'input') {  // only operates on input nodes
                
                if (en.required) { // if required attribute is set to true

                    if (en.value == '') { // value should not be empty then

                        throw new TypeError('input should not be empty')
                    }


                }

            }

        })

        return true // everything is ok if we arrive here with no throw execption to interrupt function execution
},

// input  should contain text only

isInputText = (input) => {

    

    const rgx = /[a-zA-Z\x20]+/ // chars and spaces only,

        res = rgx.exec(input.value) 

    if(!input) throw new TypeError('no argument provided') // no arg passed return

    if (inputValidator(input) ) { // if empty it will throw TypeError if input.required == true
        
    if ( res && res[0] === res.input || !res) { // check if all the input is captured, so it contains text and spaces only or if input.required == false, and it's left empty
   
       return true       
    } else {

        throw new TypeError('Input contains illegal chars!!')
    } 
}

},

// function to append tag 
// it helps to permform some checking before appending a tag to its parent

appendTag =  (tag, parent) => {
   
    if (!tag) throw Error('Tag child should be passed as arg')
    if (!parent) throw Error('Parent tag should be passed as arg')

    parent.appendChild(tag)
},

removeTag = (child, parent) => { // removes child if provided, else removes the the tag itself!

    if (!child) throw Error('Tag child should be passed as arg')
    if (!parent) throw Error('Parent tag should be passed as arg')

    if(!!parent){ 
        parent.appendChild(child) // parent is defined
     } else if (!!child) {
         child.remove()
        
    }

} 
// JQuery3.5.1 IsEmptyObject
// https://code.jquery.com/jquery-3.5.1.js


function isEmptyObj(obj) {

    // for NodeList and HTMLCollection there're some props even when empty,
    // So let's add this check to make this function more general purpose

    const toString = Object.prototype.toString // shortcut to Object.protoype method, we need to change its 'this' context to reveal type of object

    if (obj.length == 0 && (toString.call(obj) === '[object NodeList]' || toString.call(obj) == '[object HTMLCollection]')) return true

    for (let prop in obj) { // if object has one property then it's not empty


        return false;
    }

    return true
}
// show/hide adds bootstrap css class d-block and d-none to display and hide elements

// Copied from the previous project weather app

const hide = (elm, className = 'd-block') => {  // hide with d-block or equivalent className d-flex

    if (elm.className.indexOf(className) > -1) {

        elm.classList.replace(className, 'd-none')
    } else {

        elm.classList.add('d-none')
    }

},

show = (elm, className='d-block') => { // show with d-block or another equivalent className, d-flex for example


    if (elm.className.indexOf('d-none') > -1) {

        elm.classList.replace('d-none', className)
    } else {

        elm.classList.add(className)
    }

},

 hasClassName = (elem, className) => {
    
    if(!elem) return false // element is null/undefined

    return elem.className.indexOf(className) > -1 // element has className (we can pass it just a fragment of className lik qs of qs-datepicker for exampl)
},

hasFullClassName = (elem, className) => { //  this returns true if element has a a complete className, here we should pass qs-datepicker

    return !!elem && elem.classList.contains(className) // element is not null and is defined
},

getParentOfChild = (child, parent) => { // look parent of tag and its grandparent  until we get the parent passed as arg (name or classNme) and return it
                                       // tag is an element, parent only a tag name or className
        if (!child) return null

           let parentTag = child.parentNode        
        
      try {

                   while(  parentTag.nodeName.toLowerCase() != parent  && !hasFullClassName(parentTag, parent) ){
                 
           
                 parentTag = parentTag.parentNode
           }
          
      } catch (error) {
          
        return null
      }


           return parentTag
},
// this function is from https://www.w3schools.com/js/js_random.asp
getRndInteger = (min, max)  => { // it generates random number to used as datepicker ids

    return Math.floor(Math.random() * (max - min + 1)) + min;
},

    

countDays = (start, now) => {

    const st = new Date(start)
    const ed = new Date(now)

    const diff = ed.getTime() - st.getTime()

    return diff / (1000 * 60 * 60 * 24) // convert ms to days

},

getMaxLikesEntry = ( hits = []) => { // function used in pixa bay to get the image which has most likes

let max = hits[0].likes, // init with first hit's likes number
    maxHit = hits[0]   // init with first hit

hits.forEach(h => {

    if (h.likes > max){ 
        
        max = h.likes
        maxHit = h
    }
})

return maxHit
},

shortenToSeven = (days, start) => { //used to shorten the list of retuned forecast days from the API (16 -> 7 only)


    const onlySvn = []
    days.forEach(d => {
     
        const dDate = new Date(d.date)
        const dStart = new Date(start)

        if (dDate.getTime() >= dStart.getTime() && onlySvn.length < 7) {

            onlySvn.push(d)
        }
    });
  
    return onlySvn
},

handleFormError = (tag, err) => { // tag will be pass as e.target and eventually an error obj, if its grand parent is a form then
                                  // if there's error, error tag will be shown
                                  // otherwise, hide an eventually shown error tag
    const form = getParentOfChild(tag, 'form')

    if(!form) return

    const errTag = form.getElementsByClassName('form-error')[0] // form has only one of this classname
    const overlay = form.getElementsByClassName('overlay')[0] // form has only one of this classname

    if(err){
        errTag.textContent = err.message
        show(errTag)
        hide(overlay)
        return 
    }
    hide(overlay)
    hide(errTag)

},

handleErrors = (elm, options = { msg: 'some error occured!', className : d-blocke, clear : false, center : false}) => { // handle errors with options (defaults are there)

  if(options.clear){ // clear error from the page

    elm.textContent = ''
     elm.className = 'd-none error' // replace all with 'd-none error'!

  }
  
    show(elm, options.className)
    elm.textContent = options.msg
  
  if(options.center){

    elm.classList.add('justify-content-center')
    elm.classList.add('align-items-center')
  }
  
   
},
getAdjacentNodes = adj => {

    const adjs = adj.parentNode.childNodes,
          output = []

    let idx = 0

    for(; idx < adjs.length; ){

        if(adjs[ idx ].nodeType == 1 && !adjs[ idx ].isSameNode(adj)) output.push(adjs[idx]) // eclude text nodes and same node
     
        idx++
    }
   
    return output
},

attachEvent = (t, type, eventListener, options) => { // check if defined before attaching eventListener to an element// t (target) type of event, eventListener params
   
    if (!t || isEmptyObj(t) || !!t && !!t.length && t[0].nodeType != 1) return false // passed empty set of elements or null/undefined or not cointaining node elements
   

    if (length in t && t.nodeType != 1) { // HTMLNodeLists HTMLCollections has length

        let idx = 0

        for (; idx < t.length;) {

            t[idx].addEventListener(type, eventListener, options)

            idx++

        }


    } else { // Single node passed as param

        t.addEventListener(type, eventListener, options)

    }

    return true// everyThing is okey
}, 


addClassWithTimeout = (tag, className, timeout) => { // adding a className then remove it after timeout

  if(!tag) return

  tag.classList.add(className)
  
  setTimeout(() => {

    tag.classList.remove(className)
    if(className == 'd-flex' || className =='d-block'){

        hide(tag, className)
    }
      
  }, timeout);
},

destHTMLCodeToAppend = (d, idx,_tripId) => { // for reuse in adding only destination to trip


    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
   

    const destHTMLCodeTemplate = `
            <div class="d-card" id="d-card-${idx_d}" data-trip-db-id="${_tripId}" data-d-db-id="${d._id}" data-d-db-lng="${d.lng}" data-d-db-lat="${d.lat}">
        <div class="d-card-header">
          <p>
            <span class="entry-name">Name:
            </span>
            <span class="entry-details">${d.name}
            </span>
          </p>
          <div class="flex-nowrap d-none  settings-d">
            <div>
              <img src="media/add-place.svg" alt="delete task icon"  title="add place" id="add-place-link-${idx}">
            </div>
            <div>
              <img src="media/add-task.svg" alt="add task icon" title="add task" id="add-pack-link-${idx}">
            </div>
            <div>
              <img src="media/delete.svg" alt="delete dest icon" title="delete destination" id="delete-dest-link-${idx}">
            </div>
          </div>
          <div class="tabs d-flex">
            <div class="tab" data-tab-id="country-info-${idx}">Country Info
            </div>
            <div class="tab active" data-tab-id="weather-info-${idx}">Weather forecast
            </div>
            <div class="tab" data-tab-id="place-info-${idx}">places
            </div>
            <div class="tab" data-tab-id="pack-info-${idx}">todo list
            </div>
          </div>
        </div>
        <div class="d-card-body">
          <div class="tab-content d-none" id="country-info-${idx}">
            <div class="d-flex flex-wrap">
              <p>
                <span class="entry-name">Name:
                </span>
                <span class="entry-details">&lt;${d.countryInfos.name}&gt;
                </span>
              </p>
              <p>
                <span class="entry-name">Language:
                </span>
                <span class="entry-details">&lt;${d.countryInfos.language}&gt;
                </span>
              </p>
              <p>
                <span class="entry-name">Region:
                </span>
                <span class="entry-details">&lt;${d.countryInfos.region}&gt;
                </span>
              </p>
              <p>
                <span class="entry-name">Timezone:
                </span>
                <span class="entry-details">&lt;${d.countryInfos.timezone}&gt;
                </span>
              </p>
              <p>
                <span class="entry-name">Capital:
                </span>
                <span class="entry-details">&lt;${d.countryInfos.capital}&gt;
                </span>
              </p>
              <p>
                <span class="entry-name">Currency:
                </span>
                <span class="entry-details">&lt;${d.countryInfos.currency}&gt;
                </span>
              </p>
              <p>
                <span class="entry-name">Borders
                </span>
                <span class="entry-details">
                  &lt;${ d.countryInfos.borders.join('|') }&gt;
                </span>
              </p>
              <p>
                <span class="entry-name">Flag
                  <>
                </span>
                  <span class="entry-details">
                    <img src="${d.countryInfos.flag}" alt="country flag">
                  </span>
                  </span>
                  </p>
            </div>
          </div>
          <div class="tab-content  d-block" id="weather-info-${idx}">
            <div class="entries d-flex justify-content-around flex-wrap">
              ${ d.weatherInfos.forecasts.map( w => {`
              <div class="entry">
                <div class="entry-body d-flex">
                  <div class="forecast-vals">
                    <div class="entry-title">${days[new Date(w.date).getDay()]} (${Client.revertDate(Client.toEnUSDate(new Date(w.date)))})
                    </div>
                    <!-- getting name of the day-->
                    <p>
                      <span class="entry-name">Temp
                      </span>
                      <span class="entry-details"> ${w.avgTemp}
                        </p>
                    <p>
                      <span class="entry-name">Wind(km/h)
                      </span>
                      <span class="entry-details"> ${(w.windSpd * 36).toFixed(0)}
                      </span>
                    </p>
                 
                    <p>
                      <span class="entry-name">Precips(mm)
                      </span>
                      <span class="entry-details"> ${w.precip.toFixed(2)}
                      </span>
                    </p>
                  </div>
                  <div class="forecast-icon">
                    <img src=" https://www.weatherbit.io/static/img/icons/${w.icon}.png " alt="forecast icon">
                    <div class="desc">${w.description}
                    </div>
                  </div>
                </div>
              </div>
             `} ).join('')}
            </div>
          </div>
          <div class="tab-content d-none" id="place-info-${idx}">

            <div>Too Clean space, add some places to visit
            </div>
     

          </div>
          <div class="tab-content d-none" id="pack-info-${idx}">
           
            <div>Too Clean space!!, add some items to your to dolist
            </div>
          
       
          </div>
        </div>
      </div> `
    
            return destHTMLCodeTemplate
},

tripHTMLCodeToAppend =   (trip, idx, idx_d) => { // applied only in dedicated page for image

    if(location.href.indexOf('/trips/') <= -1) return // in case we're in the index page, no need to append the added trip a success message is okey!
   const t = trip[0]
   const tripHTMLCodeTemplate = `
                         
   <div class="trip-card" id="trip-card-${idx}">
     <div class="container">
     <div class="d-flex d-column">
         <h4 class="trip-card-header">${ t.title }</h4>
         <div class="trip-card-body">
             <p><span class="entry-name">Description</span><span class="entry-details">${t.description}</span></p>
             <p><span class="entry-name">Start Date</span><time class="entry-details">${revertDate(toEnUSDate(new Date(t.startDate)))}</time></p>
             <p><span class="entry-name">End Date</span><time class="entry-details">${revertDate(toEnUSDate(new Date(t.endDate)))}</time></p>
             <p><span class="entry-name">Duration</span><time class="entry-details">${trip.duration} day(s)</time></p>
         </div>
     </div>  
     <div class="flex-nowrap d-none settings">
       <div><img src="media/add.svg" alt="add trip icon" id="add-trip-link-${idx}"></div>
       <div><img src="media/edit.svg" alt="edit trip icon" id="edit-trip-link-${idx}"></div>
       <div><img src="media/print.svg" alt="print trip icon" id="print-link-${idx}"></div>
       <div><img src="media/delete.svg" alt="delete trip icon" id="delete-trip-link-${idx}"></div>
       <div id="trip-id-info-${idx}" data-trip-id-info ="${t._id}"></div>
     </div>
   </div>   
    </div>
`

       return tripHTMLCodeTemplate + destHTMLCodeToAppend(t.destinations[0], idx_d, t._id) // new trip means first destination
        }

export {
    
    findReplace,
    fetchAny,
    revertDate,
    toEnUSDate,
    dtPicker,
    isEmptyObj,
    inputValidator,
    isInputText,
    appendTag,
    removeTag,
    show,
    hide,
    getRndInteger,
    handleFormError,
    handleErrors,
    getAdjacentNodes,
    hasClassName,
    hasFullClassName,
    countDays,
    getMaxLikesEntry,
    shortenToSeven,
    attachEvent,
    tripHTMLCodeToAppend,
    destHTMLCodeToAppend,
    addClassWithTimeout,
    getParentOfChild
}

