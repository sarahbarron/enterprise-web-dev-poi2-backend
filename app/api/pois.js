'use strict';

const Poi = require('../models/poi');
const Boom = require('@hapi/boom');
const Category = require('../models/categories');
const utils = require('./utils');

const Pois = {

  // Find all pois
  find: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h){
      const pois = await Poi.find();
      return pois;
    }
  },

  // Find One Pois
  findOne:{
    auth: {
      strategy: 'jwt',
    },
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

  // finds pois by the category id
  findByCategory: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h){
      const pois = await Poi.find({category: request.params.id});
      return pois;
    }
  },

//  Create a Pois
  create: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h)
    {
      const userId = utils.getUserIdFromRequest(request);
      let poi = new Poi(request.payload);
      const category = await Category.findOne({ _id: request.params.id });
      if (!category)
      {
        return Boom.notFound('No Category with this id');
      }
      poi.category = category._id;
      poi.user = userId;
      poi = await poi.save();
      return poi;
    }
  },

//  delete all pois
  deleteAll:{
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h){
      await Poi.deleteMany({});
      return {success: true};
    }
  },

//  delete one
  deleteOne:{
    auth: {
      strategy: 'jwt',
    },
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