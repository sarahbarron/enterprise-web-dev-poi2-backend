'use strict';

const Poi = require('../models/poi');
const Boom = require('@hapi/boom');
const Category = require('../models/categories');
const Location = require('../models/location');
const Image = require('../models/image');
const utils = require('./utils');
const ObjectId = require('mongodb').ObjectID;

const Pois = {

  // Find all pois
  find: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h)
    {
      try
      {
        const pois = await Poi.find().populate('category').populate('location').populate('image').lean();
        return pois;
      } catch (err)
      {
        return Boom.badImplementation('error fetching');
      }

    }
  },

  // Find One Pois
  findOne: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h)
    {
      try
      {
        const poi = await Poi.findOne({ _id: request.params.id }).populate('category').populate('location').populate('image').lean();
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
      strategy: 'jwt',
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
      strategy: 'jwt',
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
      strategy: 'jwt',
    },
    handler: async function(request, h)
    {
      const userId = utils.getUserIdFromRequest(request);
      let poi = new Poi(request.payload);

      let image = await Image.findOne({ _id: request.payload.image._id });
      if (!image)
      {
        poi.image = null;
      }
      else
      {
        poi.image = image._id;
      }

      let location = await Location.findOne({ _id: request.payload.location._id });
      if (!location)
      {
        poi.location = null;

      }
      else
      {
        poi.location = location._id;
      }
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

  addImage: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h)
    {
      let poi = await Poi.findOne({ _id: request.payload.poi_id });
      poi.image.push(ObjectId(request.payload.img_id));
      await poi.save();
      poi = await Poi.findOne({ _id: request.payload.poi_id }).populate("category").populate("location").populate("image").lean();
      return poi;
    }
  },

//  delete all pois
  deleteAll: {
    auth: {
      strategy: 'jwt',
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
      strategy: 'jwt',
    },
    handler: async function(request, h)
    {
      const response = await Poi.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1)
      {
        return { success: true };
      }
      return Boom.notFound('Id not found');
    }
  },

  update: {
    auth: {
      strategy: 'jwt',
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
          return h.view('home', {errors: [{message: err.message}]});
        }
    }
  }
}
module.exports = Pois;