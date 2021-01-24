// https://developers.google.com/identity/sign-in/web/sign-in


const googleSignInLib = { //creating script and meta tags to append

    script: (function () {
        const script = document.createElement('script')
        script.src = 'https://apis.google.com/js/platform.js'
        return script
    })(),
    meta: (function () {

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
                userId: Client.getItem('userId'),
                idToken: idToken
            })
        }
        try {
            const data = await Client.fetchAny('http://localhost:3030/users/outer', options)

            // Using Client Library

            Client.addItem('user', data) // saving user locally
            Client.addItem('userId', data._id) // saving Id for trips bindings

            Client.handleSession()

        }
        catch (error) {
            console.log(error)
        }

    },

    signOut = () => {

        let auth2 = null

        console.log(gapi.auth2)

        if (!gapi.auth2) { // if we're in a page where gapi auth isn't initiated! but should click two times to get disconnected 

            gapi.load('auth2', function () {
                gapi.auth2.init({
                    client_id: '1067451132113-699bn9q2edbva9rc8grh3nk45tm0d0ia.apps.googleusercontent.com'
                })

                auth2 = gapi.auth2.getAuthInstance()

            });
        }
        else {

            auth2 = gapi.auth2.getAuthInstance();

        }

        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
    }

export {
    googleSignInLib,
    onSignIn,
    signOut
}