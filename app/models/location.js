'use strict';

/*
 Location strategy stores the longitude and latitude of a Poi
 */
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const categorySchema = Schema({
  lat: Number,
  lng: Number
});

module.exports = Mongoose.model('Location', categorySchema);