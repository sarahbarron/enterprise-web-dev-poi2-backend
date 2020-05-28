'use strict';

const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Location API tests', function () {

  let locations = fixtures.location;
  let newLocation = fixtures.newLocation;
  const poiService = new PoiService(fixtures.poiService);
  let newUser = fixtures.newUser;

  suiteSetup(async function() {
    await poiService.deleteAllUsers();
    const returnedUser = await poiService.createUser(newUser);
    const response = await poiService.authenticate(newUser);
  });

  suiteTeardown(async function() {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });

  setup(async function () {
    await poiService.deleteAllLocations();
  });

  teardown(async function ()
  {
    await poiService.deleteAllLocations();
  });

  test('create a location', async function () {
    const returnedLocation = await poiService.createLocation(newLocation);
    assert(_.some([returnedLocation], newLocation),
      'returnedLocation must be a superset of newLocation');
    assert.isDefined(returnedLocation._id);
  });

  test('get a single location', async function ()
  {
    const l1 = await poiService.createLocation(newLocation);
    const l2 = await poiService.getLocation(l1._id);
    assert.deepEqual(l1, l2);
  });

  test('get invalid location', async function ()
  {
    const l1 = await poiService.getLocation('1234');
    assert.isNull(l1)
    const l2 = await poiService.getLocation('429088498328490328490829489320')
    assert.isNull(l2);
  });

  test('delete a location', async function() {
    let l = await poiService.createLocation(newLocation);
    assert(l._id != null);
    await poiService.deleteOneLocation(l._id);
    l = await poiService.getLocation(l._id);
    assert(l==null);
  });


  test('get all locations', async function ()
  {
    for(let l of locations){
      await poiService.createLocation(l);
    }
    const allLocations = await poiService.getLocations();
    assert.equal(allLocations.length, locations.length);
  });

  test('get locations detail', async function ()
  {
    for(let l of locations){
      await poiService.createLocation(l);
    }
    const allLocations = await poiService.getLocations();
    for (var i=0; i<locations.length; i++)
    {
      assert(_.some([allLocations[i]], locations[i]),
        'returnedLocation must be a superset of the newLocation')
    }
  });
  test('get all locations empty', async function ()
  {
    const allLocations = await poiService.getLocations();
    assert.equal(allLocations.length, 0);
  });
});