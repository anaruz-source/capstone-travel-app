
// Compose function used to compose results between different APIs Calls
function compose (f,g)  { 

   return function(...args){

    return f(g(...args))
   }
}

 
// Function factory to  loop over all passed functions in param and compose them using the function above, from right to left
// example of call
// mixigFactory(f1, f2, f3, f4, f5)(arg1, arg2) => f1(f2(f3(f4(f5(arg1, arg2)))))

// https://stackoverflow.com/questions/63560126/javascript-using-compose-with-reduce

function mixingFactory (...fns){

    fns.reduce(compose)
}


function makeRequest(proto, options){

    
}

module.exports = mixingFactory