'use strict';

const Poi = require('../models/poi');
const Boom = require('@hapi/boom');

const Pois = {

  // Find all pois
  find: {
    auth: false,
    handler: async function(request, h){
      const pois = await Poi.find();
      return pois;
    }
  },

  // Find One Pois
  findOne:{
    auth: false,
    handler: async function(request, h){
      try{
        const poi = await Poi.findOne({_id: request.params.id});
        if(!poi)
        {
          return Boom.notFound('No Pois with this Id');
        }
        return poi;
      }catch(err){
        return Boom.notFound('No Pois with this Id');
      }
    }
  },

//  Create a Pois
  create: {
    auth:false,
    handler: async function(request, h){
      const newPoi = new Poi(request.payload);
      const poi = await newPoi.save();
      if(poi)
      {
        return h.response(poi).code(201);
      }
      return Boom.badImplementation('error creating poi');
    }
  },

//  delete all pois
  deleteAll:{
    auth: false,
    handler: async function(request, h){
      await Poi.deleteMany({});
      return {success: true};
    }
  },

//  delete one
  deleteOne:{
    auth: false,
    handler: async function(request, h){
      const response = await Poi.deleteOne({_id: request.params.id});
      if (response.deletedCount == 1)
      {
        return {success: true};
      }
      return Boom.notFound('Id not found');
    }
  }
}

module.exports = Pois;