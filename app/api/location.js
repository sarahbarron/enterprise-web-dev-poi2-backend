'use strict';

const Location = require('../models/location');
const Boom = require('@hapi/boom');
// Location of a poi
const Locations = {

  // find all locations
  find: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      const locations = await Location.find();
      return locations;
    }
  },

  // find one location
  findOne: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      try
      {
        const location = await Location.findOne({ _id: request.params.id });
        if (!location)
        {
          return Boom.notFound('No location with this id');
        }
        return location;
      } catch (err)
      {
        return Boom.notFound('No location with this id');
      }
    }
  },

  // create a location
  create: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      const newLocation = new Location(request.payload);
      const location = await newLocation.save();
      if (location)
      {
        return h.response(location).code(201);
      }
      return Boom.badImplementation('error creating location');
    }
  },

  // delete all locations
  deleteAll: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      await Location.deleteMany({});
      return { success: true };
    }
  },

  // delete one location
  deleteOne: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      const response = await Location.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1)
      {
        return { success: true };
      }
      return Boom.notFound('id not found');
    }
  },

  // update a location
  update: {
    auth: {
      strategy: 'jwt'
    },
    handler: async function(request, h)
    {
      const userEdit = request.payload;
      const location = await Location.findById(request.params.id);
      location.lat = userEdit.lat;
      location.lng = userEdit.lng;
      await location.save();
      return location;
    }

  }

};

module.exports = Locations;
