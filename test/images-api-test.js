'use strict';

const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

/*
Test Suite for the Images API
 */
suite('Images Api Tests', function()
{
  this.timeout(5000);
  let images = fixtures.image;
  let newImage = fixtures.newImage;
  const poiService = new PoiService(fixtures.poiService);
  let newUser = fixtures.newUser;
  let newUserAuth = {
    email: newUser.email,
    password: newUser.password
  }

  suiteSetup(async function () {
    await poiService.deleteAllUsers();
    const returnedUser = await poiService.createUser(newUser);
    const response = await poiService.authenticate(newUserAuth);
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

  // test an invalid image returns null
  test('get invalid image', async function ()
  {
    const i1 = await poiService.getImage('1234');
    assert.isNull(i1);
    const i2 = await poiService.getPoi('429088498328490328490829489320');
    assert.isNull(i2);
  });

  // test deleting a single image with its id and poi id
  test('delete an image', async function ()
  {
    const newCategory = fixtures.newCategory;
    const newLocation = fixtures.newLocation;
    const newImage = fixtures.newImage;
    const basicPoi = fixtures.newPoi;
    const image = await poiService.createImage(newImage);
    const location = await poiService.createLocation(newLocation);
    const category = await poiService.createCategory(newCategory);
    const newPoi = {
      "name": basicPoi.name,
      "description": basicPoi.description,
      "category": category,
      "location": location,
      "image": image
    }
    // create a poi and confirm the image has been saved
    let poi = await poiService.createPoi(category._id, newPoi);
    assert.isNotNull(poi.image[0]);

    let img_id = poi.image[0];
    // delete the image
    await poiService.deleteOneImage(poi._id, img_id);

    // get the poi and check that the image has been deleted from the
    // poi
    poi = await poiService.getPoi(poi._id);
    assert.equal(poi.image.length, 0);

    // get the image by its id and check that it returns null
    const img = await poiService.getImage(img_id);
    assert.isNull(img);
  });

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