'use strict';

const Image = require('../models/image');
const Boom = require('@hapi/boom');
const Utils = require('../utils/image-store');
const Images = {
  find: {
    auth: false,
    handler: async function(request, h) {
      const images = await Image.find();
      return images;
    }
  },
  findOne: {
    auth: false,
    handler: async function(request, h) {
      try {
        const image = await Image.findOne({ _id: request.params.id });
        if (!image) {
          return Boom.notFound('No Image with this id');
        }
        return image;
      } catch (err) {
        return Boom.notFound('No Image with this id');
      }
    }
  },


  create: {
    auth: false,
    handler: async function(request, h) {
      const newImage = new Image(request.payload);
      const image = await newImage.save();
      if (image) {
        return h.response(image).code(201);
      }
      return Boom.badImplementation('error creating Image');
    }
  },

  deleteAll: {
    auth: false,
    handler: async function(request, h) {
      await Image.deleteMany({});
      return { success: true };
    }
  },
  deleteOne: {
    auth: false,
    handler: async function(request, h) {
      const response = await Image.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1) {
        return { success: true };
      }
      return Boom.notFound('id not found');
    }
  }

};

module.exports = Images;
