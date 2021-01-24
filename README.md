# Capstone travel app

[![version](https://img.shields.io/badge/version-v1.1.0-brightgreen)]() 
[![build](https://img.shields.io/badge/build-passing-brightgreen)]() 

[![license](https://img.shields.io/badge/licence-MIT-brightgreen)](https://opensource.org/licenses/MIT) 

Named it CAPTRIP, This app is built from scratch piece by piece, brick by brick, using MVC (Model Vue Controller) pattern. Model interacts with Mongodb documents, vue based on twig template engine, controller is the leader of the orchestra, fetching data from database (noSQL Mongodb) using models, building vues using twig template engine.
# How app works

This app pulls data from several APIs: (defintions from APIs' websites)

1. [geoNames](http://www.geonames.org/) The GeoNames geographical database covers all countries and contains over eleven million placenames that are available for download free of charge.

2. [weatherbit](https://www.weatherbit.io/api/weather-forecast-16-day)
16 days forecast , This API returns a 16 day forecast in 1 day intervals from any point on the planet.

3. [pixabay API](https://pixabay.com/api/docs/) Pixabay API, which gives you access to over 2,1 million photos, illustrations, vector graphics, and videos - for free.

4. [rest countries](https://restcountries.eu/) Information about countries via a RESTful API

5. [Algolia autocompleter](//community.algolia.com/places/documentation.html#api-options-container) Algolia Places is a geocoder providing a fast, distributed and easy way to use an address search autocomplete on your website

6. [Leaflet](https://leafletjs.com/) Leaflet is the leading open-source JavaScript library for mobile-friendly interactive maps. scripts based on [algolia examples](https://community.algolia.com/places/examples.html)

7. [Geocoding API](https://developer.mapquest.com/documentation/geocoding-api/address/get/) The geocoding service enables you to take an address and get the associated latitude and longitude.

8. [oAuth2](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow) from google client and server side. server side using [google-auth-library](https://www.npmjs.com/package/google-auth-library)

9. [Library js-datepicker](https://www.npmjs.com/package/js-datepicker)
## usage 
> step 1

Only homepage is available for offline visitors, to create trip, destinations, places, to add tasks to a todo List a connection is required

Two connection method exist: with an email or using Google oAuth2 for both sign in and sign up

* Available for all

![home page any ](https://github.com/anaruz-source/capstone-travel-app/blob/master/readmeassets/anyvisitors.png?raw=true)



* Available for connected user (trips, profile show up, logout icon)


![home connected](https://github.com/anaruz-source/capstone-travel-app/blob/master/readmeassets/connected.png?raw=true)

to Visualize profile, click on the link


![home connected](https://github.com/anaruz-source/capstone-travel-app/blob/master/readmeassets/profile.png?raw=true)

Avatar from google, there's also a default one for email users!

A ```session is of 60min duration```, after that it will be shutdown from server side no matter what is user is active or not (it would be good to reinit that countdown later on)

> step 2 

Adding a trip

* trying to add trip offline (error! please sign in)

![please sign in error](https://github.com/anaruz-source/capstone-travel-app/blob/master/readmeassets/please.png?raw=true)

* User is connected

Start typing in input form, Algolia autocompleter API will suggest places starting with the initials typed in. picture below:

![Algolia autocompleter](https://github.com/anaruz-source/capstone-travel-app/blob/master/readmeassets/algoliaauto.png?raw=true)

after all necessary APIs are fetch out, app redirects to /trips/userId/xxxxxxxxxxxxxxxxx page. This page could be accessed too, click the trips link near to profile link.


![trips page](https://github.com/anaruz-source/capstone-travel-app/blob/master/readmeassets/trips.png?raw=true)

Big "+" sign near to My Trips is to add new trips to the page!
Small "+" sign in the righthand side, is to show if accordion is expanded or not!

if clicked somewhere in the trip, it will its accordion containing trips. small '-' sign shows to show that the accordion is expanded.

![trips page](https://github.com/anaruz-source/capstone-travel-app/blob/master/readmeassets/destinations.png?raw=true)

All trips and destinations have 4 icons that displays onhover on the righthand side. almost links work except edit trip, (title of icon display on hover)
trip icons: add destination, edit trip (doesn't work), print, and delete
destination icons: add place, add task, print and delete

Each destination have 6 tabs. for places on map, click ``'put places on map'`` to show places marker on the map. (leaflet API).

There'are dynamic forms that displays on clicking their link (add trip, dest, place, task), hides when clicking outside or if the request completed successfully, otherwise the form remains displayed with an error on its head!

# Standing out addons!

- end date added, trip length displayed!

- Obscure localities code added but not tested (it's their in the code /js/pixaAPICall.js file, else condition, using totalHits param), a flag 'obscure' is added for destination entity in the mongodb, it's true for obscure destination, we can use to achieve some behaviour.

- User could add many destinations to it's trip. he can plan many trips, but we don't handle overlapping trips' dates. js-datapicker used an id to link both start and enddate, also we initiate it to current date to prevent going back in time.

-  Allow the user to add hotel and/or flight data. I substitued it with places instead using Algolia autocompleter, setting up LatLng of the destination object in Algolia autocompleter init object, doing such, it gives only places around that destination. hotels/flight might need using another API, which will need more development. adding names manually won't yield any usefulness.
Adding places or tasks, makes two operations: it adds them to the mongodb server, displays them immedialtely on the required tab and shows that latter.(handleTabsSwitching eventlistenrer)

- Integrate the REST Countries API to pull in data for the country being visited. (added) along with some useful other APIs. (Above)
- Allow the user to remove the trip. User can remove trips, destinations, places, tasks.

- Session storage is used istead of local storage, it's used to handle requests to the server using stored users' informations (userId mainly, provided by mongodb, _id ). Any request made from client side is checked in the server side, if session is valid, request is handled otherwiser server sends a redirect to the homepage!

- Pull the forecast for multiple days. atmost 7 days forecast are displayed. Our strategy is to pull 16 days, then shorlist to somedays starting from the trip's start date, stopping at the 7th forecast if any.

- Allow user to Print their trip and/or export to PDF. implemented for both trips and destinations, however the render isn't that perfect, more work should be done.

- Allow the user to add a todo list and/or packing list for their trip. add/remove implemented

- Allow the user to add additional trips: Sorting is handled by mongodb requests from older to recent (using start date). there's expired flag their but it's not used, I should submit project before it's late!!!!!!

## More standing out assets:

- Logo and favicon are there
- MVC Pattern
- multipage app using twig templates engine
- using noSQL DB (mongodb) with compass to hold user data, trips, destinations... 

-email validation, error message shows below text input using regex when user creation, indication error will appear below the input, disapears when email is set correctly
-password validation, error message shows below text input using regex, a Strong password should contain, Maj, Mins, digits, specials and it should be bigger or equal to 8 characters. (this indication error will appear just below input)

these latter doesn't prevent account from being created with weak and incorrectly formatted email addess. Improvements are to use same function to throw errors if password is weak or email isn't correctly formatted.

- places are shown on a map as marker with a hideable tooltip, click ``'put places on map'`` on 'places on map' destination tap, as below

![Map markers](https://github.com/anaruz-source/capstone-travel-app/blob/master/readmeassets/map.png?raw=true)
 
 ## MongoDB ERD (Entity Relationship Diagram)



Some items are not displayed for simplification

![Captrip DB ERD](https://github.com/anaruz-source/capstone-travel-app/blob/master/readmeassets/captrip-db-erd.png?raw=true)

-- 1 >* one-to-many relationship

-- 1<>1 one-to-one
# testing [![build](https://img.shields.io/badge/build-passing-brightgreen)]() 
 tests passed
![Jest build](https://github.com/anaruz-source/capstone-travel-app/blob/master/readmeassets/jest.png?raw=true)

# License
[MIT License](https://opensource.org/licenses/MIT)