// this is a express nodsjs server test inspired by following website

// https://dev.to/nedsoft/testing-nodejs-express-api-with-jest-and-supertest-1km6

const regeneratorRuntime = require('regenerator-runtime/runtime')
const request = require('supertest')
const app = require('./../src/server/index')

describe('requesting express server using the route /trip/tripId/:tripId, which will call the getTripController and return tripId', () => {
    it('should create a new post', async () => { // it alias of test
        const res = await request(app)
            .get('/trip/tripId/6000742abe06614038be0bad')
            
        expect(res.statusCode).toEqual(200)
        expect(res.body).toMatchObject({_id: '6000742abe06614038be0bad'})
    })
})
