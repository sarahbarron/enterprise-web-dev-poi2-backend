'use strict';

const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Poi Api Tests', function()
{
  let pois = fixtures.poi;
  let newPoi = fixtures.newPoi;
  let newPoi2 = fixtures.newPoi2;
  const poiService = new PoiService(fixtures.poiService);

  setup(async function ()
  {
    await poiService.deleteAllPois();
  });

  teardown(async function ()
  {
    await poiService.deleteAllPois();
  });

  test('create a poi', async function ()
  {
    const returnedPoi = await poiService.createPoi(newPoi);
    assert(_.some([returnedPoi], newPoi),
      'returnedPoi must be a subset of newPoi');
    assert.isDefined(returnedPoi._id);
  });

  test('get a single poi', async function ()
  {
    const p1 = await poiService.createPoi(newPoi);
    const p2 = await poiService.getPoi(p1._id);
    assert.deepEqual(p1, p2);
  });

  test('get invalid poi', async function ()
  {
    const p1 = await poiService.getPoi('1234');
    assert.isNull(p1);
    const p2 = await poiService.getPoi('429088498328490328490829489320');
    assert.isNull(p2);
  });

  //Delete a single Poi with its id
  test('delete a poi', async function ()
  {
    let p = await poiService.createPoi(newPoi);
    assert(p._id != null);
    await poiService.deleteOnePoi(p._id);
    p = await poiService.getPoi(p._id);
    assert(p==null);
  });

//  Delete all Pois
  test('delete all pois', async function ()
  {
    let p = await poiService.createPoi(newPoi);
    assert(p._id != null);
    let p2 = await poiService.createPoi(newPoi2);
    assert(p2._id != null);
    await poiService.deleteAllPois();
    const allPois = await poiService.getPois();
    assert.equal(allPois.length, 0);
  })

//  test to get all pois
  test('get all pois', async function ()
  {
    for(let p of pois){
      await poiService.createPoi(p);
    }
    const allPois = await poiService.getPois();
    assert.equal(allPois.length, pois.length);
  });


//  test to check tha the get method retrieves all pois
  test('get pois detail', async function ()
  {
    for(let p of pois){
      await poiService.createPoi(p);
    }
    const allPois = await poiService.getPois();
    for(var i=0; i<pois.length; i++)
    {
      assert(_.some([allPois[i]], pois[i])),
        'returnedPois must be a superset of the newPoi'
    }
  });

//  Test getting an empty array of pois
  test('get all pois empty', async function ()
  {
    const allPois = await poiService.getPois();
    assert.equal(allPois.length,0);
  });
})