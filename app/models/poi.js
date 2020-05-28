'use strict';

/*
Point of Interest Schema stores the POIs name, description,
location (latitude and longitude values) and a reference to the
user, category and images it is associated with
*/
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const PoiSchema = new Schema({

    name: String,
    description: String,
    location: {
        type: Schema.Types.ObjectID,
        ref: 'Location'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: Schema.Types.ObjectID,
        ref: 'Category',
    }
});

module.exports = Mongoose.model('Poi', PoiSchema);