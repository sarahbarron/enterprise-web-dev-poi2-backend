'use strict';
const Poi = require('../models/poi');
const Boom = require('@hapi/boom');

const Pois = {
  find: {
    auth: false,
    handler: async function(request, h)
    {
      try
      {
        const pois = await Poi.find();
        if (!pois)
        {
          return Boom.notFound('No Pois found');
        }
        return pois;
      }catch (e)
      {
        return Boom.notFound('No Pois found');
      }
    }
  },

  findOne: {
    auth: false,
    handler: async function(request, h)
    {
      try
      {
        const poi = await Poi.findOne({ _id: request.params.id });
        if (!poi)
        {
          return Boom.notFound('There is no POI with this Id');
        }
        return poi;
      } catch (err)
      {
        return Boom.notFound('There is no POI with this Id');
      }
    }
  }

};
module.exports = Pois;