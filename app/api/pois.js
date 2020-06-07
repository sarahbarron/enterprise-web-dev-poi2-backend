'use strict';

const Poi = require('../models/poi');
const Boom = require('@hapi/boom');
const Category = require('../models/categories');
const Location = require('../models/location');
const Image = require('../models/image');
const utils = require('./utils');
const ObjectId = require('mongodb').ObjectID;
const Joi = require('@hapi/joi');
const PoiUtil = require('../utils/poi-util');

const Pois = {

  // Find all pois
  find: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      try
      {
        const pois = await Poi.find().populate('category').populate('location').populate('image').populate('user').lean();
        return pois;
      } catch (err)
      {
        return Boom.badImplementation('error fetching');
      }

    }
  },

  // Find One Poi
  findOne: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      try
      {
        const poi = await Poi.findOne({ _id: request.params.id }).populate('user').populate('category').populate('location').populate('image').lean();
        if (!poi)
        {
          return Boom.notFound('No Pois with this Id');
        }
        return poi;
      } catch (err)
      {
        return Boom.notFound('No Pois with this Id');
      }
    }
  },

  // Find pois by user Id
  findByUser: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      const userId = utils.getUserIdFromRequest(request);
      const pois = await Poi.find({ user: userId }).populate('location').populate('category').populate('image').lean();
      return pois;
    }
  },


  // finds pois by the category id
  findByCategory: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      const pois = await Poi.find({ category: request.params.id }).populate('location').populate('category').populate('image').lean();
      return pois;
    }
  },

//  Create a Pois
  create: {
    auth: {
      strategy: 'jwt'
    },

    /* Joi validation of fields if any errors return a boom
      message to the user/admin */
    validate: {
      payload: {
        name: Joi.string().required(),
        category: Joi.object().required(),
        description: Joi.string().allow('').allow(null),
        location: Joi.object().required(),
        image: Joi.object().required()
      },
      options: {
        abortEarly: false
      }
    },

    handler: async function(request, h)
    {
      let poi = new Poi(request.payload);
      const userId = utils.getUserIdFromRequest(request);
      poi.user = userId;

      let image = await Image.findOne({ _id: request.payload.image._id });
      if (!image)
      {
        return Boom.notFound('No Category with this id');
      }
      poi.image = image._id;


      let location = await Location.findOne({ _id: request.payload.location._id });
      if (!location)
      {
        return Boom.notFound('No Location with this id');
      }
      poi.location = location._id;

      const category = await Category.findOne({ _id: request.params.id });
      if (!category)
      {
        return Boom.notFound('No Category with this id');
      }
      poi.category = category._id;


      poi = await poi.save();
      return poi;
    }
  },

  // Add an image to a poi
  addImage: {

    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      let poi = await Poi.findOne({ _id: request.payload.poi_id });
      poi.image.push(ObjectId(request.payload.img_id));
      await poi.save();
      poi = await Poi.findOne({ _id: request.payload.poi_id }).populate('category').populate('location').populate('image').lean();
      return poi;
    }
  },

//  delete all pois
  deleteAll: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      await Poi.deleteMany({});
      return { success: true };
    }
  },

//  delete one
  deleteOne: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      const response = await PoiUtil.deletePoi(request.params.id);
      // const response = await Poi.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1)
      {
        return { success: true };
      }
      return Boom.notFound('Id not found');
    }
  },

  // update a poi
  update: {
    auth: {
      strategy: 'jwt'
    },

    handler: async function(request, h)
    {
      try
      {
        const userEdit = request.payload;
        const poi_id = request.params.id;
        const poi = await Poi.findById(poi_id);
        poi.name = userEdit.name;
        poi.category = userEdit.category;
        poi.description = userEdit.description;
        await poi.save();
        return poi;
      } catch (err)
      {
        return h.view('home', { errors: [{ message: err.message }] });
      }
    }
  }
};
module.exports = Pois;