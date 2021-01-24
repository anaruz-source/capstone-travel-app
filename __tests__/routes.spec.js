// this is a express nodsjs server test inspired by following website

// https://dev.to/nedsoft/testing-nodejs-express-api-with-jest-and-supertest-1km6

const regeneratorRuntime = require('regenerator-runtime/runtime')
const request = require('supertest')
const app = require('./../src/server/index')

describe('requesting express server using the route /trip/tripId/:tripId, which will call the getTripController and return tripId', () => {
    it('should create a new post', async () => { // it alias of test
        const res = await request(app)
            .get('/trip/tripId/60045af19242772e201e709a')
            
        expect(res.statusCode).toEqual(302) // redirection received user isn't connected
      
    })
})
