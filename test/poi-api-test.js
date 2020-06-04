'use strict';

const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');


suite('Poi Api Tests', function()
{
  let pois = fixtures.poi;
  let newCategory = fixtures.newCategory;
  let newLocation = fixtures.newLocation;
  let newPoi = fixtures.newPoi;
  let newUser = fixtures.newUser;
  const poiService = new PoiService(fixtures.poiService);

  suiteSetup(async function()
  {
    await poiService.deleteAllUsers();
    const returnedUser = await poiService.createUser(newUser);
    const response = await poiService.authenticate(newUser);
  });

  suiteTeardown(async function()
  {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });

  setup(async function()
  {
    await poiService.deleteAllPois();
    await poiService.deleteAllCategories();
  });

  teardown(async function()
  {
  });


  test('create a poi', async function()
  {
    const returnedCategory = await poiService.createCategory(newCategory);
    const returnedLocation = await poiService.createLocation(newLocation);
    await poiService.createPoi(returnedCategory._id, returnedLocation._id, pois[0]);
    const returnedPois = await poiService.getPois();
    assert.equal(returnedPois.length, 1);
    assert(_.some([returnedPois[0]], pois[0]),
      'returned poi must be a superset of poi');
  });

  test('create multiple pois', async function()
  {
    const returnedCategory = await poiService.createCategory(newCategory);
    const returnedLocation = await poiService.createLocation(newLocation);
    for (var i = 0; i < pois.length; i++)
    {
      await poiService.createPoi(returnedCategory._id, returnedLocation._id, pois[i]);
    }

    const returnedPois = await poiService.getPois();
    assert.equal(returnedPois.length, pois.length);
    for (var i = 0; i < pois.length; i++)
    {
      assert(_.some([returnedPois[i]], pois[i]),
        'returned pois must be a superset of poi');
    }
  });


  test('get a single poi', async function()
  {
    const returnedCategory = await poiService.createCategory(newCategory);
    const returnedLocation = await poiService.createLocation(newLocation);
    const p1 = await poiService.createPoi(returnedCategory._id, returnedLocation._id, pois[0]);
    const p2 = await poiService.getPoi(p1._id);
    assert.deepEqual(p1, p2);
  });

  test('get invalid poi', async function()
  {
    const p1 = await poiService.getPoi('1234');
    assert.isNull(p1);
    const p2 = await poiService.getPoi('429088498328490328490829489320');
    assert.isNull(p2);
  });

  //Delete a single Poi with its id
  test('delete a poi', async function()
  {
    const returnedCategory = await poiService.createCategory(newCategory);
    const returnedLocation = await poiService.createLocation(newLocation);
    let p =await poiService.createPoi(returnedCategory._id, returnedLocation._id, pois[0]);

    assert(p._id != null);
    await poiService.deleteOnePoi(p._id);
    p = await poiService.getPoi(p._id);
    assert(p == null);
  });


//  Delete all Pois
  test('delete all pois', async function()
  {
    const returnedCategory = await poiService.createCategory(newCategory);
    const returnedLocation = await poiService.createLocation(newLocation);
    for (let p of pois)
    {
      await poiService.createPoi(returnedCategory._id, returnedLocation._id, p);
    }
    let allPois = await poiService.getPois();
    assert.equal(allPois.length, pois.length);
    const deletedPois = await poiService.deleteAllPois();
    allPois = await poiService.getPois();
    assert.equal(allPois.length, 0);
  });

//  test to get all pois
  test('get all pois', async function()
  {
    const returnedCategory = await poiService.createCategory(newCategory);
    const returnedLocation = await poiService.createLocation(newLocation);
    for (let p of pois)
    {
      await poiService.createPoi(returnedCategory._id, returnedLocation._id, p);
    }
    const allPois = await poiService.getPois();
    assert.equal(allPois.length, pois.length);
  });


//  test to check tha the get method retrieves all pois
  test('get pois detail', async function()
  {
    const returnedCategory = await poiService.createCategory(newCategory);
    const returnedLocation = await poiService.createLocation(newLocation);
    for (let p of pois)
    {
      await poiService.createPoi(returnedCategory._id, returnedLocation._id, p);
    }
    const allPois = await poiService.getPois();
    for (var i = 0; i < pois.length; i++)
    {
      assert(_.some([allPois[i]], pois[i])),
        'returnedPois must be a superset of the newPoi'
    }
  });

//  Test getting an empty array of pois
  test('get all pois empty', async function()
  {
    const allPois = await poiService.getPois();
    assert.equal(allPois.length, 0);
  });

  test('create a poi and check user', async function()
  {
    const returnedCategory = await poiService.createCategory(newCategory);
    const returnedLocation = await poiService.createLocation(newLocation);
    await poiService.createPoi(returnedCategory._id, returnedLocation._id,pois[0]);
    const returnedPois = await poiService.getPois();
    assert.isDefined(returnedPois[0].user);

    const users = await poiService.getUsers();
    assert(_.some([users[0]], newUser), 'returnedUser must be a superset of newUser');
  });

  // test('find poi by user id', async function()
  // {
  //
  // });
  // test('find poi by category', async function()
  // {
  //
  // });
})