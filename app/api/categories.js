'use strict';

const Category = require('../models/categories');
const Boom = require('@hapi/boom');
const Poi = require('../models/poi');
const PoiUtils = require('../utils/poi-util');

// Categories - categories for greenways and trails
const Categories = {

  // Find all categories
  find: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      const categories = await Category.find();
      return categories;
    }
  },

  // find one category with category id
  findOne: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      try
      {
        const category = await Category.findOne({ _id: request.params.id });
        if (!category)
        {
          return Boom.notFound('No Category with this id');
        }
        return category;
      } catch (err)
      {
        return Boom.notFound('No Category with this id');
      }
    }
  },

  // create a category
  create: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      const newCategory = new Category(request.payload);
      const category = await newCategory.save();
      if (category)
      {
        return h.response(category).code(201);
      }
      return Boom.badImplementation('error creating Category');
    }
  },

  // delete all categories
  deleteAll: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      await Category.deleteMany({});
      return { success: true };
    }
  },

  // delete one category
  deleteOne: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      const category_id = request.params.id;
      const pois = await Poi.find({ category: category_id });
      if (pois.length > 0)
      {
        let i;
        for (i = 0; i < pois.length; i++)
        {
          let poi_id = pois[i]._id;
          PoiUtils.deletePoi(poi_id);

        }
      }
      const response = await Category.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1)
      {
        return { success: true };
      }
      return Boom.notFound('id not found');
    }
  }

};

module.exports = Categories;
