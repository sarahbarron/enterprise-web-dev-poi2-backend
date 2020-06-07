'use strict';

/*
User Schema to store a users name,email,password, number of poi's
 and scope (admin or user)
 */
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Boom = require('@hapi/boom');
const bcrypt =  require('bcrypt');


const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    numOfPoi: Number,
    scope: Array
});

// Check if the email address exists during authentication
userSchema.statics.findByEmail = function (email)
{
    return this.findOne({email: email});
};


// Compare passwords to check they match during authentication
userSchema.methods.comparePassword = async function (candidatePassword)
{
    // use bcrypt to compare hashed password with user input
    const isMatch = await bcrypt.compare(candidatePassword, this.password);

    if (!isMatch)
    {
        throw Boom.unauthorized('Password mismatch');
    }
    return this;
};

module.exports = Mongoose.model('User', userSchema);