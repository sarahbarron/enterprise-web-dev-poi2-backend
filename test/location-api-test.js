'use strict';

const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

/*
Test Suite for the Location API
 */
suite('Location API tests', function ()
{

  this.timeout(5000);
  let locations = fixtures.location;
  let newLocation = fixtures.newLocation;
  const poiService = new PoiService(fixtures.poiService);
  let newUser = fixtures.newUser;
  let newUserAuth = {
    email: newUser.email,
    password: newUser.password
  }

  suiteSetup(async function()
  {
    await poiService.deleteAllUsers();
    const returnedUser = await poiService.createUser(newUser);
    const response = await poiService.authenticate(newUserAuth);
  });

  suiteTeardown(async function()
  {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });

  setup(async function()
  {
    await poiService.deleteAllLocations();
  });

  teardown(async function()
  {
    await poiService.deleteAllLocations();
  });

  // test creating a new location
  test('create a location', async function()
  {
    const returnedLocation = await poiService.createLocation(newLocation);
    assert(_.some([returnedLocation], newLocation),
      'returnedLocation must be a superset of newLocation');
    assert.isDefined(returnedLocation._id);
  });

  // test getting a single location
  test('get a single location', async function()
  {
    const l1 = await poiService.createLocation(newLocation);
    const l2 = await poiService.getLocation(l1._id);
    assert.deepEqual(l1, l2);
  });

  // test that an invalid location returns null
  test('get invalid location', async function()
  {
    const l1 = await poiService.getLocation('1234');
    assert.isNull(l1)
    const l2 = await poiService.getLocation('429088498328490328490829489320')
    assert.isNull(l2);
  });

  // test deleting a single location
  test('delete a location', async function()
  {
    let l = await poiService.createLocation(newLocation);
    assert(l._id != null);
    await poiService.deleteOneLocation(l._id);
    l = await poiService.getLocation(l._id);
    assert(l == null);
  });

  // Test deleting all locations
  test('delete all locations', async function()
  {
    for (let l of locations)
    {
      await poiService.createLocation(l);
    }
    let allLocations = await poiService.getLocations();
    assert.equal(allLocations.length, locations.length);
    await poiService.deleteAllLocations();
    allLocations = await poiService.getLocations();
    assert.equal(allLocations.length, 0);
  });

  // Test getting all locations
  test('get all locations', async function()
  {
    for (let l of locations)
    {
      await poiService.createLocation(l);
    }
    const allLocations = await poiService.getLocations();
    assert.equal(allLocations.length, locations.length);
  });

  // Test that a locations details are correct
  test('get locations detail', async function()
  {
    for (let l of locations)
    {
      await poiService.createLocation(l);
    }
    const allLocations = await poiService.getLocations();
    for (var i = 0; i < locations.length; i++)
    {
      assert(_.some([allLocations[i]], locations[i]),
        'returnedLocation must be a superset of the newLocation')
    }
  });

  // Test that the array is empty when there are no stored locations
  test('get all locations empty', async function()
  {
    const allLocations = await poiService.getLocations();
    assert.equal(allLocations.length, 0);
  });

  // Test updating a location
  test('update location', async function()
  {
    let location = await poiService.createLocation(newLocation);
    const locationId = location._id;
    const newCoordinates = {
      lat: 40.4,
      lng: -5.3
    }
    location = await poiService.updateLocation(locationId, newCoordinates);
    assert(_.some([location, newCoordinates]), 'updateLocation must' +
      ' be a superset of the newCoordinates');
  });
});

