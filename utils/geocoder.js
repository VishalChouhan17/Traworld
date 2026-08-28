const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'nominatim', // Free open-source geocoding service
  httpAdapter: 'https',
  formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;