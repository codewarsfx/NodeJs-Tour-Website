"use strict";

//intergration of mapbox api

/* eslint-disable*/
var locations = JSON.parse(document.querySelector('.section-map').dataset.location);
var accessToken = 'pk.eyJ1IjoiY29kZXdhcnNmeCIsImEiOiJjbDBiMmNpdnMwcHY0M2NycTFtN245dXVnIn0.eRPwZ8BcirV0flbGVTFjrA';
console.log(mapboxgl);
mapboxgl.accessToken = accessToken;
var map = new mapboxgl.Map({
  container: 'map',
  // Replace YOUR_STYLE_URL with your style URL.
  style: 'mapbox://styles/codewarsfx/cl0b3mxc2007a15lba9ku6tn0',
  center: locations[0].coordinates,
  zoom: 10.7
});
console.log(locations);