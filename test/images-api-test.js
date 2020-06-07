'use strict';

const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');


suite('Images Api Tests', function()
{
  let images = fixtures.image;
  let newImage = fixtures.newImage;
  const poiService = new PoiService(fixtures.poiService);
  let newUser = fixtures.newUser;

  suiteSetup(async function () {
    await poiService.deleteAllUsers();
    const returnedUser = await poiService.createUser(newUser);
    const response = await poiService.authenticate(newUser);
  });
  suiteTeardown(async function() {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });
  setup(async function ()
  {
    await poiService.deleteAllImages();
  });

  teardown(async function ()
  {
    await poiService.deleteAllImages();
  });

  // test the creation of an image
  test('create an image', async function ()
  {
    const returnedImage = await poiService.createImage(newImage);
    assert(_.some([returnedImage], newImage),
      'returnedImage must be a subset of newImage');
    assert.isDefined(returnedImage._id);
  });

  // test getting a single image
  test('get a single image', async function ()
  {
    const i1 = await poiService.createImage(newImage);
    const i2 = await poiService.getImage(i1._id);
    assert.deepEqual(i1, i2);
  });

  // test trying to get an invalid image
  test('get invalid image', async function ()
  {
    const i1 = await poiService.getImage('1234');
    assert.isNull(i1);
    const i2 = await poiService.getPoi('429088498328490328490829489320');
    assert.isNull(i2);
  });

  //Delete a single image with its id
  test('delete a image', async function ()
  {
    let i = await poiService.createImage(newImage);
    let p = await poiService.cre
    assert(i._id != null);
    await poiService.deleteOneImage(i._id);
    i = await poiService.getImage(i._id);
    assert(i==null);
  });

//  Delete all Image
  test('delete all images', async function ()
  {
    for(let i of images){
      await poiService.createImage(i);
    }
    await poiService.deleteAllImages();
    const allImages = await poiService.getImages();
    assert.equal(allImages.length, 0);
  })

//  test to get all images
  test('get all images', async function ()
  {
    for(let i of images){
      await poiService.createImage(i);
    }
    const allImages = await poiService.getImages();
    assert.equal(allImages.length, images.length);
  });


//  test to check tha the get method retrieves all images
  test('get images detail', async function ()
  {
    for(let i of images){
      await poiService.createImage(i);
    }
    const allImages = await poiService.getImages();
    for(var i=0; i<images.length; i++)
    {
      assert(_.some([allImages[i]], images[i])),
        'returnedImages must be a superset of the newImage'
    }
  });

//  Test getting an empty array of images
  test('get all images empty', async function ()
  {
    const allImages = await poiService.getImages();
    assert.equal(allImages.length,0);
  });

})