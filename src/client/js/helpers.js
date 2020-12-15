function fillParams(key, val){ // inserts parameters on required place in the url string

    return this.replace(`${key}=`, `${key}=${val}`)
}

async function fetchAny (url, options){

    const response = await fetch(url, options);

    try {

        const data = await response.json();


        if ((data.cod && data.cod != '200') || (data[0] && data[0].cod && data[0].cod != '200')) throw new Error(data.message); // fetch doesn't throw in case a city not found! we don't want to fill endpoint with empty data:


        error.style.display = 'none';

        return data;

    } catch (err) {

        //   throw new Error(err.message);

        error.textContent = err.message;
        error.style.display = "block";


    }
}


function changeInputType( elem) {// used to change type of input from text to date, text used in order to style placerholder!
     
    if(elem.placeholder !='MM/DD/YYYY') return
    
     elem.type = 'date'

}

















export {fillParams, fetchAny, changeInputType}