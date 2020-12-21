// https://developers.google.com/identity/sign-in/web/sign-in

import fetchAny from './helpers'

const googleSignInLib =  { //creating script and meta tags to append, we use ',' operateur which is retunning the last value

        script : (function () { const script = document.createElement('script')
                                script.src = 'https://apis.google.com/js/platform.js'
                                return script
                             })(),
        meta : (function () {
        
        const meta = document.createElement('meta')
        
        meta.name = 'google-signin-client_id',
        
        meta.content = '1067451132113-699bn9q2edbva9rc8grh3nk45tm0d0ia.apps.googleusercontent.com'
        
        return meta
    
    })()

},

onSignIn = async (googleUser) => {

    
        const profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
       

    const idToken = googleUser.getAuthResponse().id_token; // token verification 

    const options = {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: profile.getName(),
            email: profile.getEmail(),
            avatar: profile.getImageUrl(),
            idToken: idToken
        })
    }
    try {
        const data = await fetchAny('/users/outer', options)

        console.log(data)
    } catch (error) {
        console.log(error)
    }
  
},

signOut = () => {

    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

export { googleSignInLib, onSignIn, signOut}