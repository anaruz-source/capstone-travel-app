// This functions are copied from the 1nd nondegree project (Langing page)
////
let docElm = document.documentElement,

    addClass = function (className) { // Using  declaration function/function expression because, arrow functions resolve 'this'  to enclosing lexical scope
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
        // changing function's scope

        let classList = this.className ? this.className : '';

        if (classList.indexOf(className) === -1) {

            classList += ' ' + className;

            this.className = classList.trim();


        }
    },

    removeClass = function (className) { // Using  declaration function/Function Expression  because, arrow functions resolve 'this'  to enclosing lexical scope
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

        let classList = this.className ? this.className : '';

        if (classList.indexOf(className) !== -1) { //stop here if className doesn't contain the required className

            let classArray = classList.split(/\s+/), //split based on regex, at least one space seperates classNames 

                pos = classArray.indexOf(classArray);

            classArray.splice(pos, 1, '');

            classList = classArray.join(' ');

            this.className = classList;


        }


    },

    // JQuery3.2.1 inspired me on writting this function
    // I made an analysis of JQuery earlier in 2020!


    // https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing

    // this adjustement are added for the sake of collapsing part

    getComputedHeight = (elm, adjust) => { // we can use default parameter 'adjust = false', for the sake of backward compatibility we don't! 
        //it resolves to undefined which is == false

        // in case of box-sizing: border-box, element could be adjust with extrat height, margin never added
        // in both box models

        if (!elm) return 0; //elm undefined/null , avoid any unnecessary verifications

        let adjustement = 0,

            computed = getComputedStyle(elm);

        if (adjust) {


            if (computed.boxSizing === 'content-box') { //padding border not included in calculation of this box model so adding them

                // parseFloat converts string to a float stripping off the px unit
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat

                adjustement = parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom) + parseFloat(computed.borderTopWidth) + parseFloat(computed.borderBottomWidth);
            }

            adjustement += parseFloat(computed.marginTop) + parseFloat(computed.marginBottom) // margin not included in both box models
        }


        return parseFloat(computed.height) + adjustement;

    },

    getElmRect = (elm) => {

        let elmRect = elm.getBoundingClientRect(), // returns the size (width, height) of the element and its position (top, bottom)relative to viewport!

            elmHeight = getComputedHeight(elm),

            docElmY = docElm.scrollTop,


            // this to get a fixed top value of the section in the document.
            //(0, 0) is moved to the topmost of the document instead of the topmost of the viewport

            elmCoors = {
                top: elmRect.top + docElmY,
                bttm: elmRect.top + docElmY + elmHeight
            };

        return elmCoors;

    },


    // Add class 'active' to section when near top of viewport


    // Scroll to anchor ID using scrollTO event


    // Inspired by https://medium.com/talk-like/detecting-if-an-element-is-in-the-viewport-jquery-a6a4405a3ea2
    // code adapted to my special use
    isLoadedInViewport = (elm) => {

        let winHeight = window.innerHeight,

            docElmY = docElm.scrollTop,

            elmHeight = getComputedHeight(elm),

            elmCoors = getElmRect(elm),

            //When scrollTop is used on the root element (the <html> element), the scrollY of the window is returned
            // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop

            winCoors = {
                top: docElmY,
                bttm: docElmY + winHeight
            };


        return winCoors.top <= elmCoors.top && winCoors.bttm + elmHeight / 2 >= elmCoors.bttm || // element loaded in the viewport, or its half is visible

            winCoors.top < elmCoors.bttm && winCoors.top > elmCoors.top; // a part of element is still visible in the viewport

    },


    animate = (elem, className) => {

        if (isLoadedInViewport(elem)) {

            addClass.call(elem, className)
        }
    }


export {
    animate,
    getElmRect,
    addClass
}