# Capstone travel app
Named it CAPTRIP, This app is built from scratch piece by piece, brick by brick, using MVC (Model Vue Controller) pattern. Model interacts with Mongodb documents, vue based on twig template engine, controller is the leader of the orchestra, fetching data from database using models, building vues using twig template engine.
# How app works

This app pulls data from several APIs:

1. [geoNames](http://www.geonames.org/) The GeoNames geographical database covers all countries and contains over eleven million placenames that are available for download free of charge.

2. [weatherbit](https://www.weatherbit.io/api/weather-forecast-16-day)
16 days forecast , This API returns a 16 day forecast in 1 day intervals from any point on the planet.

3. [pixabay API](https://pixabay.com/api/docs/) Pixabay API, which gives you access to over 2,1 million photos, illustrations, vector graphics, and videos - for free.

4. [rest countries](https://restcountries.eu/) Information about countries via a RESTful API

5. [Algolia autocompleter](//community.algolia.com/places/documentation.html#api-options-container) Algolia Places is a geocoder providing a fast, distributed and easy way to use an address search autocomplete on your website

6. [Leaflet](https://leafletjs.com/) Leaflet is the leading open-source JavaScript library for mobile-friendly interactive maps. scripts based on [algolia examples](https://community.algolia.com/places/examples.html)

7. [Geocoding API](https://developer.mapquest.com/documentation/geocoding-api/address/get/) The geocoding service enables you to take an address and get the associated latitude and longitude.

8. [oAuth2](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow) from google client and server side. server side using [google-auth-library](https://www.npmjs.com/package/google-auth-library)


## usage 
> step 1
Only homepage is available for offline visitors, to create trip, destinations, places, to add tasks to a todo List a connection is required

available for all
![home page](https://github.com/anaruz-source/captrip/blob/[branch]/image.jpg?raw=true)


> homepage