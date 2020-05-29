'use strict';

/*
 Location strategy stores the longitude and latitude of a Poi
 */
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Boom = require('@hapi/boom');

const locationSchema = Schema({
  lat: Number,
  lng: Number
});

module.exports = Mongoose.model('Location', locationSchema);