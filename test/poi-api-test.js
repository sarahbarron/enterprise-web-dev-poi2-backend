'use strict';

const chai = require('chai');
const chaiExclude = require('chai-exclude');
const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

/*
Test Suite for the Poi API
 */
suite('Poi Api Tests', function()
{
  // Some tests were timing out so higher timeout rate set
  this.timeout(6000);

  let pois = fixtures.poi;
  let newCategory = fixtures.newCategory;
  let newLocation = fixtures.newLocation;
  let newImage = fixtures.newImage;
  let basicPoi = fixtures.newPoi;
  let returnedUser;
  let newUser = fixtures.newUser;
  let newUserAuth = {
    email: newUser.email,
    password: newUser.password
  }
  const poiService = new PoiService(fixtures.poiService);
  chai.use(chaiExclude);

  suiteSetup(async function()
  {
    await poiService.deleteAllUsers();
    returnedUser = await poiService.createUser(newUser);
    await poiService.authenticate(newUserAuth);

  });

  suiteTeardown(async function()
  {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });

  setup(async function()
  {
    await poiService.deleteAllCategories();
    await poiService.deleteAllLocations();
    await poiService.deleteAllImages();
    await poiService.deleteAllPois();
  });

  teardown(async function()
  {
    await poiService.deleteAllCategories();
    await poiService.deleteAllLocations();
    await poiService.deleteAllImages();
    await poiService.deleteAllPois();
  });

  //Test creating a new POI
  test('create a poi', async function()
  {
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

    await poiService.createPoi(category._id, newPoi);
    const returnedPois = await poiService.getPois();
    assert.equal(returnedPois.length, 1);
    pois.unshift(newPoi);
    //  needed to remove image as it was returned in an array
    assert.deepEqualExcluding(returnedPois[0], pois[0] , ['user','image','_proto_', '_id', '__v']);
    // check the authenticated user is the poi's user num of Poi
    // has changed due to the addition of a new Poi
    assert.deepEqualExcluding(returnedPois[0].user, returnedUser.user, ['numOfPoi']);
  //  check there is only one image saved in the array
    assert.equal(returnedPois[0].image.length, 1);
  //  check the Poi image saved in the array of images is correct
    //  image
    assert.deepEqual(returnedPois[0].image[0], newPoi.image);
  });

  // Test creating multiple Pois
  test('create multiple pois', async function()
  {
    const image = await poiService.createImage(newImage);
    const location = await poiService.createLocation(newLocation);
    const category = await poiService.createCategory(newCategory);
    const poiArray = [];

    for (var i = 0; i < pois.length; i++)
    {
      const thisPoi = {
        "name": pois[i].name,
        "description": pois[i].description,
        "category": category,
        "location": location,
        "image": image
      }
      const p = await poiService.createPoi(category._id, thisPoi);
      poiArray.push(thisPoi);
    }

    const returnedPois = await poiService.getPois();
    // check for the correct number of pois created
    assert.equal(returnedPois.length, poiArray.length);
    for (var i = 0; i < pois.length; i++)
    {
      assert.deepEqualExcluding(returnedPois[i], poiArray[i], ['user', 'image', '_id', '__v', '_proto_']);
      assert.deepEqualExcluding(returnedPois[0].user, returnedUser.user, ['numOfPoi']);
      assert.equal(returnedPois[i].image.length, 1);
      assert.deepEqual(returnedPois[i].image[0], poiArray[i].image);
    }
  });


  // Test getting a single poi
  test('get a single poi', async function()
  {
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
    const p1 = await poiService.createPoi(category._id, newPoi);
    const p2 = await poiService.getPoi(p1._id);
    // deep equal would not work here as create poi returns the poi
    // with it objects for category, location and image where as
    // the get poi only returns object ids
    // for  category, location and image
    assert.equal(p1._id, p2._id);
    assert.equal(p1.name, p2.name);
    assert.equal(p1.description, p2.description);
    assert.equal(p1.category, p2.category._id);
    assert.equal(p1.location, p2.location._id);
    assert.equal(p1.image, p2.image[0]._id);
  });

  // Test getting an invalid poi return null
  test('get invalid poi', async function()
  {
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
    await poiService.createPoi(category._id, newPoi);
    const p1 = await poiService.getPoi('1234');
    assert.isNull(p1);
    const p2 = await poiService.getPoi('429088498328490328490829489320');
    assert.isNull(p2);
  });

  //Delete a single Poi with its id
  test('delete a poi', async function()
  {
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
    let poi = await poiService.createPoi(category._id, newPoi);

    assert(poi._id != null);
    await poiService.deleteOnePoi(poi._id);
    poi = await poiService.getPoi(poi._id);
    assert(poi == null);
  });

//  test to get all pois
  test('get all pois', async function()
  {
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
    const poiArray = [];

    // for each poi add the extra needed objects category,
    // location, and image and then create the poi
    for (var i = 0; i < pois.length; i++)
    {
      const thisPoi = {
        "name": pois[i].name,
        "description": pois[i].description,
        "category": category,
        "location": location,
        "image": image
      }
      const p = await poiService.createPoi(category._id, thisPoi);
      poiArray.push(thisPoi);
    }
    const allPois = await poiService.getPois();
    assert.equal(allPois.length, poiArray.length);
  });


//  test to check tha the get method retrieves all pois
  test('get pois detail', async function()
  {
    const image = await poiService.createImage(newImage);
    const location = await poiService.createLocation(newLocation);
    const category = await poiService.createCategory(newCategory);
    const poiArray = [];

    // for each poi add the extra needed objects category,
    // location, and image and then create the poi
    for (var i = 0; i < pois.length; i++)
    {
      const thisPoi = {
        "name": pois[i].name,
        "description": pois[i].description,
        "category": category,
        "location": location,
        "image": image
      }
      const p = await poiService.createPoi(category._id, thisPoi);
      poiArray.push(thisPoi);
    }
    const returnedPois = await poiService.getPois();

    for (var i = 0; i < poiArray.length; i++)
    {
      //  needed to remove image as it was returned in an array
      assert.deepEqualExcluding(returnedPois[i], poiArray[i] , ['user','image','_proto_', '_id', '__v']);
      assert.equal(returnedPois[i].user._id, returnedUser.user._id);
      //  check the Poi image saved in the array of images is the
      //  correct image
      assert.deepEqual(returnedPois[i].image[0], poiArray[i].image);
    }
  });

//  Test getting an empty array of pois
  test('get all pois empty', async function()
  {
    const allPois = await poiService.getPois();
    assert.equal(allPois.length, 0);
  });

  // Check the user stored in the Poi is the authenticated user
  test('create a poi and check user', async function()
  {
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
    await poiService.createPoi(category._id, newPoi);
    const returnedPois = await poiService.getPois();
    assert.isDefined(returnedPois[0].user);

    const users = await poiService.getUsers();
    assert.deepEqualExcluding(users[0], newUser, ['password','__v', '_id', 'scope', 'numOfPoi']);
  });

  // Test updating a Pois name
  test('update Poi name', async function()
  {
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
    const poi = await poiService.createPoi(category._id, newPoi);
    const updatePoi = {
      "name": 'UPDATE NAME',
      "description": poi.description,
      "category": poi.category,
    }
    const updatedPoi = await poiService.updatePoi(poi._id, updatePoi);
    const pois = await poiService.getPois();
    assert.equal(pois[0].name, updatedPoi.name, updatePoi.name);
  });

  // Test updating a Pois description
  test('update Poi description', async function()
  {
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
    const poi = await poiService.createPoi(category._id, newPoi);
    const updatePoi = {
      "name": poi.name,
      "description": "update description",
      "category": poi.category,
    }
    const updatedPoi = await poiService.updatePoi(poi._id, updatePoi);
    const pois = await poiService.getPois();
    assert.equal(pois[0].description, updatedPoi.description, updatePoi.description);
  });

  // Test updating a Pois Category
  test('update Poi category', async function()
  {
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
    const poi = await poiService.createPoi(category._id, newPoi);
    const newcategory = await poiService.createCategory(newCategory);
    const updatePoi = {
      "name": poi.name,
      "description": poi.description,
      "category": newcategory,
    }
    const updatedPoi = await poiService.updatePoi(poi._id, updatePoi);
    const pois = await poiService.getPois();
    assert.deepEqual(pois[0].category._id, updatedPoi.category);
  });


  // Test updating all three category, name and description of a Poi
  test('update Poi category, name and description', async function()
  {
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
    const poi = await poiService.createPoi(category._id, newPoi);
    const newcategory = await poiService.createCategory(newCategory);
    const updatePoi = {
      "name": 'update name',
      "description": 'update description',
      "category": newcategory,
    }
    const updatedPoi = await poiService.updatePoi(poi._id, updatePoi);
    const pois = await poiService.getPois();
    assert.equal(pois[0].name, updatedPoi.name, updatePoi.name);
    assert.equal(pois[0].description, updatedPoi.description, updatePoi.description);
    assert.deepEqual(pois[0].category._id, updatedPoi.category);
  });

  // Test adding image details to a Poi
  test('add an image to a poi', async function ()
  {
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
    const poi = await poiService.createPoi(category._id, newPoi);
    const imageTwo = await poiService.createImage(newImage);
    const addImage = {
      "img_id": imageTwo._id,
      "poi_id": poi._id
    }
    const updatedPoi = await poiService.addImageToPoi(addImage);
    assert.equal(updatedPoi.image.length, 2);
    assert.equal(updatedPoi.image[1]._id, imageTwo._id);
  });

  // Test finding pois by their category
  test('find poi by category', async function()
  {
    const image = await poiService.createImage(newImage);
    const location = await poiService.createLocation(newLocation);
    const categoryOne = await poiService.createCategory(newCategory);
    const newPoiWithCategoryOne = {
      "name": basicPoi.name,
      "description": basicPoi.description,
      "category": categoryOne,
      "location": location,
      "image": image
    }
    const poiOneCatOne = await poiService.createPoi(categoryOne._id, newPoiWithCategoryOne);
    const poiTwoCatOne = await poiService.createPoi(categoryOne._id, newPoiWithCategoryOne);

    const categoryTwo = await poiService.createCategory(newCategory);
    const newPoiWithCategoryTwo = {
      "name": basicPoi.name,
      "description": basicPoi.description,
      "category": categoryTwo,
      "location": location,
      "image": image
    }
    const poiOneCatTwo = await poiService.createPoi(categoryTwo._id, newPoiWithCategoryTwo);

    const returnedPoisCatOne = await poiService.getPoiByCategory(categoryOne._id);
    assert.equal(returnedPoisCatOne.length, 2);
    assert.equal(returnedPoisCatOne[0]._id, poiOneCatOne._id);
    assert.equal(returnedPoisCatOne[1]._id, poiTwoCatOne._id);

    const returnedPoisCatTwo = await poiService.getPoiByCategory(categoryTwo._id);
    assert.equal(returnedPoisCatTwo.length, 1);
    assert.equal(returnedPoisCatTwo[0]._id, poiOneCatTwo._id);
  });

  // Test finding a poi by their user
  test('find poi by user', async function()
  {
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
    // create a poi for the original authenticated user.
    const poiOriginalUser = await poiService.createPoi(category._id, newPoi);

    // create & authenticate a new user and create 2 new pois for this
    // user
    await poiService.deleteAllUsers();
    poiService.clearAuth();
    returnedUser = await poiService.createUser(newUser);
    await poiService.authenticate(newUserAuth);

    const poiNewUser = await poiService.createPoi(category._id, newPoi);
    const poi2NewUser = await poiService.createPoi(category._id, newPoi);

    const returnedPois = await poiService.getPoiByUser();
    assert.equal(returnedPois.length, 2);
    assert.equal(returnedPois[0]._id, poiNewUser._id);
    assert.equal(returnedPois[1]._id, poi2NewUser._id);
  });
})