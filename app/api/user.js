'use strict';

const User = require('../models/user');
const Boom = require('@hapi/boom');
const utils = require('./utils');
const Joi = require('@hapi/joi');

const Users = {

  find: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const users = await User.find();
      return users;
    }
  },

  findOne: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      try {
        const user = await User.findOne({ _id: request.params.id });
        if (!user) {
          return Boom.notFound('No User with this id');
        }
        return user;
      } catch (err) {
        return Boom.notFound('No User with this id');
      }
    }
  },

  create: {
    auth: false,
    // Joi Validation of fields
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required(),
      },
      options: {
        abortEarly: false
      },
    },

    handler: async function(request, h) {
      const newUser = new User(request.payload);
      const user = await newUser.save();
      if (user) {
        return h.response(user).code(201);
      }
      return Boom.badImplementation('error creating user');
    }
  },

  deleteAll: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      await User.deleteMany({});
      return { success: true };
    }
  },

  deleteOne: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const user = await User.deleteOne({ _id: request.params.id });
      if (user) {
        return { success: true };
      }
      return Boom.notFound('id not found');
    }
  },

  authenticate: {
    auth: false,

    // Joi Validation of fields
    validate: {
      payload: {
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required(),
      },
      options: {
        abortEarly: false
      },
    },
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ email: request.payload.email });
        if (!user) {
          return Boom.unauthorized('User not found');
        } else if (user.password !== request.payload.password) {
          return Boom.unauthorized('Invalid password');
        } else {
          const token = utils.createToken(user);
          return h.response({ success: true, token: token }).code(201);
        }
      } catch (err) {
        return Boom.notFound('internal db failure');
      }
    },
  },
};

module.exports = Users;