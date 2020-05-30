'use strict';

const Category = require('../models/categories');
const Boom = require('@hapi/boom');

const Categories = {
  find: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const categories = await Category.find();
      return categories;
    }
  },
  findOne: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      try {
        const category = await Category.findOne({ _id: request.params.id });
        if (!category) {
          return Boom.notFound('No Category with this id');
        }
        return category;
      } catch (err) {
        return Boom.notFound('No Category with this id');
      }
    }
  },

  create: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h) {
      const newCategory = new Category(request.payload);
      const category = await newCategory.save();
      if (category) {
        return h.response(category).code(201);
      }
      return Boom.badImplementation('error creating Category');
    }
  },

  deleteAll: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      await Category.deleteMany({});
      return { success: true };
    }
  },
  deleteOne: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const response = await Category.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1) {
        return { success: true };
      }
      return Boom.notFound('id not found');
    }
  }

};

module.exports = Categories;
