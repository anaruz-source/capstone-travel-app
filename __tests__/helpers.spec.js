// unit tests for helpers module

// https://www.valentinog.com/blog/jest/

// https://jestjs.io/docs/en/expect

// Modules import

import 'regenerator-runtime/runtime'


const {
    findReplace,
    fetchAny,
    dtPicker,
    appendTag,
    removeTag,
    show,
    hide,
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
    addClassWithTimeout,
    handleErrors,
    scrollToElement
} = require('./../src/client/js/helpers');

describe('testing helpers module functions', () => {
     
    test('findReplace will find some string of type key=, replace it with key=value, key and value passed as args', () => {



        const url = 'http://example.com/key='
        const targetUrl = 'http://example.com/key=12345'

    // defined?

        expect(findReplace).toBeDefined()

        // test with key=value 

        expect(findReplace.call(url, `key=12345`)).toEqual(targetUrl)
    })
  
    test('fetchAny, to fetch any valid link', async () => {

        jest.setTimeout(10000) // set for the sake of Restful API to return a response

        const restCountriesUrl = 'https://restcountries.eu/rest/v2/name/france'
        
        const output = [{"name":"France","topLevelDomain":[".fr"],"alpha2Code":"FR","alpha3Code":"FRA","callingCodes":["33"],"capital":"Paris","altSpellings":["FR","French Republic","République française"],"region":"Europe","subregion":"Western Europe","population":66710000,"latlng":[46.0,2.0],"demonym":"French","area":640679.0,"gini":32.7,"timezones":["UTC-10:00","UTC-09:30","UTC-09:00","UTC-08:00","UTC-04:00","UTC-03:00","UTC+01:00","UTC+03:00","UTC+04:00","UTC+05:00","UTC+11:00","UTC+12:00"],"borders":["AND","BEL","DEU","ITA","LUX","MCO","ESP","CHE"],"nativeName":"France","numericCode":"250","currencies":[{"code":"EUR","name":"Euro","symbol":"€"}],"languages":[{"iso639_1":"fr","iso639_2":"fra","name":"French","nativeName":"français"}],"translations":{"de":"Frankreich","es":"Francia","fr":"France","ja":"フランス","it":"Francia","br":"França","pt":"França","nl":"Frankrijk","hr":"Francuska","fa":"فرانسه"},"flag":"https://restcountries.eu/data/fra.svg","regionalBlocs":[{"acronym":"EU","name":"European Union","otherAcronyms":[],"otherNames":[]}],"cioc":"FRA"}]
      
        expect(fetchAny).toBeDefined()

        expect(await fetchAny(restCountriesUrl)).toMatchObject(output)
    })

    test('testing of  remaining function if they are defined', () => {

           expect(dtPicker).toBeDefined()
           expect(appendTag).toBeDefined()
           expect(removeTag).toBeDefined()
           expect(show).toBeDefined()
           expect(hide).toBeDefined()
           expect(dataAttrName).toBeDefined()
           expect(getRndInteger).toBeDefined()
           expect(handleFormError).toBeDefined()
           expect(getAdjacentNodes).toBeDefined()
           expect(hasClassName).toBeDefined()
           expect(hasFullClassName).toBeDefined()
           expect(revertDate).toBeDefined()
           expect(toEnUSDate).toBeDefined()
           expect(getMaxLikesEntry).toBeDefined()
           expect(isEmptyObj).toBeDefined()
           expect(shortenToSeven).toBeDefined()
           expect(attachEvent).toBeDefined()
           expect(getParentOfChild).toBeDefined()
           expect(tripHTMLCodeToAppend).toBeDefined()
           expect(destHTMLCodeToAppend).toBeDefined()
           expect(addClassWithTimeout).toBeDefined()
           expect(handleErrors).toBeDefined()
           expect(scrollToElement).toBeDefined()
           expect(countDays).toBeDefined()
       
    })
})

