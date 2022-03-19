"use strict";

// import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
// mapboxgl.accessToken = 'pk.eyJ1IjoiY29kZXdhcnNmeCIsImEiOiJjbDBiMmVkYncwNmtqM2l0MzBlZnRtNng2In0.Q3H9inYOo0d5B-kP-N09Bw';
// const map = new mapboxgl.Map({
//     container: 'map', 
//     style: 'mapbox://styles/mapbox/streets-v11', // style URL
//     center: [-74.5, 40], // starting position [lng, lat]
//     zoom: 9 // starting zoom
// });

/* eslint-disable */
mapboxgl.accessToken = 'pk.eyJ1IjoiY29kZXdhcnNmeCIsImEiOiJjbDBiMmVkYncwNmtqM2l0MzBlZnRtNng2In0.Q3H9inYOo0d5B-kP-N09Bw';
var map = new mapboxgl.Map({
  container: 'map',
  // container ID
  style: 'mapbox://styles/mapbox/streets-v11',
  // style URL
  center: [-74.5, 40],
  // starting position [lng, lat]
  zoom: 9 // starting zoom

});