/***************** 
 * => https://developers.google.com/identity/sign-in/web/backend-auth
 * 
 * The criteria to be satisfied for a token to ve valid:

*-- The ID token is properly signed by Google. Use Google's public keys (available in JWK or PEM format) to verify the token's signature. 
*-- These keys are regularly rotated; examine the Cache-Control header in the response to determine when you should retrieve them again.
*-- The value of aud in the ID token is equal to one of your app's client IDs.
*-- This check is necessary to prevent ID tokens issued to a malicious app being used to access data about the same user on your app's backend server.
*-- The value of iss in the ID token is equal to accounts.google.com or https://accounts.google.com.
*-- The expiry time (exp) of the ID token has not passed.

*/
// Instead we can use google-auth-library which preforms above onbehalf of us

// npm i google-auth-library --save

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    return payload

}


module.exports = verify
