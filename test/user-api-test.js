'use strict';

const chai = require('chai');
const assert = require('chai').assert;
const chaiExclude = require('chai-exclude');
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

/*
Test Suite for a User
 */
suite('User API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;
  let newUserAuth = {
    email: newUser.email,
    password: newUser.password
  }
  const poiService = new PoiService(fixtures.poiService);
  chai.use(chaiExclude);

  suiteSetup(async function () {
    await poiService.deleteAllUsers();
  });
  suiteTeardown(async function() {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });

  setup(async function () {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });

  teardown(async function ()
  {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });

  // Test creating a user
  test('create a user', async function () {
    const returnedUser = await poiService.createUser(newUser);
    assert.deepEqualExcluding(returnedUser.user, newUser, ['password','__v', '_id', 'scope', 'numOfPoi']);
    assert.isDefined(returnedUser.user._id);
  });

  // Test getting one single user
  test('get user', async function () {
    const u1 = await poiService.createUser(newUser);
    await poiService.authenticate(newUserAuth);
    const u2 = await poiService.getUser(u1.user._id);
    assert.deepEqual(u1.user, u2);
  });

  // Test getting an invalid user
  test('get invalid user', async function () {
    await poiService.createUser(newUser);
    await poiService.authenticate(newUserAuth);
    const u1 = await poiService.getUser('1234');
    assert.isNull(u1);
    const u2 = await poiService.getUser('012345678901234567890123');
    assert.isNull(u2);
  });

  // Find a single user
  test('find one user', async function ()
  {
    const user = await poiService.createUser(newUser);
    await poiService.authenticate(newUserAuth);
    const returnedUser = await poiService.getUser(user.user._id);
    assert.deepEqual(user.user, returnedUser);
  });
  // Test deleting a user
  test('delete a user', async function () {
    let u = await poiService.createUser(newUser);
    await poiService.authenticate(newUserAuth);
    assert(u.user._id != null);
    await poiService.deleteOneUser(u.user._id);
    u = await poiService.getUser(u.user._id);
    assert(u == null);
  });

  // Test getting all users
  test('get all users', async function () {
    await poiService.createUser(newUser);
    await poiService.authenticate(newUserAuth);
    for (let u of users) {
      await poiService.createUser(u);
    }
    const allUsers = await poiService.getUsers();
    assert.equal(allUsers.length, users.length + 1);
  });

  // Test getting all users when there are no users registered
  test('get all users empty', async function () {
    await poiService.createUser(newUser);
    await poiService.authenticate(newUserAuth);
    const allUsers = await poiService.getUsers();
    assert.equal(allUsers.length, 1);
  });

  // Test the users details are correct
  test('get users detail', async function () {
    const user = await poiService.createUser(newUser);
    await poiService.authenticate(newUserAuth);
    for (let u of users) {
      await poiService.createUser(u);
    }
    const allUsers = await poiService.getUsers();

    const testUser = {
      firstName: user.user.firstName,
      lastName: user.user.lastName,
      email: user.user.email,
      password: user.user.password
    };
    users.unshift(testUser);
    for (var i = 0; i < users.length; i++) {
      assert.deepEqualExcluding(allUsers[i], users[i], ['password','__v', '_id', 'scope', 'numOfPoi']);
    }
  });

});