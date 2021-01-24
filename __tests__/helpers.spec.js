// unit tests for helpers module

// https://www.valentinog.com/blog/jest/

// https://jestjs.io/docs/en/expect

// Modules import

import 'regenerator-runtime/runtime'


import {
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
} from './../src/client/js/helpers';

describe('testing helpers module functions', () => {
     
    test('findReplace will find some string of type key=, replace it with key=value, key and value passed as args', () => {



        const url = 'http://example.com/key='
        const targetUrl = 'http://example.com/key=12345'

    // defined?

        expect(findReplace).toBeDefined()

        // test with key=value 

        expect(findReplace.call(url, `key=12345`)).toEqual(targetUrl)
    })
  


    test('testing of  remaining function if they are defined', () => {
           expect(fetchAny).toBeDefined()
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

