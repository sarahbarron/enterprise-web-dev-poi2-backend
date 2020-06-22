'use strict';

const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');
const utils = require('../app/api/utils.js');

/*
Testing Suite for User Authentication
 */
suite('Authentication API tests', function () {

  // Some tests were timing out - so higher timeout rate set
  this.timeout(6000);
  let newUser = fixtures.newUser;
  let newUserAuth = {
    email: newUser.email,
    password: newUser.password
  }
  const poiService = new PoiService(fixtures.poiService);

  setup(async function () {
    await poiService.deleteAllUsers();
  });

  // Test that a user can be authenticated
  test('authenticate', async function () {
    await poiService.createUser(newUser);
    const response = await poiService.authenticate(newUserAuth);
    console.log(response);
    assert(response.success);
    console.log(response.success);
    assert.isDefined(response.token);
  });

  // Test to verify the token is working an the info stored in the
  // token represents the correct user.
  test('verify Token', async function () {
    const returnedUser = await poiService.createUser(newUser);
    const response = await poiService.authenticate(newUserAuth);
    const userInfo = utils.decodeToken(response.token);

    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });
});
