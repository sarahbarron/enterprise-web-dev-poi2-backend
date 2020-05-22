'use strict';
const Poi = require('../models/poi');

const Pois = {
  find: {
    auth: false,
    handler: async function(request, h) {
      const pois = await Pois.find();
      return pois;
    }
  },

};
module.exports = Pois;