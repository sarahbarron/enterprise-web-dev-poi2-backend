'use strict';

const Poi = require('../models/poi');
const Boom = require('@hapi/boom');
const Category = require('../models/categories');
const Location = require('../models/location');
const utils = require('./utils');

const Pois = {

  // Find all pois
  find: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h){
      try
      {
        const pois = await Poi.find().populate('category').populate('location').lean();
        return pois;
      }catch (err)
      {
        return Boom.badImplementation('error fetching');
      }

    }
  },

  // Find One Pois
  findOne:{
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h){
      try{
        const poi = await Poi.findOne({_id: request.params.id}).populate('category').populate('location').lean();
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

  // Find pois by user Id
  findByUser: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h){
      const userId = utils.getUserIdFromRequest(request);
      const pois = await Poi.find({user: userId}).populate('location').populate('category').lean();
      return pois;
    }
  },


  // finds pois by the category id
  findByCategory: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h){
      const pois = await Poi.find({category: request.params.id}).populate('location').populate('category').lean();
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
      const category = await Category.findOne({ _id: request.params.catid });
      if (!category)
      {
        return Boom.notFound('No Category with this id');
      }

      const location = await Location.findOne({_id: request.params.locid});
      if(!location)
      {
        return Boom.notFound('No location with this id');
      }
      poi.location = location._id;
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