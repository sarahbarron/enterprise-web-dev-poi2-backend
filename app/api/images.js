'use strict';

const Image = require('../models/image');
const Boom = require('@hapi/boom');
const Utils = require('../utils/image-store');
const imageStore = require('../utils/image-store');
const Poi = require('../models/poi');

// Images - pois can hold many images
const Images = {
  // find all images
  find: {
    auth: false,
    handler: async function(request, h)
    {
      const images = await Image.find();
      return images;
    }
  },

  // find one image
  findOne: {
    auth: false,
    handler: async function(request, h)
    {
      try
      {
        const image = await Image.findOne({ _id: request.params.id });
        if (!image)
        {
          return Boom.notFound('No Image with this id');
        }
        return image;
      } catch (err)
      {
        return Boom.notFound('No Image with this id');
      }
    }
  },


  // create an image
  create: {
    auth: false,
    handler: async function(request, h)
    {
      const newImage = new Image(request.payload);
      const image = await newImage.save();
      if (image)
      {
        return h.response(image).code(201);
      }
      return Boom.badImplementation('error creating Image');
    }
  },

  // delete all images
  deleteAll: {
    auth: false,
    handler: async function(request, h)
    {
      await Image.deleteMany({});
      return { success: true };
    }
  },

  // delete one image
  deleteOne: {
    auth: false,
    handler: async function(request, h)
    {
      const poi_id = request.params.poi_id;
      const img_id = request.params.img_id;
      const response = await imageStore.deleteImage(poi_id, img_id);
      // const response = await Image.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1)
      {
        return { success: true };
      }
      return Boom.notFound('id not found');
    }
  }

};

module.exports = Images;
